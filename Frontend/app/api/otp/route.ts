import { EmailService } from "@/lib/email";
import connectToDb from "@/lib/mongodb/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and otp are required" },
        { status: 400 }
      );
    }

    await connectToDb();

    const user = await User.findOne({ email }).lean().exec();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return NextResponse.json(
        { message: "Invalid OTP request." },
        { status: 400 }
      );
    }

    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json({ message: "OTP expired." }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const emailEncoded = encodeURI(user.email);
    const sdkLink = `https://devote.site/verify?kycId=${user._id}&email=${emailEncoded}`;

    const emailService = new EmailService();
    const subject = "Complete your KYC process";
    const text = `Please use the following link to complete your KYC process: ${sdkLink}`;
    const html = `<p>Please use the following link to complete your KYC process:</p>
                  <p><a href="${sdkLink}">${sdkLink}</a></p>`;

    await emailService.sendMail(user.email, subject, text, html);

    return NextResponse.json(
      {
        message: "OTP verified and KYC initiated successfully",
        isVerified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating OTP:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
