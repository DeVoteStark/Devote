import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProposal extends Document {
  title: string;
  description: string;
  file?: string;
}

const ProposalSchema = new Schema<IProposal>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Proposal: Model<IProposal> =
  mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);

export default Proposal;