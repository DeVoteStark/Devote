// app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import connectToDb from "../../../../lib/mongodb/mongodb";
import User from "../../../../models/user";
import { VerificationUtils } from "../../../../lib/verification";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    
    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and verification code are required" },
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

    // Check if user has exceeded attempts
    if (VerificationUtils.hasExceededAttempts(user.emailVerificationAttempts)) {
      return NextResponse.json(
        { 
          message: "Too many failed attempts. Please request a new verification code.",
          requireNewCode: true 
        },
        { status: 429 }
      );
    }

    // Check if code has expired
    if (VerificationUtils.isCodeExpired(user.emailVerificationExpires)) {
      return NextResponse.json(
        { 
          message: "Verification code has expired. Please request a new one.",
          expired: true 
        },
        { status: 400 }
      );
    }

    // Increment attempts
    user.emailVerificationAttempts += 1;
    await user.save();

    // Verify the code
    if (!VerificationUtils.verifyCode(code, user.emailVerificationCode)) {
      const attemptsLeft = 5 - user.emailVerificationAttempts;
      return NextResponse.json(
        { 
          message: `Invalid verification code. ${attemptsLeft} attempts remaining.`,
          attemptsLeft 
        },
        { status: 400 }
      );
    }

    // Success! Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = ""; // Clear the code
    user.emailVerificationExpires = new Date(); // Set to past date
    user.emailVerificationAttempts = 0;
    await user.save();

    return NextResponse.json(
      { 
        message: "Email verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}