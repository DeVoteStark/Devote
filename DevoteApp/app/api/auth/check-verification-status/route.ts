import { NextResponse } from "next/server";
import connectToDb from "../../../../lib/mongodb/mongodb";
import User from "../../../../models/user";
import { VerificationUtils } from "../../../../lib/verification";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
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

    return NextResponse.json(
      { 
        isEmailVerified: user.isEmailVerified,
        hasVerificationCode: !!user.emailVerificationCode,
        codeExpired: user.emailVerificationExpires ? 
          VerificationUtils.isCodeExpired(user.emailVerificationExpires) : true,
        attemptsUsed: user.emailVerificationAttempts,
        canRequestNew: VerificationUtils.canSendEmail(user.lastVerificationEmailSent)
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error checking verification status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}