import { ProposalStatus } from "./enums";
export interface Proposal {
  _id?: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  offered: number;
  jobType: string;
  status: ProposalStatus;
}
