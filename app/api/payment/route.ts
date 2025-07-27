import { NextResponse } from "next/server"
import Payment from "@/models/Payment"
import dbConnect from "@/lib/db"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const {
      userId,
      amount,
      currency = "USD",
      type = "subscription",
      status = "completed",
      paymentMethod = "paypal",
      transactionId,
      metadata = {},
    } = body

    if (!userId || !amount || !transactionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const payment = await Payment.create({
      user: userId,
      amount,
      currency,
      type,
      status,
      paymentMethod,
      transactionId,
      metadata,
    })

    return NextResponse.json({ payment })
  } catch (err) {
    console.error("Failed to create payment:", err)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
} 