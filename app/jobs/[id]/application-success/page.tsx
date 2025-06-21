import Link from "next/link"
import { CheckCircle, ArrowLeft, Briefcase, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ApplicationSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your interest in this position. We've received your application and will review it carefully.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-blue-900">Application Review</p>
                <p className="text-blue-700 text-sm">Our team will review your application within 2-3 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-blue-900">Initial Screening</p>
                <p className="text-blue-700 text-sm">
                  If you're a good fit, we'll contact you for an initial screening call.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-blue-900">Interview Process</p>
                <p className="text-blue-700 text-sm">We'll guide you through our interview process and next steps.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
          <Mail className="h-4 w-4" />
          <p className="text-sm">
            We'll send updates to your email address. Please check your spam folder if you don't see our emails.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Browse More Jobs
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/job-seeker">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>
            Need help? Contact our support team at{" "}
            <a href="mailto:support@jobmarket.com" className="text-blue-600 hover:underline">
              support@jobmarket.com
            </a>
          </p>
        </div>
      </Card>
    </main>
  )
}
