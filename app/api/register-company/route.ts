import { NextResponse } from "next/server"
import Company from "@/models/Company"
import dbConnect from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  try {
    const company = await Company.create({
      ...data,
      owner: session.user.id,
      isVerified: false,
      employees: [session.user.id],
    })

    return NextResponse.json({ message: "Company registered", company })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}