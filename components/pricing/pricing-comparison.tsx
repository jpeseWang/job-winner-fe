"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

const recruiterFeatures = [
  {
    category: "Job Posting",
    features: [
      { name: "Monthly job postings", free: "5", basic: "20", premium: "Unlimited" },
      { name: "Job posting duration", free: "30 days", basic: "60 days", premium: "90 days" },
      { name: "Job renewal", free: "Manual", basic: "Manual", premium: "Auto-renewal" },
      { name: "Bulk job posting", free: false, basic: false, premium: true },
      { name: "Job templates", free: "Basic", basic: "Advanced", premium: "Custom" },
    ],
  },
  {
    category: "Candidate Management",
    features: [
      { name: "Candidate search", free: "Basic", basic: "Advanced", premium: "AI-powered" },
      { name: "Application tracking", free: "Basic", basic: "Advanced", premium: "Full CRM" },
      { name: "Candidate matching", free: false, basic: false, premium: true },
      { name: "Talent pipeline", free: false, basic: "Limited", premium: "Unlimited" },
      { name: "Candidate notes", free: "Basic", basic: "Advanced", premium: "Collaborative" },
    ],
  },
  {
    category: "Analytics & Insights",
    features: [
      { name: "Job performance analytics", free: "Basic", basic: "Advanced", premium: "Premium" },
      { name: "Candidate source tracking", free: false, basic: true, premium: true },
      { name: "Hiring funnel analysis", free: false, basic: "Basic", premium: "Advanced" },
      { name: "Custom reports", free: false, basic: false, premium: true },
      { name: "Data export", free: false, basic: "CSV", premium: "Multiple formats" },
    ],
  },
  {
    category: "Support & Features",
    features: [
      { name: "Support level", free: "Community", basic: "Email", premium: "Dedicated manager" },
      { name: "Company branding", free: false, basic: "Basic", premium: "Full branding" },
      { name: "API access", free: false, basic: false, premium: true },
      { name: "Integrations", free: "Basic", basic: "Standard", premium: "Enterprise" },
      { name: "White-label options", free: false, basic: false, premium: true },
    ],
  },
]

const jobSeekerFeatures = [
  {
    category: "CV & Profile",
    features: [
      { name: "CV templates", free: "Free templates only", premium: "All premium templates" },
      { name: "CV downloads", free: "3 per month", premium: "Unlimited" },
      { name: "CV formats", free: "PDF only", premium: "PDF, Word, Text" },
      { name: "Profile customization", free: "Basic", premium: "Advanced" },
      { name: "Portfolio showcase", free: false, premium: true },
    ],
  },
  {
    category: "Job Search",
    features: [
      { name: "Job applications", free: "Unlimited", premium: "Unlimited" },
      { name: "Featured proposals", free: false, premium: "5x visibility" },
      { name: "Priority in search", free: false, premium: true },
      { name: "Advanced filters", free: "Basic", premium: "Advanced" },
      { name: "Saved searches", free: "3", premium: "Unlimited" },
    ],
  },
  {
    category: "Career Tools",
    features: [
      { name: "Job alerts", free: "Basic", premium: "Smart alerts" },
      { name: "Salary insights", free: false, premium: true },
      { name: "Interview prep", free: false, premium: true },
      { name: "Career coaching", free: false, premium: true },
      { name: "Skill assessments", free: false, premium: true },
    ],
  },
  {
    category: "Analytics & Support",
    features: [
      { name: "Profile analytics", free: "Basic", premium: "Advanced" },
      { name: "Application tracking", free: "Basic", premium: "Detailed" },
      { name: "Support level", free: "Community", premium: "Priority" },
      { name: "Ad-free experience", free: false, premium: true },
      { name: "Early access features", free: false, premium: true },
    ],
  },
]

interface PricingComparisonProps {
  activeTab: string
}

export default function PricingComparison({ activeTab }: PricingComparisonProps) {
  const features = activeTab === "recruiters" ? recruiterFeatures : jobSeekerFeatures
  const planNames = activeTab === "recruiters" ? ["Free", "Basic", "Premium"] : ["Free", "Premium"]

  const renderFeatureValue = (value: any) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-600 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-400 mx-auto" />
      )
    }
    return <span className="text-sm text-gray-900 font-medium">{value}</span>
  }

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Feature Comparison</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Compare all features across our plans to find the perfect fit for your needs.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {features.map((category) => (
            <Card key={category.category} className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                        {planNames.map((plan) => (
                          <th key={plan} className="text-center py-3 px-4 font-medium text-gray-900 min-w-[120px]">
                            <Badge variant={plan === "Basic" || plan === "Premium" ? "default" : "outline"}>
                              {plan}
                            </Badge>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((feature, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-900">{feature.name}</td>
                          {activeTab === "recruiters" ? (
                            <>
                              <td className="py-4 px-4 text-center">{renderFeatureValue((feature as any).free)}</td>
                              <td className="py-4 px-4 text-center">{renderFeatureValue((feature as any).basic)}</td>
                              <td className="py-4 px-4 text-center">{renderFeatureValue((feature as any).premium)}</td>
                            </>
                          ) : (
                            <>
                              <td className="py-4 px-4 text-center">{renderFeatureValue((feature as any).free)}</td>
                              <td className="py-4 px-4 text-center">{renderFeatureValue((feature as any).premium)}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
