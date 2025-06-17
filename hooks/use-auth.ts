"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { UserRole } from "@/types/enums"

type UserWithRole = {
  id?: string | null
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

type SessionWithRole = {
  user?: UserWithRole
}

export function useAuth() {
  const { data: session, status } = useSession() as { data: SessionWithRole | null, status: string }
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set loading to false once the session status is determined
    if (status !== "loading") {
      // Small delay to ensure UI consistency
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [status])

  const login = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const loginAdmin = async () => {
    // For admin login, we'll redirect to a special page after Google auth
    // where we can check if the user has admin privileges
    await signIn("google", { callbackUrl: "/admin/auth-check" })
  }

  const logout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const isAuthenticated = !!session
  const isAdmin = session?.user?.role === UserRole.ADMIN

  return {
    user: session?.user,
    loading: isLoading || status === "loading",
    login,
    loginAdmin,
    logout,
    isAuthenticated,
    isAdmin,
  }
}