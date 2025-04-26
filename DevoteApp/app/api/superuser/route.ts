import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import User from "../../../models/user";
import crypto from "crypto";

function hashIne(ine: string): string {
  return crypto.createHash("sha256").update(ine).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email, fullName, ine, password, privateKey, publicKey } = await req.json();

    if (!email || !fullName || !ine || !password || !privateKey || !publicKey) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToDb();

    const hashedIne = hashIne(ine);

    const existingUser = await User.findOne({ hasIne: hashedIne }).exec();
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
      hashIne: hashedIne,
      secretKey: privateKey,
      isAdmin: true,
      kycStatus: "approved",
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