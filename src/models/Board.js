import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema(
  {
    boardName: {
      type: String,
      required: true, // e.g., "Staff Selection Commission"
      trim: true,
    },
    boardShortName: {
      type: String,
      required: true, // e.g., "SSC"
      uppercase: true,
      trim: true,
    },
    boardSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String, // URL to the board logo image
      default: "",
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

export default mongoose.models.Board || mongoose.model("Board", BoardSchema);