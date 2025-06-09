"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyByTokenPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link")
      return
    }

    const run = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
        const data = await res.json()
        if (res.ok) {
          setStatus("success")
          setMessage(data.message)
          setTimeout(() => router.push("/auth/login"), 3000)
        } else {
          setStatus("error")
          setMessage(data.error ?? "Verification failed")
        }
      } catch {
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    run()
  }, [token, router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Verifying your email address…"}
            {status === "success" && "Your email has been verified successfully"}
            {status === "error" && "Email verification failed"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex justify-center py-8">
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
