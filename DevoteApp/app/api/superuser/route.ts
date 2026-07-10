import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import User, { KYCStatus } from "../../../models/user";

export interface superUserRequestType {
  email: string;
  fullName: string;
  hashIne: string;
  privateKey: string;
  publicKey: string;
}

export async function POST(req: Request) {
  try {
    const { email, fullName, hashIne, privateKey, publicKey } = await req.json();

    if (!email || !fullName || !hashIne || !privateKey || !publicKey) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToDb();


    const existingUser = await User.findOne({ hasIne: hashIne }).exec();
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with provided INE" },
        { status: 400 }
      );
    }

    const newUser = new User({
      walletId: publicKey,
      name: fullName,
      email,
      hashIne: hashIne,
      secretKey: privateKey,
      isAdmin: true,
      kycStatus: KYCStatus.ACCEPTED,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "Superuser created successfully",
        user: {
          email: newUser.email,
          name: newUser.name,
          walletId: newUser.walletId,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating superuser:", error?.message || error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 