"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/useToast"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import PricingFAQ from "@/components/pricing/pricing-faq"
import PricingComparison from "@/components/pricing/pricing-comparison"
import PricingTestimonials from "@/components/pricing/pricing-testimonials"
import {
  Check,
  X,
  Star,
  Crown,
  Briefcase,
  Users,
  BarChart3,
  Headphones,
  Search,
  Palette,
  TrendingUp,
  Shield,
  Clock,
  FileText,
  Eye,
  MessageSquare,
  Award,
  Rocket,
  Target,
  Globe,
} from "lucide-react"

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
      { name: "Standard support", included: true, icon: Headphones },
      { name: "Basic candidate search", included: true, icon: Search },
      { name: "Job posting for 30 days", included: true, icon: Clock },
      { name: "Advanced analytics", included: false, icon: TrendingUp },
      { name: "Priority support", included: false, icon: Shield },
      { name: "Company branding", included: false, icon: Palette },
      { name: "Candidate matching", included: false, icon: Target },
      { name: "Bulk job posting", included: false, icon: FileText },
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
      { name: "Candidate matching", included: false, icon: Target },
      { name: "Dedicated account manager", included: false, icon: Users },
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
      { name: "Premium analytics & insights", included: true, icon: TrendingUp },
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

const jobSeekerPlans = [
  {
    id: "jobseeker-free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Essential tools for your job search journey",
    badge: null,
    features: [
      { name: "Access to free CV templates", included: true, icon: FileText },
      { name: "Basic profile creation", included: true, icon: Users },
      { name: "Job alerts & notifications", included: true, icon: MessageSquare },
      { name: "Apply to unlimited jobs", included: true, icon: Briefcase },
      { name: "Basic job search filters", included: true, icon: Search },
      { name: "Premium CV templates", included: false, icon: Crown },
      { name: "Featured proposals", included: false, icon: Star },
      { name: "Priority in search results", included: false, icon: TrendingUp },
      { name: "Advanced analytics", included: false, icon: BarChart3 },
      { name: "Premium support", included: false, icon: Shield },
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "jobseeker-premium",
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
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()

  // Manage active tab dynamically with state
  const [activeTab, setActiveTab] = useState(
    session ? (session.user?.role === "recruiter" ? "recruiters" : "jobseekers") : "recruiters"
  )

  const formatPrice = (price: { monthly: number; yearly: number }) => {
    const amount = isYearly ? price.yearly : price.monthly
    if (amount === 0) return "Free"

    if (isYearly) {
      const monthlyEquivalent = Math.round(amount / 12)
      return `$${amount}/year ($${monthlyEquivalent}/mo)`
    }
    return `$${amount}/month`
  }

  const getSavings = (price: { monthly: number; yearly: number }) => {
    if (price.monthly === 0) return 0
    const yearlyTotal = price.monthly * 12
    const savings = yearlyTotal - price.yearly
    return Math.round((savings / yearlyTotal) * 100)
  }

  // Filter plans based on session and role (show all plans for viewing)
  const filteredRecruiterPlans = session 
    ? session.user?.role === "recruiter" 
      ? recruiterPlans
      : []
    : recruiterPlans

  const filteredJobSeekerPlans = session 
    ? session.user?.role === "job_seeker" 
      ? jobSeekerPlans
      : []
    : jobSeekerPlans

  const selectedPlanData = [...recruiterPlans, ...jobSeekerPlans].find((plan) => plan.id === selectedPlan)
  const priceToPay = selectedPlanData ? (isYearly ? selectedPlanData.price.yearly : selectedPlanData.price.monthly) : 0

  const handlePlanSelect = (planId: string) => {
    if (isPlanSelectable(planId)) {
      setSelectedPlan(planId)
    }
  }

  // Determine if a plan is selectable based on user role and current plan
  const isPlanSelectable = (planId: string) => {
    if (!session || !session?.user?.plan) return true // Non-logged-in users can select any plan
    const userRole = session.user.role
    const userPlan = session.user.plan
    if (userRole === "recruiter") {
      if (userPlan === "free") return planId !== "recruiter-free" // Can select Basic or Premium
      if (userPlan === "basic") return planId === "recruiter-premium" // Can only select Premium
      if (userPlan === "premium") return planId === "recruiter-premium" || planId === "recruiter-basic" // Can select Premium or Basic
    }
    if (userRole === "job_seeker") {
      if (userPlan === "free") return planId === "jobseeker-premium" // Can only select Premium
      if (userPlan === "premium") return false // Cannot select any plan (but plans are visible)
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Choose Your Perfect Plan</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {session 
              ? `Upgrade your ${session.user?.role === "recruiter" ? "recruiting" : "job search"} experience with our premium plans.`
              : "Whether you're hiring top talent or searching for your dream job, we have the right plan to accelerate your success."
            }
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Label
              htmlFor="billing-toggle"
              className={`text-sm font-medium ${!isYearly ? "text-blue-600" : "text-gray-500"}`}
            >
              Monthly
            </Label>
            <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
            <Label
              htmlFor="billing-toggle"
              className={`text-sm font-medium ${isYearly ? "text-blue-600" : "text-gray-500"}`}
            >
              Yearly
            </Label>
            {isYearly && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Save up to 20%
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="recruiters" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>For Recruiters</span>
            </TabsTrigger>
            <TabsTrigger value="jobseekers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>For Job Seekers</span>
            </TabsTrigger>
          </TabsList>

          {/* Recruiter Plans */}
          <TabsContent value="recruiters">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
              {filteredRecruiterPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative transition-all duration-300 ${
                    isPlanSelectable(plan.id) ? "hover:shadow-lg cursor-pointer" : "opacity-50 cursor-not-allowed"
                  } ${selectedPlan === plan.id ? "ring-2 ring-blue-500 shadow-xl scale-105" : ""}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">{plan.badge}</Badge>
                    </div>
                  )}
                  {session && plan.id === `recruiter-${session.user?.plan}` && (
                    <div className="absolute -top-4 right-4">
                      <Badge className="bg-green-600 text-white px-4 py-1">Current Plan</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">{plan.description}</CardDescription>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{formatPrice(plan.price)}</div>
                    {isYearly && plan.price.monthly > 0 && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Save {getSavings(plan.price)}%
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                              feature.included ? "bg-green-100" : "bg-gray-100"
                            }`}
                          >
                            {feature.included ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <X className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                          <feature.icon className={`h-4 w-4 ${feature.included ? "text-blue-600" : "text-gray-400"}`} />
                          <span className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-500"}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    {!session && (
                      <Button
                        asChild
                        className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                        disabled={isYearly && plan.price.yearly === 0}
                      >
                        {isYearly && plan.price.yearly === 0 ? (
                          <span className="text-gray-400">Only Available on Monthly</span>
                        ) : (
                          <Link href={`/auth/register?role=recruiter`}>{plan.cta}</Link>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Job Seeker Plans */}
          <TabsContent value="jobseekers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {filteredJobSeekerPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative transition-all duration-300 ${
                    isPlanSelectable(plan.id) ? "hover:shadow-lg cursor-pointer" : "opacity-50 cursor-not-allowed"
                  } ${selectedPlan === plan.id ? "ring-2 ring-purple-500 shadow-xl scale-105" : ""}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1">{plan.badge}</Badge>
                    </div>
                  )}
                  {session && plan.id === `jobseeker-${session.user?.plan}` && (
                    <div className="absolute -top-4 right-4">
                      <Badge className="bg-green-600 text-white px-4 py-1">Current Plan</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">{plan.description}</CardDescription>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{formatPrice(plan.price)}</div>
                    {isYearly && plan.price.monthly > 0 && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Save {getSavings(plan.price)}%
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                              feature.included ? "bg-green-100" : "bg-gray-100"
                            }`}
                          >
                            {feature.included ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <X className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                          <feature.icon
                            className={`h-4 w-4 ${feature.included ? "text-purple-600" : "text-gray-400"}`}
                          />
                          <span className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-500"}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    {!session && (
                      <Button
                        asChild
                        className={`w-full ${plan.popular ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                        disabled={isYearly && plan.price.yearly === 0}
                      >
                        {isYearly && plan.price.yearly === 0 ? (
                          <span className="text-gray-400">Only Available on Monthly</span>
                        ) : (
                          <Link href={`/auth/register?role=job_seeker`}>{plan.cta}</Link>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected Plan Summary */}
        {selectedPlanData && session && session.user?.plan !== "premium" && isPlanSelectable(selectedPlanData.id) && (
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
        {session && selectedPlanData && priceToPay > 0 && session.user?.plan !== "premium" && isPlanSelectable(selectedPlanData.id) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              variant="outline" 
              onClick={() => router.push(session.user?.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/jobseeker")} 
              className="min-w-[120px]"
            >
              Back to Dashboard
            </Button>
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
                    if (session.user?.id && selectedPlan) {
                      const planShort = selectedPlan.replace(/^(recruiter|jobseeker)-/, '')
                      const role = selectedPlan.startsWith('recruiter') ? 'recruiter' : 'job_seeker'
                      await fetch("/api/subscription", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: session.user.id, planId: planShort, role }),
                      })
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
                    }
                    toast({ title: "Success", description: "Payment successful!" })
                    router.push(session.user?.role === "recruiter" ? "/dashboard/recruiter/jobs/new" : "/dashboard/jobseeker")
                  }}
                  onError={() => {
                    toast({ title: "Error", description: "Payment failed. Please try again.", variant: "destructive" })
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        )}

        {/* Feature Comparison */}
        <PricingComparison activeTab={activeTab} />

        {/* Testimonials */}
        <PricingTestimonials />

        {/* FAQ */}
        <PricingFAQ />

        {/* CTA Section */}
        {!session && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of companies and job seekers who trust our platform to connect talent with opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/register">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact-us">Contact Sales</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}