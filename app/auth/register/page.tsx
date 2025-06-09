"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, Briefcase, User, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [userType, setUserType] = useState<"job_seeker" | "recruiter">("job_seeker")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType,
        ...(userType === "recruiter" && { company: formData.company }),
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (!response.ok) {
        const message = result?.error || "Registration failed"
        setErrorMessage(message)
        return
      }

      toast({
        title: "Registration successful",
        description: "Please check your inbox to verify your email.",
      })

      // Redirect to login page
      router.push(`/auth/verify-email?email=${(formData.email)}`)
    } catch (error: any) {
      console.error("Error:", error)
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      //Đang dùng tạm để test chức năng login bằng google thôi
      await signOut({ redirect: false })

      await signIn("google", {  prompt: "select_account", callbackUrl: `http://localhost:3000/auth/google-redirect?role=${userType}`, })
    } catch (error) {
      toast({
        title: "Google sign-up failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create your account</CardDescription>
        </CardHeader>
        {errorMessage && (
          <div className="mb-6 w-full rounded border border-red-300 bg-white-50 px-4 py-3 text-sm text-red-600 flex justify-center text-center max-w-sm mx-auto">
            <div className="flex items-start gap-2">
              {/* icon cảnh báo */}
              <svg
                className="mt-[2px] h-5 w-5 flex-shrink-0 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M4.93 19h14.14a1.5 1.5 0 001.44-1.85L13.44 5.3a1.5 1.5 0 00-2.88 0L3.49 17.15A1.5 1.5 0 004.93 19z"
                />
              </svg>

              {/* nội dung lỗi */}
              <p className="leading-snug">{errorMessage}</p>
            </div>
          </div>
        )}

        <CardContent>
          <Tabs defaultValue="job_seeker" onValueChange={(value) => setUserType(value as "job_seeker" | "recruiter")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="job_seeker" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Job Seeker
              </TabsTrigger>
              <TabsTrigger value="recruiter" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Recruiter
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {userType === "recruiter" && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      name="company"
                      placeholder="Acme Inc."
                      className="pl-10"
                      value={formData.company}
                      onChange={handleChange}
                      required={userType === "recruiter"}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Password must be at least 6 characters long.</p>
              </div>

              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-teal-600 hover:text-teal-500">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
