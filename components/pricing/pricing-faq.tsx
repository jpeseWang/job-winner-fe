"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"

const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "How does the free trial work?",
        answer:
          "All paid plans come with a 14-day free trial. You can cancel anytime during the trial period without being charged. No credit card required for free plans.",
      },
      {
        question: "Can I change my plan anytime?",
        answer:
          "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated accordingly.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise plans.",
      },
      {
        question: "Is there a setup fee?",
        answer: "No, there are no setup fees or hidden charges. You only pay for your chosen plan.",
      },
    ],
  },
  {
    category: "For Recruiters",
    questions: [
      {
        question: "What happens if I exceed my job posting limit",
        answer:
          "If you reach your monthly limit, you can either upgrade your plan or wait until the next billing cycle. We'll notify you when you're approaching your limit.",
      },
      {
        question: "How long do job postings stay active?",
        answer:
          "Job postings remain active for 30 days (Free), 60 days (Basic), or 90 days (Premium). You can renew or extend postings as needed.",
      },
      {
        question: "Can I get analytics on my job postings?",
        answer:
          "Yes, all plans include analytics. Basic plans get standard metrics, while Premium plans include advanced insights and candidate matching data.",
      },
      {
        question: "Do you offer bulk posting discounts?",
        answer:
          "Premium plans include bulk posting tools. For enterprise needs with 100+ monthly postings, contact our sales team for custom pricing.",
      },
    ],
  },
  {
    category: "For Job Seekers",
    questions: [
      {
        question: "What's included in premium CV templates?",
        answer:
          "Premium templates include advanced designs, ATS-optimized formats, industry-specific layouts, and customizable color schemes with professional typography.",
      },
      {
        question: "How does featured proposal work?",
        answer:
          "Featured proposals appear at the top of application lists and get 5x more visibility to recruiters. Premium users get priority placement in search results.",
      },
      {
        question: "Can I download my CV in different formats?",
        answer:
          "Yes, premium users can download CVs in PDF, Word, and plain text formats. Free users get PDF downloads only.",
      },
      {
        question: "What kind of career coaching is included?",
        answer:
          "Premium plans include access to our career resource library, interview preparation guides, salary negotiation tips, and monthly webinars with career experts.",
      },
    ],
  },
  {
    category: "Billing & Support",
    questions: [
      {
        question: "How does yearly billing work?",
        answer:
          "Yearly plans are billed annually and offer significant savings (up to 20% off). You can switch to yearly billing at any time and get immediate savings.",
      },
      {
        question: "What if I need to cancel my subscription?",
        answer:
          "You can cancel anytime from your account settings. Your plan remains active until the end of your billing period, and you won't be charged again.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund.",
      },
      {
        question: "What support do you provide?",
        answer:
          "Free plans get community support, Basic plans get email support (24-48h response), and Premium plans get priority support with dedicated account managers.",
      },
    ],
  },
]

export default function PricingFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Got questions? We've got answers. If you can't find what you're looking for, feel free to contact our support
          team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {faqData.map((category) => (
          <div key={category.category}>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
              {category.category}
            </h3>

            <div className="space-y-4">
              {category.questions.map((faq, index) => {
                const itemId = `${category.category}-${index}`
                const isOpen = openItems.includes(itemId)

                return (
                  <Card key={itemId} className="border border-gray-200">
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleItem(itemId)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium text-gray-900 pr-4">{faq.question}</CardTitle>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>

                    {isOpen && (
                      <CardContent className="pt-0">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <Button asChild variant="outline">
          <a href="/contact-us">Contact Support</a>
        </Button>
      </div>
    </div>
  )
}
