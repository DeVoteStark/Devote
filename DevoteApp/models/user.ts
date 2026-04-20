import mongoose, { Document, Model, Schema } from "mongoose";

// [KYC RESTORE] Uncomment when restoring KYC functionality
// export enum KYCStatus {
//   PENDING = "pending",
//   IN_PROCESS = "inProcess",
//   REJECTED = "rejected",
//   ACCEPTED = "accepted",
// }

export interface IUser extends Document {
  walletId: string;
  name: string;
  email: string;
  hashIne: string;
  secretKey: string;
  isEmailVerified: boolean;
  passwordSet: boolean;
  verificationToken?: string;
  otp?: string;
  otpExpiry?: Date;
  
  // [KYC RESTORE] Uncomment when restoring KYC functionality
  // kycStatus: "pending" | "inProcess" | "rejected" | "accepted";
  // kycId: string;
}

const UserSchema = new Schema<IUser>(
  {
    walletId: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashIne: { type: String, required: true },
    secretKey: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    passwordSet: { type: Boolean, default: false },
    verificationToken: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    
    // [KYC RESTORE] Uncomment when restoring KYC functionality
    // kycStatus: {
    //   type: String,
    //   enum: ["pending", "inProcess", "rejected", "accepted"],
    //   default: "pending",
    // },
    // kycId: { type: String, default: "" },
  },
  { timestamps: true }
);


const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;