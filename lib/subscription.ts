import Subscription, { type ISubscription } from "@/models/Subscription"
import User from "@/models/User"
import { SubscriptionPlan, BillingPeriod, SubscriptionRole } from "@/types/enums"
import Job from "@/models/Job"
import { addDays } from "date-fns"

/**
 * Get user's active subscription or fallback to FREE
 */
export async function getActiveSubscription(userId: string, role?: SubscriptionRole): Promise<ISubscription> {
  if (!role) {
    const user = await User.findById(userId)
    if (!user) throw new Error(`User ${userId} not found`)
    role = user.role as SubscriptionRole 
  }

  try {
    const subscription = await Subscription.findOne({ user: userId, role })

    if (!subscription || subscription.status !== "active") {
      console.log(`No active subscription for user ${userId} (${role}), fallback to FREE.`)
      return await getFreeSubscriptionFallback(userId, role)
    }

    const now = new Date()
    // Downgrade to FREE if subscription expired
    if (subscription.endDate < now) {
      console.log(`⚠️ Subscription expired for user ${userId}. Downgrading to FREE.`)
      resetSubscriptionToFree(subscription)
      await subscription.save()
    }

    return subscription
  } catch (err) {
    console.error(`❌ Failed to get active subscription for user ${userId} (${role}):`, err)
    return await getFreeSubscriptionFallback(userId, role)
  }
}

/**
 * Check if user can post a job and return detailed result
 */
export function checkPostingPermission(subscription: ISubscription): {
  canPostJob: boolean
  reason: string
  quotaLeft: number | "Unlimited"
} {
  console.log("📦 [checkPostingPermission] Subscription:", subscription)

  const plan = subscription.plan
  const planLimit = getPlanJobLimit(plan)
  const used = subscription.usageStats.jobPostings ?? 0

  const quotaLeft = planLimit === Infinity ? "Unlimited" : planLimit - used
  console.log(`📦 Plan: ${plan}, Limit: ${planLimit}, Used: ${used}, Left: ${quotaLeft}`)

  if (quotaLeft === "Unlimited" || quotaLeft > 0) {
    console.log("✅ [checkPostingPermission] Can post job: true")
    return { canPostJob: true, reason: "OK", quotaLeft }
  }
  
  console.log("❌ [checkPostingPermission] Can post job: false")
  return {
    canPostJob: false,
    reason: "You have used up your job posting limit for this month. Please upgrade your plan.",
    quotaLeft: 0
  }
}

/**
 * Increment job posting count
 */
export async function incrementJobPosting(userId: string, role: SubscriptionRole): Promise<void> {
  try {
    const subscription = await Subscription.findOne({ user: userId, role })
    if (!subscription) throw new Error(`Subscription for ${role} not linked to user.`)

    await Subscription.findByIdAndUpdate(
      subscription._id,
      { $inc: { "usageStats.jobPostings": 1 } }
    )
  } catch (err) {
    console.error(`Failed to increment job posting for user ${userId} (${role}):`, err)
  }
}

/**
 * Extend active jobs for recruiter role only
 */
export async function extendActiveJobs(userId: string, plan: SubscriptionPlan): Promise<void> {
  const extensionDays = getJobDurationForPlan(plan)

  if (plan === SubscriptionPlan.FREE) return

  try {
    const jobs = await Job.find({
      recruiter: userId,
      status: { $in: ["ACTIVE", "PAUSED"] },
    })

    for (const job of jobs) {
      job.expiresAt = addDays(job.expiresAt, extensionDays)
      await job.save()
    }

    console.log(`Extended ${jobs.length} jobs by ${extensionDays} days for user ${userId}`)
  } catch (err) {
    console.error(`Failed to extend jobs for user ${userId}:`, err)
  }
}


/**
 * Reset subscription to FREE
 */
export function resetSubscriptionToFree(subscription: ISubscription): void {
  subscription.plan = SubscriptionPlan.FREE
  subscription.price = 0
  subscription.billingPeriod = BillingPeriod.MONTHLY
  subscription.autoRenew = true
  subscription.paymentMethod = "free"
  resetQuota(subscription)
  subscription.startDate = new Date()
  subscription.endDate = addDays(new Date(), 30)
}

/**
 * Reset quota monthly
 */
export function resetQuota(subscription: ISubscription): void {
  subscription.usageStats = {
    jobPostings: 0,
    cvDownloads: 0,
    featuredJobs: 0,
    premiumTemplates: 0
  }
  console.log(`🔄 Quota reset for subscription ${subscription._id}`)
}

/**
 * Get max job postings allowed per plan
 */
export function getPlanJobLimit(plan: SubscriptionPlan): number {
  switch (plan) {
    case SubscriptionPlan.FREE: 
      return 5
    case SubscriptionPlan.BASIC: 
      return 20
    case SubscriptionPlan.PREMIUM: 
      return Infinity
    default: 
      return 5
  }
}

//Ngày hết hạn job theo gói
export function getJobDurationForPlan(plan: SubscriptionPlan): number {
  switch (plan) {
    case SubscriptionPlan.FREE:
      return 30
    case SubscriptionPlan.BASIC:
      return 60
    case SubscriptionPlan.PREMIUM:
      return 90
    default:
      return 30 
  }
}

/**
 * Create fallback FREE subscription if user has none
 */
async function getFreeSubscriptionFallback(userId: string, role: SubscriptionRole): Promise<ISubscription> {
  const freeSub = await Subscription.create({
    user: userId,
    role,
    plan: SubscriptionPlan.FREE,
    usageStats: { jobPostings: 0, cvDownloads: 0, featuredJobs: 0, premiumTemplates: 0 },
    startDate: new Date(),
    endDate: addDays(new Date(), 30),
    billingPeriod: BillingPeriod.MONTHLY,
    price: 0,
    currency: "USD",
    autoRenew: true,
    paymentMethod: "free",
    status: "active",
  })
  console.log(`Created fallback FREE subscription for user ${userId} (${role})`)
  resetQuota(freeSub)
  await freeSub.save()

  console.log(`Created fallback FREE subscription for user ${userId} (${role})`)
  return freeSub
}