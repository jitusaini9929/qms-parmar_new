import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      required: [true, "Topic name is mandatory"],
      trim: true,
    },
    topicSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      index: true,
      required: [true, "Topic must be linked to a Subject"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic", // Self-reference for sub-topics
      default: null,
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

export default mongoose.models.Topic || mongoose.model("Topic", TopicSchema);