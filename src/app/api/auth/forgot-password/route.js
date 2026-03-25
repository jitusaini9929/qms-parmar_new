import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import crypto from "crypto";
import sendMail from "@/lib/sendMail";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal if a user exists
      return NextResponse.json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    // logic: Generate token, save to DB, send email via Resend/Nodemailer
    console.log(`Reset link requested for: ${email}`);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    console.log(`Generated reset token: ${resetToken}`);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;
    console.log(`Reset URL: ${resetUrl}`);
    await sendMail({
      to: email,
      subject: "Password Reset link | qms.parmarssc.in",
      text: `You are receiving this email because you (or someone else) has requested the reset of a password for your accoount. Please make a PUT request to: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`,
      html: `<p>You are receiving this email because you (or someone else) has requested the reset of a password for your accoount. Please make a PUT request to: <a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore this email.</p>`,
    });

    return NextResponse.json({ message: "Reset link sent successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
