import Subscription, { type ISubscription } from "@/models/Subscription"
import User from "@/models/User"
import { SubscriptionPlan, BillingPeriod } from "@/types/enums"
import Job from "@/models/Job"
import { addDays } from "date-fns"

/**
 * Get user's active subscription or fallback to FREE
 */
export async function getActiveSubscription(userId: string): Promise<ISubscription> {
  try {
    const user = await User.findById(userId).populate("subscription")
    const subscription = user?.subscription as ISubscription | null

    if (!subscription || subscription.status !== "active") {
      console.log(`ℹ️ No active subscription for user ${userId}, fallback to FREE.`)
      return await getFreeSubscriptionFallback(userId)
    }

    const now = new Date()

    // 📝 Downgrade to FREE if subscription expired
    if (subscription.endDate < now) {
      console.log(`⚠️ Subscription expired for user ${userId}. Downgrading to FREE.`)
      resetSubscriptionToFree(subscription)
      await subscription.save()
    }

    return subscription
  } catch (err) {
    console.error(`❌ Failed to get active subscription for user ${userId}:`, err)
    return await getFreeSubscriptionFallback(userId)
  }
}

/**
 * Check quota for posting job
 */
export function hasQuota(subscription: Pick<ISubscription, "plan" | "usageStats">): boolean {
  const planLimit = getPlanJobLimit(subscription.plan)
  return planLimit === Infinity || subscription.usageStats.jobPostings < planLimit
}

/**
 * Increment job posting count
 */
export async function incrementJobPosting(userId: string): Promise<void> {
  try {
    const user = await User.findById(userId).populate("subscription")
    if (!user?.subscription) {
      throw new Error("Subscription not linked to user.")
    }

    await Subscription.findByIdAndUpdate(
      user.subscription._id,
      { $inc: { "usageStats.jobPostings": 1 } }
    )
  } catch (err) {
    console.error(`Failed to increment job posting for user ${userId}:`, err)
  }
}

/**
 * Extend all ACTIVE or PAUSED jobs when upgrading subscription
 */
export async function featureJobsForUpgrade(userId: string, plan: SubscriptionPlan): Promise<void> {
  try {
    if (plan === SubscriptionPlan.FREE) return // Free không feature

    const jobs = await Job.find({
      recruiter: userId,
      isFeatured: false, // chỉ update job chưa featured
      status: { $in: ["ACTIVE", "PAUSED"] },
    })

    for (const job of jobs) {
      job.isFeatured = true
      await job.save()
    }

    console.log(`✅ Upgraded ${jobs.length} jobs to featured for user ${userId}`)
  } catch (err) {
    console.error(`❌ Failed to upgrade jobs to featured for user ${userId}:`, err)
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
  subscription.usageStats.jobPostings = 0
  subscription.startDate = new Date()
  subscription.endDate = addDays(new Date(), 30)
}

/**
 * Reset quota monthly
 */
export function resetQuota(subscription: ISubscription): void {
  subscription.usageStats.jobPostings = 0
  subscription.usageStats.cvDownloads = 0
  subscription.usageStats.featuredJobs = 0
  subscription.usageStats.premiumTemplates = 0
  console.log(`🔄 Quota reset for subscription ${subscription._id}`)
}

/**
 * Get max job postings allowed per plan
 */
export function getPlanJobLimit(plan: string): number {
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
export function getJobDurationForPlan(plan: string): number {
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
async function getFreeSubscriptionFallback(userId: string): Promise<ISubscription> {
  const freeSub = await Subscription.create({
    user: userId,
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

  await User.findByIdAndUpdate(userId, { subscription: freeSub._id })

  console.log(`✅ Created fallback FREE subscription for user ${userId}`)
  return freeSub
}
