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
  Palette,
  FileText,
  MessageSquare,
  Users,
  Target,
  Eye,
  Globe,
  Lock,
  Star,
} from "lucide-react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

const recruiterPlans = [
  {
    id: "recruiter-basic",
    name: "Basic",
    price: { monthly: 49, yearly: 490 },
    description: "Ideal for growing companies with regular hiring needs",
    badge: "Most Popular",
    features: [
      { name: "20 job postings per month", included: true, icon: Briefcase },
      { name: "Advanced job analytics", included: true, icon: BarChart3 },
      { name: "Priority support", included: true, icon: Shield },
      { name: "Advanced candidate search", included: true, icon: Search },
      { name: "Job posting for 60 days", included: true, icon: Clock },
      { name: "Basic company branding", included: true, icon: Palette },
      { name: "Application tracking", included: true, icon: FileText },
      { name: "Email notifications", included: true, icon: MessageSquare },
    ],
    cta: "Start Basic Plan",
    popular: true,
  },
  {
    id: "recruiter-premium",
    name: "Premium",
    price: { monthly: 99, yearly: 990 },
    description: "For enterprises with high-volume hiring requirements",
    badge: "Best Value",
    features: [
      { name: "Unlimited job postings", included: true, icon: Briefcase },
      { name: "Premium analytics & insights", included: true, icon: BarChart3 },
      { name: "Dedicated account manager", included: true, icon: Users },
      { name: "AI-powered candidate matching", included: true, icon: Target },
      { name: "Job posting for 90 days", included: true, icon: Clock },
      { name: "Full company branding", included: true, icon: Palette },
      { name: "Bulk job posting tools", included: true, icon: FileText },
      { name: "Priority candidate visibility", included: true, icon: Eye },
      { name: "Custom integrations", included: true, icon: Globe },
      { name: "White-label solutions", included: true, icon: Crown },
    ],
    cta: "Go Premium",
    popular: false,
  },
]

export default function UnlockPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isYearly, setIsYearly] = useState(false)
  const [showPaypal, setShowPaypal] = useState(false)

  const formatPrice = (price: { monthly: number; yearly: number }) => {
    const amount = isYearly ? price.yearly : price.monthly
    if (isYearly) {
      const monthlyEquivalent = Math.round(amount / 12)
      return `$${amount}/year ($${monthlyEquivalent}/mo)`
    }
    return `$${amount}/month`
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    setShowPaypal(false)
  }

  const selectedPlanData = recruiterPlans.find((plan) => plan.id === selectedPlan)
  const priceToPay = selectedPlanData ? (isYearly ? selectedPlanData.price.yearly : selectedPlanData.price.monthly) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <Lock className="h-12 w-12 text-orange-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Unlock Job Posting</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose a plan to unlock unlimited job posting capabilities and reach top talent for your company.
          </p>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
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

        {/* Plans Grid - Now 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {recruiterPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id
                  ? "ring-2 ring-blue-500 shadow-xl scale-105"
                  : plan.popular
                  ? "ring-1 ring-blue-200 shadow-lg"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">{plan.badge}</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">{plan.description}</CardDescription>
                <div className="text-4xl font-bold text-gray-900 mb-2">{formatPrice(plan.price)}</div>
                {isYearly && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Save 20%
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Plan Summary */}
        {selectedPlanData && (
          <Card className="bg-blue-50 border-blue-200 mb-8 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                Selected Plan: {selectedPlanData.name}
              </CardTitle>
              <CardDescription>
                {formatPrice(selectedPlanData.price)} - {selectedPlanData.description}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard/recruiter")} className="min-w-[120px]">
            Back to Dashboard
          </Button>
          {selectedPlanData && priceToPay > 0 && (
            <div className="min-w-[220px]">
              <PayPalScriptProvider
                options={{
                  clientId: "ARYI_H9cVv4NbfslyZ24d3keT4RO0QLs6on2sPS4oNOZoDIE1Gy1i405HflcAP9pwTLNLoM-QDaV01gN",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: { value: String(priceToPay), currency_code: "USD" },
                        },
                      ],
                    })
                  }}
                  onApprove={async (data, actions) => {
                    await actions.order?.capture()
                    // Call API to update subscription
                    if (session?.user?.id && selectedPlan) {
                      console.log("💸 [Frontend] Calling /api/subscription with:", {
                        userId: session.user.id,
                        planId: selectedPlan.replace("recruiter-", ""),
                        role: "recruiter"
                      })

                      const res = await fetch("/api/subscription", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userId: session.user.id,
                          planId: selectedPlan.replace("recruiter-", ""),
                          role: "recruiter"
                        }),
                      })

                      console.log("📥 [Frontend] API Response status:", res.status)
                      const data = await res.json()
                      console.log("📥 [Frontend] API Response body:", data)
                    }
                    toast({ title: "Success", description: "Payment successful!" })
                    router.push("/dashboard/recruiter/jobs/new")
                  }}
                  onError={() => {
                    toast({ title: "Error", description: "Payment failed. Please try again.", variant: "destructive" })
                  }}
                />
              </PayPalScriptProvider>
            </div>
          )}
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
