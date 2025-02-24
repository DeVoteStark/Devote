import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import Citizen from "../../../models/citizen";

export async function POST(req: Request) {
  try {
    const { ine, firstName, lastName, codex } = await req.json();

    if (!ine || !firstName || !lastName || !codex) {
      return NextResponse.json(
        { message: "All the fields are mandatory: ine, firstName, lastName, codex" },
        { status: 400 }
      );
    }

    await connectToDb();

    const existingCitizen = await Citizen.findOne({ ine }).exec();
    if (existingCitizen) {
      return NextResponse.json(
        { message: "Citizen already exists" },
        { status: 400 }
      );
    }

    const newCitizen = new Citizen({ ine, firstName, lastName, codex });
    await newCitizen.save();

    return NextResponse.json(
      { message: "Citizen created correctly", citizen: newCitizen },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error on POST /api/citizens:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
