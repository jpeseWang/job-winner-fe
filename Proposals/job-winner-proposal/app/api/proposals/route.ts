import { NextRequest, NextResponse } from "next/server";
import { getProposals, createProposal } from "@/services/proposalDbService";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const search = searchParams.get("search") || "";
  const result = await getProposals(page, pageSize, search);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const proposal = await createProposal(data);
  return NextResponse.json(proposal, { status: 201 });
}
