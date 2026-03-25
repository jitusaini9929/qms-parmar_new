import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    slug: { 
      type: String, 
      lowercase: true, 
      unique: true 
    },
    description: { 
      type: String 
    },
    category: {
      type: String,
      enum: ["MOCK_TEST", "PRACTICE_SET", "PREVIOUS_YEAR", "EXPORT_BUNDLE"],
      default: "PRACTICE_SET"
    },
    // The Core Hierarchy (Optional: to group collections by Exam)
    exam: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Exam"
    },
    subject: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Subject"
    },
    topic: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Topic"
    },
    // The main list of question references
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      }
    ],
    // Metadata for Test Cases
    settings: {
      totalDuration: { type: Number, default: 60 }, // in minutes
      totalMarks: { type: Number, default: 100 },
      isPublic: { type: Boolean, default: false },
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

// Auto-generate slug before saving if not provided
CollectionSchema.pre("save", async function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
});

CollectionSchema.index(
  { title: 1},
  { unique: true }
);

export default mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);