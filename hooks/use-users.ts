"use client"

import useSWR from "swr"
import { useState } from "react"
import { userService } from "@/services"
import type { User, PaginatedResponse } from "@/types/interfaces"
import type { UserRole, UserStatus } from "@/types/enums"
import { ITEMS_PER_PAGE } from "@/constants"

interface UserFilters {
  role?: UserRole
  status?: UserStatus
}

export function useUsers(filters: UserFilters = {}) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(ITEMS_PER_PAGE)

  // Create a unique key for SWR based on all filter parameters
  const queryParams = new URLSearchParams()
  if (filters.role) queryParams.append("role", filters.role)
  if (filters.status) queryParams.append("status", filters.status)
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())

  const queryKey = `/users?${queryParams.toString()}`

  // Fetch users with SWR
  const { data, error, isLoading, isValidating, mutate } = useSWR<PaginatedResponse<User>>(queryKey, () =>
    userService.getUsers({ ...filters, page, limit }),
  )

  // Helper function to change page
  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  // Helper function to change items per page
  const changeLimit = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page when changing limit
  }

  // Helper function to update user status
  const updateStatus = async (id: string, status: UserStatus) => {
    try {
      await userService.changeUserStatus(id, status)
      mutate() // Refresh the data
      return true
    } catch (error) {
      console.error("Failed to update user status:", error)
      return false
    }
  }

  return {
    users: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: page,
    limit,
    isLoading,
    isValidating,
    error,
    goToPage,
    changeLimit,
    refresh: mutate,
    updateStatus,
  }
}

export function useUser(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/users/${id}` : null, () => userService.getUserById(id))

  return {
    user: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useUserProfile(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/profiles/${userId}` : null, () =>
    userService.getUserProfile(userId),
  )

  return {
    profile: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
