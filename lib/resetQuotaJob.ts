import dbConnect from "@/lib/db"
import Subscription from "@/models/Subscription"
import { resetQuota } from "@/lib/subscription"

async function resetAllUserQuotas() {
  await dbConnect()
  const now = new Date()
  console.log(`🔄 [Quota Reset] Running at ${now.toISOString()}`)

  const subscriptions = await Subscription.find({ status: "active" })
  for (const sub of subscriptions) {
    if (sub.endDate < now) {
      console.log(`🆕 Resetting quota for user ${sub.user} (plan: ${sub.plan})`)
      resetQuota(sub)
      await sub.save()
    }
  }
  console.log(`✅ [Quota Reset] Completed.`)
}

// 👇 Nếu đang chạy trên Netlify ➝ export Scheduled Function
export const handler = async () => {
  if (process.env.NETLIFY) {
    console.log("🕛 [Netlify Scheduled Function] Triggered")
    await resetAllUserQuotas()
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Quota reset completed." }),
    }
} else {
  // 👇 Nếu local ➝ dùng node-cron
  import("node-cron").then(({ default: cron }) => {
    console.log("🕒 [Local] Starting node-cron scheduler...")
    cron.schedule("0 0 * * *", async () => {
      try {
        await resetAllUserQuotas()
      } catch (err) {
        console.error("❌ [Local Cron] Error:", err)
      }
    })
   })
  }
}
