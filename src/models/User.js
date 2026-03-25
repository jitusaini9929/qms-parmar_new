import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "USER", "REVIEWER", "CONTENT_WRITER"], default: "USER" },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "BANNED"],
      default: "PENDING",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
