import mongoose, { Schema } from "mongoose";
import { ProposalStatus } from "@/types/enums";
const ProposalSchema = new Schema(
  {
    applicationId: String,
    jobTitle: String,
    company: String,
    appliedDate: String,
    offered: Number,
    jobType: String,
    status: {
      type: String,
      enum: Object.values(ProposalStatus),
      default: ProposalStatus.PROCESS,
    },
  },
  { timestamps: true }
);
export default mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);
