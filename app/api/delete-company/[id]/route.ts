import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Company from "@/models/Company"

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  await dbConnect()

  try {
    const companyId = context.params.id

    if (!companyId) {
      return NextResponse.json({ message: "Missing company ID" }, { status: 400 })
    }

    const deletedCompany = await Company.findByIdAndDelete(companyId)

    if (!deletedCompany) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Company deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error instanceof Error ? error.message : error },
      { status: 500 }
    )
  }
}
