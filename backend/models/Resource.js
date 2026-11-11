
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    scheme: {
      type: String,
      enum: ["2022", "2025"],
      required: true,
      index: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // Required only for Notes (validated in the route)
    module: {
      type: Number,
      min: 1,
      max: 5,
    },

    // Required only for PYQ (validated in the route)
    questionPaperYear: {
      type: Number,
      min: 2000,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    // Available resource categories
    resourceType: {
      type: String,
      enum: ["Notes", "Syllabus", "Model QP", "PYQ", "Other"],
      required: true,
    },

    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Optimized for category-based resource retrieval
resourceSchema.index({ subjectCode: 1, module: 1 });

resourceSchema.index({
  subjectCode: 1,
  resourceType: 1,
  questionPaperYear: 1,
});

export default mongoose.model("Resource", resourceSchema);
