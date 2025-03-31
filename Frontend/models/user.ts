import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  walletId: string;
  name: string;
  email: string;
  hashIne: string;
  otp?: string;
  isVerified: boolean;
  otpExpiresAt?: Date;
  kycStatus: "pending" | "inProcess" | "rejected" | "accepted";
  kycId: string;
  secretKey: string;
}

const UserSchema = new Schema<IUser>(
  {
    walletId: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashIne: { type: String, required: true },
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpExpiresAt: { type: Date },
    kycStatus: {
      type: String,
      enum: ["pending", "inProcess", "rejected", "accepted"],
      default: "pending",
    },
    kycId: { type: String, default: "" },
    secretKey: { type: String, required: true },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
