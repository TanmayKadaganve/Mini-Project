// Resource data model

import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {

    subjectCode: {
  type: String,
  required: true,
  trim: true,
  uppercase: true,
  index: true,
},

    scheme: {
      type: String,
      enum: [ "2022", "2025"],
      required: true,
      index: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
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

    module: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    resourceType: {
      type: String,
      default: "Study Material",
      trim: true,
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

resourceSchema.index({
  scheme: 1,
  branch: 1,
  semester: 1,
  subject: 1,
  module: 1,
});

export default mongoose.model("Resource", resourceSchema);