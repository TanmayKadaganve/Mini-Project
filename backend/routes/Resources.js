
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { Readable } from "stream";

import Resource from "../models/Resource.js";
import { facultyAuth } from "../middleware/facultyAuth.js";

const router = express.Router();

const allowedBranches = [
  "FIRST YEAR",
  "CSE",
  "AIML",
  "ECE",
  "MECHANICAL",
  "CIVIL",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

function validObjectId(id) {
  return mongoose.isValidObjectId(id);
}

// ==================================================
// GET: List resources
// Public access for students and faculty
// ==================================================

router.get("/", async (req, res) => {
  
  try {
    const {
      scheme,
      branch,
      semester,
      subject,
      module,
    } = req.query;
const normalizedBranch = branch.trim().toUpperCase();
    if (
      !scheme ||
      !branch ||
      !semester ||
      !subject ||
      !module
    ) {
      return res.status(400).json({
        message: "All academic filters are required.",
      });
    }

    const resources = await Resource.find({
      scheme,
      branch: normalizedBranch,
      semester: Number(semester),
      subject,
      module: Number(module),
    })
      .select("-fileId")
      .sort({ uploadedAt: -1 })
      .lean();

    return res.json({ resources });
  } catch (error) {
    console.error("List resources error:", error);

    return res.status(500).json({
      message: "Could not load resources.",
    });
  }
});

// ==================================================
// POST: Upload PDF
// Faculty authentication required
// Branch comes from the verified JWT
// ==================================================

router.post(
  "/upload",
  facultyAuth,
  upload.single("pdf"),
  async (req, res) => {
    let uploadedFileId;

    try {
      const {
        scheme,
        semester,
        subject,
        module,
        resourceType,
      } = req.body;

      // Never trust the branch sent by the frontend.
      const branch = req.faculty.branch
        .trim()
        .toUpperCase();

      if (!allowedBranches.includes(branch)) {
        return res.status(403).json({
          message: "Invalid faculty branch.",
        });
      }

      if (
        !req.file ||
        !scheme ||
        !semester ||
        !subject ||
        !module
      ) {
        return res.status(400).json({
          message: "PDF and all academic fields are required.",
        });
      }

      if (!["2022", "2025"].includes(scheme)) {
        return res.status(400).json({
          message: "Invalid scheme.",
        });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF files are allowed.",
        });
      }

      if (
        !Number.isInteger(Number(semester)) ||
        Number(semester) < 1 ||
        Number(semester) > 8 ||
        !Number.isInteger(Number(module)) ||
        Number(module) < 1 ||
        Number(module) > 5
      ) {
        return res.status(400).json({
          message: "Invalid semester or module.",
        });
      }

      if (!subject.trim()) {
        return res.status(400).json({
          message: "Subject is required.",
        });
      }

      const bucket = req.app.locals.gridFSBucket;

      if (!bucket) {
        return res.status(503).json({
          message: "File storage is not ready.",
        });
      }

      const safeName = req.file.originalname
        .replace(/[\\/]/g, "_")
        .slice(0, 180);

      const fileId = new mongoose.Types.ObjectId();

      uploadedFileId = fileId;

      const stream = bucket.openUploadStream(safeName, {
        id: fileId,
        contentType: "application/pdf",
        metadata: {
          scheme,
          branch,
          semester: Number(semester),
          subject: subject.trim(),
          module: Number(module),
        },
      });

      await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", resolve);

        Readable.from(req.file.buffer).pipe(stream);
      });

      const resource = await Resource.create({
        scheme,
        branch,
        semester: Number(semester),
        subject: subject.trim(),
        module: Number(module),
        originalName: safeName,
        resourceType:
          resourceType?.trim() || "Study Material",
        fileId,
        fileSize: req.file.size,
      });

      return res.status(201).json({
        message: "PDF uploaded successfully.",
        resource: {
          _id: resource._id,
          originalName: resource.originalName,
          resourceType: resource.resourceType,
        },
      });
    } catch (error) {
      // Clean up the GridFS file if metadata creation fails.
      if (
        uploadedFileId &&
        req.app.locals.gridFSBucket
      ) {
        try {
          await req.app.locals.gridFSBucket.delete(
            uploadedFileId
          );
        } catch {
          // File may not have completed uploading.
        }
      }

      console.error("Upload resource error:", error);

      return res.status(500).json({
        message: "PDF upload failed.",
      });
    }
  }
);

// ==================================================
// DELETE: Delete resource
// Faculty authentication required
// Faculty can delete only their own branch resources
// ==================================================

router.delete(
  "/:id",
  facultyAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!validObjectId(id)) {
        return res.status(400).json({
          message: "Invalid resource ID.",
        });
      }

      const resource = await Resource.findById(id);

      if (!resource) {
        return res.status(404).json({
          message: "Resource not found.",
        });
      }

      const facultyBranch = req.faculty.branch
        .trim()
        .toUpperCase();

      // Prevent cross-branch deletion.
      if (
        resource.branch.trim().toUpperCase() !==
        facultyBranch
      ) {
        return res.status(403).json({
          message:
            "You cannot delete resources belonging to another branch.",
        });
      }

      const bucket = req.app.locals.gridFSBucket;

      if (!bucket) {
        return res.status(503).json({
          message: "File storage is not ready.",
        });
      }

      // Delete the PDF from GridFS.
      await bucket.delete(resource.fileId);

      // Delete the resource metadata from MongoDB.
      await Resource.findByIdAndDelete(id);

      return res.json({
        message: "Resource deleted successfully.",
      });
    } catch (error) {
      console.error("Delete resource error:", error);

      return res.status(500).json({
        message: "Could not delete resource.",
      });
    }
  }
);

// ==================================================
// Shared handler for viewing and downloading PDFs
// Public access
// ==================================================

async function sendPDF(req, res, disposition) {
  try {
    if (!validObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid resource ID.",
      });
    }

    const resource = await Resource.findById(
      req.params.id
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found.",
      });
    }

    const bucket = req.app.locals.gridFSBucket;

    if (!bucket) {
      return res.status(503).json({
        message: "File storage is not ready.",
      });
    }

    const file = await bucket
      .find({ _id: resource.fileId })
      .next();

    if (!file) {
      return res.status(404).json({
        message: "PDF file not found.",
      });
    }

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );

    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="resource.pdf"`
    );

    const stream = bucket.openDownloadStream(
      resource.fileId
    );

    stream.on("error", (error) => {
      console.error("PDF stream error:", error);

      if (!res.headersSent) {
        res.status(500).end(
          "Unable to stream PDF."
        );
      } else {
        res.destroy(error);
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Read PDF error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Unable to read PDF.",
      });
    }
  }
}

// View PDF in browser
router.get("/:id/view", (req, res) =>
  sendPDF(req, res, "inline")
);

// Download PDF
router.get("/:id/download", (req, res) =>
  sendPDF(req, res, "attachment")
);

export default router;
