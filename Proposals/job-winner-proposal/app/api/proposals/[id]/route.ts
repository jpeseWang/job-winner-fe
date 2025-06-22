import { NextRequest, NextResponse } from "next/server";
import { updateProposal, deleteProposal } from "@/services/proposalDbService";

export async function PATCH(req: NextRequest, { params }: any) {
  const id = params.id;
  const data = await req.json();
  const proposal = await updateProposal(id, data);
  return NextResponse.json(proposal);
}

export async function DELETE(req: NextRequest, { params }: any) {
  const id = params.id;
  await deleteProposal(id);
  return NextResponse.json({ success: true });
}
