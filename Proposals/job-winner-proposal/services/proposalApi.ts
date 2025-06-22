import axiosInstance from "./axiosInstance";
import { Proposal } from "@/types/proposal";

export const fetchProposals = async (page = 1, pageSize = 10, search = "") => {
  const res = await axiosInstance.get("/proposals", { params: { page, pageSize, search } });
  return res.data;
};
export const addProposal = async (data: Proposal) => {
  const res = await axiosInstance.post("/proposals", data);
  return res.data;
};
export const editProposal = async (id: string, data: Partial<Proposal>) => {
  const res = await axiosInstance.patch(`/proposals/${id}`, data);
  return res.data;
};
export const removeProposal = async (id: string) => {
  await axiosInstance.delete(`/proposals/${id}`);
};
