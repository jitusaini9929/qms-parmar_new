import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import sendMail from "@/lib/sendMail";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await connectDB();
    console.log(`Received password reset request with token: ${token}`);
    console.log(`Hashed token: ${hashedToken}`);

    // Find user with a valid, non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token is invalid or has expired." },
        { status: 400 }
      );
    }

    // Hash new password and clear the reset fields
    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    await user.save().then(() => {
      console.log("Password reset successful for user:", user.email);
      sendMail({
        to: user?.email,
        subject: "Password Reset Successful",
        text: `Your password has been successfully reset. If you did not request this change, please contact support immediately.`,
        html: `<p>Your password has been successfully reset. If you did not request this change, please contact support immediately.</p>`,
      });
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Error", error: error },
      { status: 500 }
    );
  }
}
