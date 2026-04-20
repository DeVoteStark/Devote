import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import User from "../../../models/user";
import { isOTPExpired } from "../../../lib/otp";
import {
  generatePrivateKeyEncrypted,
  getFutureWalletAdressFromPrivateKey,
} from "@/lib/starknet/createWallet";

export async function POST(req: Request) {
  try {
    const { token, otp, password } = await req.json();

    if (!token || !otp || !password) {
      return NextResponse.json(
        { message: "Token, OTP, and password are required" },
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
        { message: "Password already set for this user" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (!user.otpExpiry || isOTPExpired(user.otpExpiry)) {
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Generate wallet with user's password
    const privateKey = generatePrivateKeyEncrypted(password);
    const walletAddress = getFutureWalletAdressFromPrivateKey(privateKey, password);

    // Update user
    user.secretKey = privateKey;
    user.walletId = walletAddress;
    user.isEmailVerified = true;
    user.passwordSet = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.verificationToken = undefined;

    await user.save();

    return NextResponse.json(
      { 
        message: "Email verified and wallet created successfully",
        walletAddress: user.walletId
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying email:", error?.message || error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}