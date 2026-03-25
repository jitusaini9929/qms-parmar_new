import mongoose from "mongoose";

const WriterPermissionSchema = new mongoose.Schema(
  {
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    exams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
  },
  { timestamps: true }
);

// Ensure one document per writer-board pair
WriterPermissionSchema.index({ writer: 1, board: 1 }, { unique: true });

export default mongoose.models.WriterPermission ||
  mongoose.model("WriterPermission", WriterPermissionSchema);
