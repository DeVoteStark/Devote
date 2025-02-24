// api/login/[email]/route.ts
import { NextResponse } from "next/server";
import connectToDb from "../../../../lib/mongodb/mongodb";
import User from "../../../../models/user";

export async function GET(request: Request, { params }: { params: { email: string }}) {
  try {
    await connectToDb();

    const email = params.email;
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).lean().exec();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
