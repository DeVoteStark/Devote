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
  
  // Email verification fields
  isEmailVerified: boolean;
  emailVerificationCode: string;
  emailVerificationExpires: Date;
  emailVerificationAttempts: number;
  lastVerificationEmailSent: Date;
  
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
    secretKey: { type: String, required: true },
    
    // Email verification fields
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, default: "" },
    emailVerificationExpires: { type: Date },
    emailVerificationAttempts: { type: Number, default: 0 },
    lastVerificationEmailSent: { type: Date },
    
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

// Index for faster verification code lookups
UserSchema.index({ emailVerificationCode: 1 });
UserSchema.index({ email: 1, emailVerificationCode: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;