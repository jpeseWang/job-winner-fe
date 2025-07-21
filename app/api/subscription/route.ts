import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { getActiveSubscription, checkPostingPermission, extendActiveJobs, getPlanJobLimit, resetQuota } from "@/lib/subscription"
import Subscription from "@/models/Subscription"
import { SubscriptionPlan, SubscriptionRole, BillingPeriod  } from "@/types/enums"
import { addDays } from "date-fns"

// 📦 GET: Lấy subscription hiện tại + quyền post job
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const role = searchParams.get("role") as SubscriptionRole

  if (!userId || !role) {
    return NextResponse.json({ error: "Missing userId or role" }, { status: 400 })
  }

  await dbConnect()

  try {
    const subscription = await getActiveSubscription(userId, role)
    const permission = checkPostingPermission(subscription)

    console.log("📦 [GET /api/subscription] Subscription:", subscription)
    console.log("📦 [GET /api/subscription] Permission:", permission)

    // Gắn prefix role vào plan khi trả về API
    const prefixedPlan = `${role}-${subscription.plan}`

    return NextResponse.json({
      plan: prefixedPlan,
      jobPostingsUsed: subscription.usageStats.jobPostings ?? 0,
      jobPostingsLimit: getPlanJobLimit(subscription.plan),
      quotaLeft: permission.quotaLeft,
      canPostJob: permission.canPostJob,
      reason: permission.reason
      
    })
    
  } catch (err) {
    console.error("Failed to fetch subscription:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// 📦 POST: Update/Upgrade subscription
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, planId, role } = body
    console.log("📦 [POST /api/subscription] Body:", body)

    if (!userId || !planId || !role) {
      return NextResponse.json({ error: "Missing userId or planId or role" }, { status: 400 })
    }

    await dbConnect()

    // Validate planId
    if (!Object.values(SubscriptionPlan).includes(planId)) {
      return NextResponse.json({ error: `Invalid plan: ${planId}` }, { status: 400 })
    }

    const now = new Date()
    const endDate = addDays(now, 30)

    // Tìm subscription theo user + role
    let subscription = await Subscription.findOne({ user: userId, role })
    console.log("🔍 [POST /api/subscription] Found subscription:", subscription)
    if (!subscription) {
      // Nếu chưa có ➝ tạo mới
      subscription = await Subscription.create({
        user: userId,
        role,
        plan: SubscriptionPlan.FREE,
        status: "active",
        startDate: now,
        endDate,
        billingPeriod: BillingPeriod.MONTHLY,
        price: 0,
        currency: "USD",
        autoRenew: true,
        paymentMethod: "free",
        usageStats: { jobPostings: 0, cvDownloads: 0, featuredJobs: 0, premiumTemplates: 0 },
      })
    }

    const oldPlan = subscription.plan
    const isUpgrade = planId !== SubscriptionPlan.FREE && oldPlan === SubscriptionPlan.FREE
    const isDowngrade = planId === SubscriptionPlan.FREE && oldPlan !== SubscriptionPlan.FREE

    // 📝 Update subscription info
    subscription.plan = planId
    subscription.status = "active"
    subscription.startDate = now
    subscription.endDate = endDate
    subscription.billingPeriod = BillingPeriod.MONTHLY
    subscription.price =
      planId === SubscriptionPlan.BASIC
        ? 49
        : planId === SubscriptionPlan.PREMIUM
        ? 99
        : 0
    subscription.paymentMethod = planId === SubscriptionPlan.FREE ? "free" : "paypal"

    if (isDowngrade) {
      console.log(`⬇️ Downgrade: Resetting quota for user ${userId}`)
      resetQuota(subscription)
    }

    await subscription.save()
    console.log("✅ [POST /api/subscription] Saved subscription:", subscription)

    if (oldPlan !== planId && role === SubscriptionRole.RECRUITER) {
      await extendActiveJobs(userId, planId)
    }

    const prefixedPlan = `${role}-${planId}`

    return NextResponse.json({
      subscription: {
        ...subscription.toObject(),
        plan: prefixedPlan,
      },
      message: `Subscription updated to ${planId}`,
    })
  } catch (err) {
    console.error("Failed to update subscription:", err)
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  }
}
