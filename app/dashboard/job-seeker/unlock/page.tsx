"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Check,
  Crown,
  Briefcase,
  BarChart3,
  Shield,
  Search,
  Clock,
  Rocket,
  FileText,
  MessageSquare,
  Users,
  Target,
  Award,
  TrendingUp,
  Lock,
  Star,
} from "lucide-react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

const premiumPlan = {
  id: "premium",
  name: "Premium",
  price: { monthly: 19, yearly: 190 },
  description: "Apply for unlimited jobs and create unlimited CVs.",
  badge: "Best Value",
  features: [
      { name: "Access to all premium CV templates", included: true, icon: Crown },
      { name: "Featured proposals (5x visibility)", included: true, icon: Star },
      { name: "Priority in search results", included: true, icon: TrendingUp },
      { name: "Advanced profile analytics", included: true, icon: BarChart3 },
      { name: "Unlimited CV downloads", included: true, icon: FileText },
      { name: "Premium support", included: true, icon: Shield },
      { name: "AI-powered job matching", included: true, icon: Target },
      { name: "Salary insights & negotiation tips", included: true, icon: Award },
      { name: "Career coaching resources", included: true, icon: Rocket },
      { name: "Interview preparation tools", included: true, icon: MessageSquare },
    ],
  cta: "Upgrade to Premium",
  popular: true,
}


export default function UnlockPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isYearly, setIsYearly] = useState(false)

  const formatPrice = (price: { monthly: number; yearly: number }) => {
    const amount = isYearly ? price.yearly : price.monthly
    return isYearly
      ? `$${amount}/year ($${Math.round(amount / 12)}/mo)`
      : `$${amount}/month`
  }

  const priceToPay = isYearly ? premiumPlan.price.yearly : premiumPlan.price.monthly

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <Lock className="h-12 w-12 text-orange-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Unlock Premium Access
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upgrade to Premium to apply for unlimited jobs and create unlimited CVs.
          </p>
        </div>
      </div>

      {/* Premium Plan */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm font-medium ${!isYearly ? "text-blue-600" : "text-gray-500"}`}>Monthly</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsYearly(!isYearly)}
            className={isYearly ? "bg-blue-600 text-white" : ""}
          >
            {isYearly ? "Yearly (Save 20%)" : "Monthly"}
          </Button>
        </div>

        {/* Premium Card */}
        <Card
          className="relative cursor-pointer ring-2 ring-blue-500 shadow-xl scale-105 transition-all duration-200 max-w-lg mx-auto"
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-600 text-white px-4 py-1">{premiumPlan.badge}</Badge>
          </div>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">{premiumPlan.name}</CardTitle>
            <CardDescription className="text-gray-600 mb-4">{premiumPlan.description}</CardDescription>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatPrice(premiumPlan.price)}
            </div>
            {isYearly && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Save 20%
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {premiumPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">{feature.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Section */}
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard/job-seeker")} className="min-w-[120px]">
            Back to Dashboard
          </Button>
            <PayPalScriptProvider
                options={{
                clientId: "ARYI_H9cVv4NbfslyZ24d3keT4RO0QLs6on2sPS4oNOZoDIE1Gy1i405HflcAP9pwTLNLoM-QDaV01gN", // Replace with your PayPal Client ID
                }}
            >
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [{
                    amount: { value: String(priceToPay), currency_code: "USD" },
                  }],
                })
              }}
              onApprove={async (data, actions) => {
                await actions.order?.capture()
                if (session?.user?.id) {
                  const res = await fetch("/api/subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: session.user.id,
                      planId: premiumPlan.id,
                      role: "job_seeker",
                    }),
                  })
                  // Gọi API lưu payment
                  await fetch("/api/payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: session.user.id,
                      amount: priceToPay,
                      currency: "USD",
                      type: "subscription",
                      status: "completed",
                      paymentMethod: "paypal",
                      transactionId: data.orderID || "paypal",
                    }),
                  })
                  const result = await res.json()
                  console.log("📥 API Response:", result)

                  toast({ title: "Success", description: "Subscription upgraded successfully!" })
                  router.push("/dashboard/job-seeker")
                }
              }}
              onError={() => {
                toast({ title: "Error", description: "Payment failed. Please try again.", variant: "destructive" })
              }}
            />
          </PayPalScriptProvider>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center text-gray-600">
            <p className="mb-4">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>30-day money back</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>24/7 support</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}