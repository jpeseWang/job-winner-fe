"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MailCheck } from "lucide-react"

export default function MailSentPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            We’ve sent a verification link to{" "}
            <span className="font-semibold text-teal-600">{email}</span>. Please check your inbox
            (and your spam folder) then follow the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <MailCheck className="h-10 w-10 text-teal-600" />
        </CardContent>
      </Card>
    </main>
  )
}
