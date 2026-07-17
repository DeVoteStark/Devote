import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import Citizen from "../../../models/citizen";
import User from "../../../models/user";
import crypto from "crypto";
import { EmailService } from "../../../lib/email";
import { VerificationUtils } from "../../../lib/verification";
import {
  generatePrivateKeyEncrypted,
  getFutureWalletAdressFromPrivateKey,
} from "@/lib/starknet/createWallet";

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

    // Check for existing email
    const existingEmail = await User.findOne({ email }).exec();
    if (existingEmail) {
      return NextResponse.json(
        { message: "User already exists with provided email" },
        { status: 400 }
      );
    }

    const name = `${citizen.firstName} ${citizen.lastName}`;
    const privateKey = generatePrivateKeyEncrypted("1234");
    const walletAddress = getFutureWalletAdressFromPrivateKey(
      privateKey,
      "1234"
    );

    // Generate verification code for email verification
    const verificationCode = VerificationUtils.generateVerificationCode();
    const hashedCode = VerificationUtils.hashVerificationCode(verificationCode);
    const expirationDate = VerificationUtils.getExpirationDate();

    const newUser = new User({
      walletId: walletAddress,
      name,
      email,
      hashIne: hashedIne,
      secretKey: privateKey,
      // Email verification fields
      isEmailVerified: false,
      emailVerificationCode: hashedCode,
      emailVerificationExpires: expirationDate,
      emailVerificationAttempts: 0,
      lastVerificationEmailSent: new Date(),
    });

    await newUser.save();

    // Send verification email instead of account creation email
    const emailService = new EmailService();
    const { subject, text, html } = VerificationUtils.generateVerificationEmail(
      verificationCode,
      newUser.name
    );

    await emailService.sendMail(newUser.email, subject, text, html);

    return NextResponse.json(
      { 
        message: "User created successfully. Verification email sent.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          walletId: newUser.walletId,
          isEmailVerified: newUser.isEmailVerified
        },
        verificationSent: true,
        expiresAt: expirationDate
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