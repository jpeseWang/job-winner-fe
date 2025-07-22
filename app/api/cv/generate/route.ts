import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"
import { UserRole, SubscriptionRole } from "@/types/enums"
import { getActiveSubscription, checkCVPermission, incrementCVCreating } from "@/lib/subscription"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== UserRole.JOB_SEEKER) {
      console.warn("❌ Unauthorized: user not job seeker or session missing")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await getActiveSubscription(session.user.id, SubscriptionRole.JOB_SEEKER)
    console.log("📦 [POST /api/cv] Subscription:", subscription)
    const permission = checkCVPermission(subscription)
    console.log("📦 [POST /api/cv] Permission Result:", permission)

    if (!permission.canCreateCV) {
      return NextResponse.json({
        error: permission.reason
      }, { status: 403 })
    }

    const body = await request.json()
    console.log("📥 [POST /api/cv] Request body:", body)

    const enrichedData = {
      ...body,
      user: session.user.id
    }

    console.log("📝 [POST /api/cv] Final CV data:", enrichedData)

    const newCV = await CV.create(enrichedData)
    console.log("✅ CV created successfully:", newCV._id)

    // 📈 Tăng usageStats.cvCreated
    await incrementCVCreating(session.user.id, SubscriptionRole.JOB_SEEKER)

    return NextResponse.json(newCV, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating CV:", error)
    return NextResponse.json({ error: "Failed to create CV" }, { status: 500 })
  }
}
