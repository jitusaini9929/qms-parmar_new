import mongoose from "mongoose";

const ReviewerPermissionSchema = new mongoose.Schema(
  {
    reviewer: {
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

// Ensure one document per reviewer-board pair
ReviewerPermissionSchema.index({ reviewer: 1, board: 1 }, { unique: true });

export default mongoose.models.ReviewerPermission ||
  mongoose.model("ReviewerPermission", ReviewerPermissionSchema);
