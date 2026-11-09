
import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      enum: [
        "FIRST YEAR",
        "CSE",
        "AIML",
        "ECE",
        "MECHANICAL",
        "CIVIL",
      ],
    },

    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Faculty =
  mongoose.models.Faculty ||
  mongoose.model("Faculty", facultySchema);

export default Faculty;
