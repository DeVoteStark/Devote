import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import Citizen from "../../../models/citizen";
import User from "../../../models/user";
import crypto from "crypto";
// KYC imports removed - no longer needed
// import { createKyc, getSdkLink } from "../../../lib/kyc";
import { EmailService } from "../../../lib/email";
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

    const name = `${citizen.firstName} ${citizen.lastName}`;
    const privateKey = generatePrivateKeyEncrypted("1234");
    const walletAddress = getFutureWalletAdressFromPrivateKey(
      privateKey,
      "1234"
    );

    const newUser = new User({
      walletId: walletAddress,
      name,
      email,
      hashIne: hashedIne,
      // KYC fields removed - lines 30-36, 48, 61-63, 69, 71 deleted
      secretKey: privateKey,
    });

    await newUser.save();

    // KYC creation logic removed - no longer needed
    // const kycId = await createKyc(String(newUser._id), newUser.email);
    // newUser.kycId = kycId;
    // await newUser.save();

    const emailService = new EmailService();
    const subject = "Account Created Successfully";
    
    // Updated email message as requested (lines 75-84)
    const frontendUrl = process.env.FRONTEND_URL || "https://devote-nine.vercel.app/"; 
    const verificationUrl = `${frontendUrl}/verification-submitted?id=${newUser._id}`;
    
    const text = `A user account has been created for you. Please click the following link to set your password: ${verificationUrl}`;
    const html = `<p>A user account has been created for you. Please click the following link to set your password:</p>
                  <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                  <p><strong>⚠️ NOTE: Before testing this flow, make sure to send Sepolia ETH to the generated wallet before clicking the link in the email.</strong></p>`;

    await emailService.sendMail(newUser.email, subject, text, html);

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
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