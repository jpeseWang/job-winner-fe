"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Invalid verification link")
        return
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const result = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(result.message)
        } else {
          setStatus("error")
          setMessage(result.error || "Verification failed")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Verifying your email address..."}
            {status === "success" && "Your email has been verified successfully"}
            {status === "error" && "Email verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          )}

          {status === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-2">
            <Link href="/auth/login">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Continue to Login</Button>
            </Link>
            {status === "error" && (
              <Link href="/auth/register">
                <Button variant="outline" className="w-full">
                  Back to Registration
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
