"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Check, Crown, Briefcase, BarChart3, Shield, Search, Clock, Palette, FileText, MessageSquare, Users, Target, Eye, Globe } from "lucide-react"

const recruiterPlans = [
  {
    id: "recruiter-free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for small businesses getting started",
    badge: null,
    features: [
      { name: "5 job postings per month", included: true, icon: Briefcase },
      { name: "Basic job analytics", included: true, icon: BarChart3 },
      { name: "Standard support", included: true, icon: Shield },
      { name: "Basic candidate search", included: true, icon: Search },
      { name: "Job posting for 30 days", included: true, icon: Clock },
    ],
    cta: "Get Started Free",
    popular: false,
  },
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

interface PaymentGatewayProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (planId: string) => void
}

export default function PaymentGateway({ isOpen, onClose, onSuccess }: PaymentGatewayProps) {
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  const formatPrice = (price: { monthly: number; yearly: number }) => {
    const amount = isYearly ? price.yearly : price.monthly
    if (amount === 0) return "Free"

    if (isYearly) {
      const monthlyEquivalent = Math.round(amount / 12)
      return `$${amount}/year ($${monthlyEquivalent}/mo)`
    }
    return `$${amount}/month`
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a plan first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would integrate with PayPal or other payment gateway
      // For now, we'll simulate a successful payment
      
      toast({
        title: "Success",
        description: "Payment successful! You can now create jobs.",
      })
      
      onSuccess(selectedPlan)
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedPlanData = recruiterPlans.find(plan => plan.id === selectedPlan)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select a plan to unlock job posting features. You can upgrade or downgrade anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? "text-blue-600" : "text-gray-500"}`}>
              Monthly
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsYearly(!isYearly)}
              className={isYearly ? "bg-blue-600 text-white" : ""}
            >
              {isYearly ? "Yearly (Save 20%)" : "Monthly"}
            </Button>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recruiterPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-blue-500 shadow-lg scale-105"
                    : plan.popular
                    ? "ring-1 ring-blue-200 shadow-md"
                    : "hover:shadow-md"
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1 text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    {formatPrice(plan.price)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">{feature.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Plan Summary */}
          {selectedPlanData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Selected Plan: {selectedPlanData.name}</CardTitle>
                <CardDescription>
                  {formatPrice(selectedPlanData.price)} - {selectedPlanData.description}
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!selectedPlan || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              `Pay ${selectedPlanData ? formatPrice(selectedPlanData.price) : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 