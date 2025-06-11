"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"
import { UserRole } from "@/types/enums"

interface ProtectedLayoutProps {
  children: ReactNode
  requiredRole?: UserRole.ADMIN | UserRole.JOB_SEEKER | UserRole.RECRUITER
}

export default function ProtectedLayout({ children, requiredRole }: ProtectedLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login")
    } else if (requiredRole && session?.user?.role !== requiredRole) {
      router.replace("/unauthorized")
    }
  }, [status, session, router, requiredRole])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  }

  return <>{children}</>
}
