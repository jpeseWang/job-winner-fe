import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Company from "@/models/Company"
import User from "@/models/User"
import mongoose from "mongoose"
import { UserRole } from "@/types/enums"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()

    const id = (await context.params).id

    console.log(" ID công ty nhận được:", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 })
    }

    const company = await Company.findById(id)
    if (!company) {
      console.log(" Không tìm thấy công ty với ID này trong DB")
      return NextResponse.json({ message: "Không tìm thấy công ty" }, { status: 404 })
    }

    const user = await User.findById(company.owner)
    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 })
    }

    company.isVerified = true
    await company.save()

    user.role = UserRole.RECRUITER
    user.company = company._id
    await user.save()

    return NextResponse.json({ message: " Duyệt công ty thành công" }, { status: 200 })
  } catch (error) {
    console.error(" Lỗi duyệt công ty:", error)
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}
