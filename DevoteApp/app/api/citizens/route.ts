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

export async function GET(req: Request) {
  try {
    await connectToDb();
    const url = new URL(req.url);
    const ine = url.searchParams.get("ine");

    if (!ine) {
      return NextResponse.json({ message: "El parámetro 'ine' es obligatorio." }, { status: 400 });
    }

    const citizen = await Citizen.findOne({ ine }).lean().exec();

    if (!citizen) {
      return NextResponse.json({ message: "Citizen not found" }, { status: 404 });
    }

    return NextResponse.json(citizen, { status: 200 });
  } catch (error) {
    console.error("Error on GET /api/citizens:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}