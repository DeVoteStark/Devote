import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import User from "../../../models/user";
import { generateOTP, getOTPExpiryTime } from "../../../lib/otp";
import { EmailService } from "../../../lib/email";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectToDb();

    // Find user by verification token
    const user = await User.findOne({ verificationToken: token }).exec();
    if (!user) {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if user already has password set
    if (user.passwordSet) {
      return NextResponse.json(
        { message: "User already completed signup" },
        { status: 400 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiryTime(15); // 15 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailService = new EmailService();
    const subject = "Your DeVote Verification Code";
    const text = `Your verification code is: ${otp}\n\nThis code will expire in 15 minutes.`;
    const html = `
      <h2>DeVote Email Verification</h2>
      <p>Your verification code is:</p>
      <h1 style="font-size: 32px; color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `;

    await emailService.sendMail(user.email, subject, text, html);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error resending OTP:", error?.message || error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}