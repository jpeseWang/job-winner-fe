import dbConnect from "@/lib/mongodb";
import Proposal from "@/models/Proposal";
import { Proposal as ProposalType } from "@/types/proposal";

export const getProposals = async (page = 1, pageSize = 10, search = "") => {
  await dbConnect();
  const query: any = {};
  if (search) {
    query.$or = [
      { jobTitle: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { applicationId: { $regex: search, $options: "i" } },
    ];
  }
  const total = await Proposal.countDocuments(query);
  const proposals = await Proposal.find(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 });
  return { proposals, total };
};

export const createProposal = async (data: ProposalType) => {
  await dbConnect();
  const proposal = new Proposal(data);
  await proposal.save();
  return proposal;
};

export const updateProposal = async (id: string, data: Partial<ProposalType>) => {
  await dbConnect();
  const proposal = await Proposal.findByIdAndUpdate(id, data, { new: true });
  return proposal;
};

export const deleteProposal = async (id: string) => {
  await dbConnect();
  await Proposal.findByIdAndDelete(id);
  return true;
};
