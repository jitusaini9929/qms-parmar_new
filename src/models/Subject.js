import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, "Subject name is mandatory"],
      trim: true,
    },
    subjectSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subjectIcon: {
      type: String, // Icon name from Lucide (e.g., "calculator", "book")
      default: "book",
    },
    description: {
      type: String,
      default: "",
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

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);