// api/users/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDb from "../../../../lib/mongodb/mongodb";
import User from "../../../../models/user";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();
    const { id } = params;
    const user = await User.findById(id).lean().exec();
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}