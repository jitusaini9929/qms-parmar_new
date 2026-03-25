import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true, trim: true }, // e.g., "Combined Graduate Level"
    examYear: { type: Number, required: true, default: () => new Date().getFullYear() }, // Dynamically sets current year // e.g., 2025
    examSlug: { type: String, unique: true, lowercase: true },
    duration: { type: Number, default: 60 }, // in minutes
    totalMarks: { type: Number, default: 100 },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// --- Middleware to Auto-generate Slug ---
ExamSchema.pre("validate", function (next) {
  if (this.examName && !this.examSlug) {
    // Generates slug from name and year, e.g., "CGL 2026" -> "cgl-2026"
    this.examSlug = slugify(`${this.examName} ${this.examYear}`, {
      lower: true,
      strict: true,
    });
  }

  //next();
});

export default mongoose.models.Exam || mongoose.model("Exam", ExamSchema);