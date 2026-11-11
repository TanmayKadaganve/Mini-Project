
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Faculty from "../models/Faculty.js";

const router = express.Router();

const allowedBranches = [
   "FIRST YEAR",
  "CSE",
  "AIML",
  "ECE",
  "MECHANICAL",
  "CIVIL",
];

router.post("/login", async (req, res) => {
  try {
    const { branch, password } = req.body;

    // Validate the input
    if (!branch || !password) {
      return res.status(400).json({
        message: "Branch and password are required",
      });
    }

    const normalizedBranch = branch.trim().toUpperCase();

    // Check whether the branch is allowed
    if (!allowedBranches.includes(normalizedBranch)) {
      return res.status(400).json({
        message: "Invalid branch",
      });
    }

    // Find the branch's faculty credential
    const faculty = await Faculty.findOne({
      branch: normalizedBranch,
    });

    if (!faculty) {
      return res.status(401).json({
        message: "Invalid branch or password",
      });
    }

    // Compare the entered password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      faculty.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid branch or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        branch: faculty.branch,
        role: "faculty",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      message: "Faculty login successful",
      token,
      branch: faculty.branch,
      role: "faculty",
    });
} catch (error) {
  console.error("JWT verification failed:", error.name, error.message);

  return res.status(401).json({
    message: "Invalid or expired token",
  });
}
});

export default router;
