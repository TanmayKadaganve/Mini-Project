
import mongoose from "mongoose";

const labResourceSchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      enum: [
        "FIRST YEAR",
        "CSE",
        "AIML",
        "ECE",
        "CIVIL",
        "MECHANICAL",
      ],
      index: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    googleDriveLink: {
      type: String,
      required: true,
      trim: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

labResourceSchema.index({
  branch: 1,
  semester: 1,
});

export default mongoose.model("LabResource", labResourceSchema);
