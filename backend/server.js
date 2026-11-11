import dns from "node:dns";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import resourceRoutes from "./routes/Resources.js";

import facultyAuthRoutes from "./routes/FacultyAuth.js";

import labResourcesRouter from "./routes/LabResources.js";



dns.setServers(["8.8.8.8", "8.8.4.4"]);


dotenv.config();
const app = express();



app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

app.use(express.json({ limit: "1mb" }));

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB);

    console.log("MongoDB connected successfully");

    app.locals.gridFSBucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: "resourceFiles" }
    );

    app.use("/api/resources", resourceRoutes);

    app.use("/api/lab-resources", labResourcesRouter);

    app.use("/api/faculty", facultyAuthRoutes);

    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();