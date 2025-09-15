import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import Citizen from "../../../models/citizen";
import User from "../../../models/user";
import crypto from "crypto";
import { EmailService } from "../../../lib/email";
import {
  generateOTP,
  generateVerificationToken,
  getOTPExpiryTime,
} from "../../../lib/otp";

function hashIne(ine: string): string {
  return crypto.createHash("sha256").update(ine).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email, ine } = await req.json();
    if (!email || !ine) {
      return NextResponse.json(
        { message: "Email and ine are required" },
        { status: 400 }
      );
    }

    await connectToDb();
    const citizen = await Citizen.findOne({ ine }).exec();
    if (!citizen) {
      return NextResponse.json(
        { message: "Citizen not found with provided ine" },
        { status: 404 }
      );
    }

    const hashedIne = hashIne(ine);
    const existingUser = await User.findOne({ hasIne: hashedIne }).exec();
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with provided ine" },
        { status: 400 }
      );
    }

    const name = `${citizen.firstName} ${citizen.lastName}`;

    // Generate verification token and OTP
    const verificationToken = generateVerificationToken();
    const otp = generateOTP();
    const otpExpiry = getOTPExpiryTime(15); // 15 minutes

    // Create user without wallet (wallet will be created after email verification)
    const newUser = new User({
      walletId: "", // Will be set after email verification
      name,
      email,
      hashIne: hashedIne,
      secretKey: "", // Will be set after password creation
      isEmailVerified: false,
      passwordSet: false,
      verificationToken,
      otp,
      otpExpiry,
    });

    await newUser.save();

    // Send verification email with OTP
    const emailService = new EmailService();
    const subject = "Complete Your DeVote Account Setup";

    const frontendUrl =
      process.env.FRONTEND_URL || "https://devote-nine.vercel.app/";
    const verificationUrl = `${frontendUrl}/sign-up?token=${verificationToken}`;

    const text = `Welcome to DeVote! Your account has been created. Please complete your setup by verifying your email and setting your password.

      Verification Code: ${otp}
      Verification Link: ${verificationUrl}

      This code will expire in 15 minutes.`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to DeVote!</h2>
        <p>Your account has been created successfully. To complete your setup, please:</p>
        
        <ol>
          <li>Click the verification link below</li>
          <li>Enter the verification code</li>
          <li>Set your password</li>
        </ol>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Verification Code:</h3>
          <p style="font-size: 24px; font-weight: bold; color: #4F46E5; letter-spacing: 4px; text-align: center;">${otp}</p>
          <p style="font-size: 14px; color: #6B7280;">This code will expire in 15 minutes.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Complete Setup</a>
        </div>
        
        <p style="font-size: 14px; color: #6B7280;">
          If you didn't request this account, please ignore this email.
        </p>
      </div>
    `;

    await emailService.sendMail(newUser.email, subject, text, html);

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to complete setup.",
        userId: newUser._id,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Error creating user:",
      error?.response?.data || error.message
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectToDb();
    const users = await User.find({}).lean().exec();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
