// api/login/[email]/route.ts
import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import User from "../../../models/user";

export async function POST(request: Request) {
  try {
    await connectToDb();
    // Parsear el body de la solicitud
    const { email } = await request.json();

    // Validar que se recibael email
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).lean().exec();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
