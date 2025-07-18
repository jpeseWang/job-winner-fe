"use client"

import { Crown, Star, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SubscriptionCardProps {
  plan: string
  className?: string
}

// Map plan từ backend về key chuẩn
const normalizePlan = (plan: string): "free" | "basic" | "premium" => {
  if (plan.startsWith("recruiter-")) return plan.replace("recruiter-", "") as "free" | "basic" | "premium"
  return plan as "free" | "basic" | "premium"
}

const planConfig = {
  free: {
    name: "Free Plan",
    description: "Get started with basic job posting features",
    icon: Lock,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
    textColor: "text-blue-700",
    badgeColor: "bg-blue-100 text-blue-700",
    accentColor: "text-blue-600",
  },
  basic: {
    name: "Basic Plan",
    description: "Enhanced features for growing needs",
    icon: Star,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconColor: "text-orange-500",
    textColor: "text-orange-700",
    badgeColor: "bg-orange-100 text-orange-700",
    accentColor: "text-orange-600",
  },
  premium: {
    name: "Premium Plan",
    description: "Enjoy unlimited access to features!",
    icon: Crown,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconColor: "text-purple-500",
    textColor: "text-purple-700",
    badgeColor: "bg-purple-100 text-purple-700",
    accentColor: "text-purple-600",
  },
}

export default function SubscriptionCard({ plan, className = "" }: SubscriptionCardProps) {
  const normalizedPlan = normalizePlan(plan)
  const config = planConfig[normalizedPlan]

  if (!config) {
    console.error(`❌ Invalid plan: "${plan}" passed to SubscriptionCard`)
    return (
      <Card className={`relative overflow-hidden border-2 border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-red-600">Unknown Plan</h3>
          <p className="text-sm text-red-500 leading-relaxed">This plan is not supported by SubscriptionCard.</p>
        </CardContent>
      </Card>
    )
  }

  const IconComponent = config.icon

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${config.bgColor} ${config.borderColor} border-2 ${className}`}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Current Plan Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className={`text-xs font-medium ${config.badgeColor} border-0`}>
            Current Plan
          </Badge>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg bg-white shadow-sm border ${config.borderColor}`}>
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${config.textColor}`}>{config.name}</h3>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm ${config.accentColor} leading-relaxed`}>{config.description}</p>

        {/* Plan Features Indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div className={`h-1 w-full rounded-full bg-white border ${config.borderColor}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                normalizedPlan === "free"
                  ? "w-1/3 bg-blue-400"
                  : normalizedPlan === "basic"
                  ? "w-2/3 bg-orange-400"
                  : "w-full bg-purple-400"
              }`}
            />
          </div>
          <span className={`text-xs font-medium ${config.accentColor} whitespace-nowrap`}>
            {normalizedPlan === "free" ? "33%" : normalizedPlan === "basic" ? "67%" : "100%"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
