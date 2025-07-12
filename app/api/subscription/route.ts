import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subscription from "@/models/Subscription";

// Lấy trạng thái subscription
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  await dbConnect();
  const sub = await Subscription.findOne({ userId });
  if (!sub) return NextResponse.json({ subscription: null });
  return NextResponse.json({ subscription: sub });
}

// Update/upgrade subscription
export async function POST(request: Request) {
  const body = await request.json();
  const { userId, planId } = body;
  if (!userId || !planId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  await dbConnect();
  // Update hoặc tạo mới subscription
  const sub = await Subscription.findOneAndUpdate(
    { userId },
    {
      planId,
      canPostJob: true,
      jobPostingsUsed: 0,
      jobPostingsLimit: planId === "recruiter-free" ? 5 : planId === "recruiter-basic" ? 20 : -1,
    },
    { upsert: true, new: true }
  );
  return NextResponse.json({ subscription: sub });
} 