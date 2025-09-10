import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import Proposal from "../../../models/proposal";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    await connectToDb();

    const newProposal = new Proposal({ title, description });
    await newProposal.save();

    // Handle file upload if a file is provided
    let filePath = null;
    if (file) {
      // Check MIME type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { message: "Invalid file type" },
          { status: 400 }
        );
      }

      // Check extension
      const validExtensions = [".pdf", ".doc", ".docx"];
      const fileExtension = path.extname(file.name).toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        return NextResponse.json(
          { message: "Invalid file extension" },
          { status: 400 }
        );
      }

      // Upload file
      const uploadDir = path.join(process.cwd(), "public/uploads/proposals");
      const proposalDir = path.join(uploadDir, newProposal.id.toString());

      if (!fs.existsSync(proposalDir)) {
        fs.mkdirSync(proposalDir, { recursive: true });
      }

      filePath = path.join(proposalDir, file.name);
      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

      // Update proposal with file path (in production, we should use a proper storage service like cloudinary or AWS S3)

      newProposal.file = `/uploads/proposals/${newProposal.id}/${file.name}`;
      await newProposal.save();
    }

    return NextResponse.json(
      { message: "Proposal created successfully", proposal: newProposal },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { _id, title, description, file } = await req.json();
    if (!_id) {
      return NextResponse.json(
        { message: "Proposal ID is required" },
        { status: 400 }
      );
    }

    await connectToDb();

    const updateFields: {
      title?: string;
      description?: string;
      file?: string;
    } = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (file) updateFields.file = file;

    const updatedProposal = await Proposal.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedProposal) {
      return NextResponse.json(
        { message: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Proposal updated successfully", proposal: updatedProposal },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectToDb();

    const url = new URL(req.url);
    const _id = url.searchParams.get("id");

    if (_id) {
      const proposal = await Proposal.findById(_id).lean().exec();
      if (!proposal) {
        return NextResponse.json(
          { message: "Proposal not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(proposal, { status: 200 });
    }

    const proposals = await Proposal.find({}).lean().exec();
    return NextResponse.json(proposals, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { proposalId } = await req.json();
    if (!proposalId) {
      return NextResponse.json(
        { message: "Proposal ID is required" },
        { status: 400 }
      );
    }

    await connectToDb();

    const deletedProposal = await Proposal.findByIdAndDelete(proposalId).exec();

    if (!deletedProposal) {
      return NextResponse.json(
        { message: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Proposal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
