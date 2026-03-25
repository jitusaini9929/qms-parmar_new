import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    shiftName: {
      type: String, 
      required: true, // e.g., "Morning", "Evening"
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // e.g., "09:00 AM"
      required: true,
    },
    endTime: {
      type: String, // Optional per your request
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Shift || mongoose.model("Shift", ShiftSchema);