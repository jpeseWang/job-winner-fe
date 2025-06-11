"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { UserRole } from "@/types/enums"
import { userService } from "@/services"

export default function GoogleRedirect() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const setRole = async () => {
      const role = params.get("role")
      await userService.updateRole(role as UserRole)
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
