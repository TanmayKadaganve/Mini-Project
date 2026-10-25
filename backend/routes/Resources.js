import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { Readable } from "stream";
import Resource from "../models/Resource.js";


const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

function validObjectId(id) {
  return mongoose.isValidObjectId(id);
}

// List resources for the exact scheme, branch, semester,
// subject and module.
router.get("/", async (req, res) => {
  try {
    const { scheme, branch, semester, subject, module } = req.query;

    if (!scheme || !branch || !semester || !subject || !module) {
      return res.status(400).json({
        message: "All academic filters are required.",
      });
    }

    const resources = await Resource.find({
      scheme,
      branch,
      semester: Number(semester),
      subject,
      module: Number(module),
    })
      .select("-fileId")
      .sort({ uploadedAt: -1 })
      .lean();

    res.json({ resources });
  } catch (error) {
    console.error("List resources error:", error);
    res.status(500).json({ message: "Could not load resources." });
  }
});

// Upload a PDF to GridFS and save its metadata.
// Protect this endpoint with faculty authentication before production.
router.post("/upload", upload.single("pdf"), async (req, res) => {
  let uploadedFileId;

  try {
    const {
      scheme,
      branch,
      semester,
      subject,
      module,
      resourceType,
    } = req.body;

    if (
      !req.file ||
      !scheme ||
      !branch ||
      !semester ||
      !subject ||
      !module
    ) {
      return res.status(400).json({
        message: "PDF and all academic fields are required.",
      });
    }

    if (!["2018", "2025"].includes(scheme)) {
      return res.status(400).json({ message: "Invalid scheme." });
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
      _id: fileId,
      contentType: "application/pdf",
      metadata: {
        scheme,
        branch,
        semester: Number(semester),
        subject,
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
      branch: branch.trim(),
      semester: Number(semester),
      subject: subject.trim(),
      module: Number(module),
      originalName: safeName,
      resourceType: resourceType || "Study Material",
      fileId,
      fileSize: req.file.size,
    });

    res.status(201).json({
      message: "PDF uploaded successfully.",
      resource: {
        _id: resource._id,
        originalName: resource.originalName,
        resourceType: resource.resourceType,
      },
    });
  } catch (error) {
    // Avoid leaving an orphaned GridFS file if metadata saving fails.
    if (uploadedFileId && req.app.locals.gridFSBucket) {
      try {
        await req.app.locals.gridFSBucket.delete(uploadedFileId);
      } catch {
        // The file may not have finished uploading.
      }
    }

    console.error("Upload resource error:", error);
    res.status(500).json({ message: "PDF upload failed." });
  }
});

// Shared handler for inline viewing and downloading.
async function sendPDF(req, res, disposition) {
  try {
    if (!validObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid resource ID." });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    const bucket = req.app.locals.gridFSBucket;

    if (!bucket) {
      return res.status(503).json({
        message: "File storage is not ready.",
      });
    }

    const file = await bucket.find({ _id: resource.fileId }).next();

    if (!file) {
      return res.status(404).json({ message: "PDF file not found." });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Disposition", `${disposition}; filename="resource.pdf"`);

    const stream = bucket.openDownloadStream(resource.fileId);

    stream.on("error", (error) => {
      console.error("PDF stream error:", error);
      if (!res.headersSent) {
        res.status(500).end("Unable to stream PDF.");
      } else {
        res.destroy(error);
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Read PDF error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Unable to read PDF." });
    }
  }
}

router.get("/:id/view", (req, res) => sendPDF(req, res, "inline"));

router.get("/:id/download", (req, res) =>
  sendPDF(req, res, "attachment")
);

export default router;