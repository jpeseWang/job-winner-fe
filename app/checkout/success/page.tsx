"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, Calendar, ArrowRight, Star, Gift, Users, Briefcase } from "lucide-react"

export default function CheckoutSuccessPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Premium! 🎉</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your subscription has been activated successfully. You now have access to all premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Confirmation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Order Confirmation
                </CardTitle>
                <CardDescription>A confirmation email has been sent to your inbox</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900">Premium Plan Activated</h3>
                      <p className="text-sm text-green-700">Order #PM-2024-001234</p>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Billing Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Plan: Premium Monthly</p>
                      <p>Amount: $99.00</p>
                      <p>Next billing: January 24, 2025</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Account Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Email: john@example.com</p>
                      <p>Account type: Recruiter</p>
                      <p>Trial ends: January 10, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2 text-purple-600" />
                  What's Next?
                </CardTitle>
                <CardDescription>
                  Here are some recommended next steps to get the most out of your premium subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-3">
                      <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
                      <h4 className="font-semibold">Post Your First Job</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Start hiring with unlimited job postings and AI-powered candidate matching.
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link href="/dashboard/recruiter/jobs/new">Post a Job</Link>
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-3">
                      <Users className="h-6 w-6 text-green-600 mr-2" />
                      <h4 className="font-semibold">Explore Candidates</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Browse our talent pool and find the perfect candidates for your roles.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/dashboard/recruiter/candidates">Browse Talent</Link>
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-6 w-6 text-purple-600 mr-2" />
                      <h4 className="font-semibold">Schedule Onboarding</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Book a free onboarding call with your dedicated account manager.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/onboarding">Schedule Call</Link>
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-3">
                      <Download className="h-6 w-6 text-orange-600 mr-2" />
                      <h4 className="font-semibold">Download Resources</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Access premium hiring guides, templates, and best practices.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/resources">Get Resources</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Premium Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Your Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Unlimited job postings</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>AI-powered matching</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Dedicated support</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Company branding</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Priority candidate access</span>
                </div>
              </CardContent>
            </Card>

            {/* Special Offer */}
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <Gift className="h-5 w-5 mr-2" />
                  Limited Time Bonus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 mb-4">
                  As a new premium member, you get 3 months of our premium job posting templates absolutely free!
                </p>
                <Button asChild size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Link href="/templates/premium">Claim Bonus</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Our support team is here to help you succeed.</p>
                <div className="space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/help">Help Center</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/contact-us">Contact Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12 py-8 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Hiring?</h2>
          <p className="text-gray-600 mb-6">Your premium features are now active. Let's find your next great hire!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard/recruiter">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/recruiter/jobs/new">Post Your First Job</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
