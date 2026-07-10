import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICitizen extends Document {
  ine: string;
  firstName: string;
  lastName: string;
  codex: string;
}

const CitizenSchema = new Schema<ICitizen>(
  {
    ine: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    codex: { type: String, required: true },
  },
  { timestamps: true }
);

const Citizen: Model<ICitizen> =
  mongoose.models.Citizen || mongoose.model("Citizen", CitizenSchema);

export default Citizen;
