import { NextResponse } from "next/server";
import connectToDb from "../../../../lib/mongodb/mongodb";
import User from "../../../../models/user";
import { EmailService } from "../../../../lib/email";
import { VerificationUtils } from "../../../../lib/verification";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDb();
    
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (!VerificationUtils.canSendEmail(user.lastVerificationEmailSent)) {
      return NextResponse.json(
        { message: "Please wait before requesting another verification email" },
        { status: 429 }
      );
    }

    // Generate new verification code
    const verificationCode = VerificationUtils.generateVerificationCode();
    const hashedCode = VerificationUtils.hashVerificationCode(verificationCode);
    const expirationDate = VerificationUtils.getExpirationDate();

    // Update user with new verification code
    user.emailVerificationCode = hashedCode;
    user.emailVerificationExpires = expirationDate;
    user.emailVerificationAttempts = 0; // Reset attempts
    user.lastVerificationEmailSent = new Date();
    await user.save();

    // Send verification email
    const emailService = new EmailService();
    const { subject, text, html } = VerificationUtils.generateVerificationEmail(
      verificationCode,
      user.name
    );

    await emailService.sendMail(user.email, subject, text, html);

    return NextResponse.json(
      { 
        message: "Verification email sent successfully",
        expiresAt: expirationDate 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}