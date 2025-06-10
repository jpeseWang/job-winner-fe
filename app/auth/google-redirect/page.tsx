"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { UserRole } from "@/types/enums"
import User from "@/models/User"
export default function GoogleRedirect() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const setRole = async () => {
      const role = params.get("role")
      await fetch("/api/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })
      switch (role) {
        case UserRole.ADMIN:
          router.push("/dashboard/admin")
          break
        case UserRole.RECRUITER:
          router.push("/dashboard/recruiter")
          break
        case UserRole.JOB_SEEKER:
          router.push("/dashboard/job-seeker/proposals")
          break
        default:
          router.push("/")

      }

    }

    setRole()
  }, [])

  return <div className="flex h-screen items-center justify-center bg-white text-gray-500 text-sm">
    <span>Logging in, please wait...</span>
  </div>
}
