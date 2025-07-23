import Company from "@/models/Company"
import dbConnect from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"

export async function GET() {
    await dbConnect()
    const companies = await Company.find()
        .populate("owner", "name")
        .lean()
    return NextResponse.json(companies)
}

export async function POST(req: NextRequest) {
    await dbConnect()
    const body = await req.json()

    try {
        const company = await Company.create({
            ...body,
            isVerified: true,
        })

        return NextResponse.json(company, { status: 201 })
    } catch (err: any) {
        return NextResponse.json(
            { message: "Create company failed", error: err.message },
            { status: 400 }
        )
    }
}