"use client"

import useSWR from "swr"
import { useState } from "react"
import { applicationService } from "@/services"
import type { ApplicationStatus } from "@/types/enums"

interface ApplicationFilters {
  jobId?: string
  status?: ApplicationStatus | "all"
  search?: string
}

export function useApplications(filters: ApplicationFilters = {}) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Create a unique key for SWR based on all filter parameters
  const queryParams = new URLSearchParams()
  if (filters.jobId) queryParams.append("jobId", filters.jobId)
  if (filters.status && filters.status !== "all") queryParams.append("status", filters.status)
  if (filters.search) queryParams.append("search", filters.search)
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())

  const queryKey = `/applications?${queryParams.toString()}`

  // Fetch applications with SWR
  const { data, error, isLoading, isValidating, mutate } = useSWR(queryKey, () =>
    applicationService.getApplications({
      ...filters,
      status: filters.status === "all" ? undefined : (filters.status as ApplicationStatus),
      page,
      limit,
    }),
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

  // Helper function to update application status
  const updateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await applicationService.updateApplicationStatus(id, status)
      mutate() // Refresh the data
      return true
    } catch (error) {
      console.error("Failed to update application status:", error)
      return false
    }
  }

  // Helper function to update application notes
  const updateNotes = async (id: string, notes: string) => {
    try {
      await applicationService.updateApplicationNotes(id, notes)
      mutate() // Refresh the data
      return true
    } catch (error) {
      console.error("Failed to update application notes:", error)
      return false
    }
  }

  return {
    applications: data || [],
    isLoading,
    isValidating,
    error,
    currentPage: page,
    limit,
    goToPage,
    changeLimit,
    refresh: mutate,
    updateStatus,
    updateNotes,
  }
}

export function useUserApplications(userId: string, filters: ApplicationFilters = {}) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Create a unique key for SWR based on all filter parameters
  const queryParams = new URLSearchParams()
  if (filters.status && filters.status !== "all") queryParams.append("status", filters.status)
  if (filters.search) queryParams.append("search", filters.search)
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())

  const queryKey = userId ? `/applications/user/${userId}?${queryParams.toString()}` : null

  // Fetch applications with SWR
  const { data, error, isLoading, isValidating, mutate } = useSWR(queryKey, () =>
    applicationService.getUserApplications(userId, {
      ...filters,
      status: filters.status === "all" ? undefined : (filters.status as ApplicationStatus),
      page,
      limit,
    }),
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

  return {
    applications: data?.applications || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    isValidating,
    error,
    currentPage: page,
    limit,
    goToPage,
    changeLimit,
    refresh: mutate,
  }
}

export function useJobApplications(jobId: string) {
  const { data, error, isLoading, mutate } = useSWR(jobId ? `/jobs/${jobId}/applications` : null, () =>
    applicationService.getApplicationsByJobId(jobId),
  )

  return {
    applications: data || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useApplicationDetails(applicationId: string) {
  const { data, error, isLoading, mutate } = useSWR(applicationId ? `/applications/${applicationId}` : null, () =>
    applicationService.getApplicationById(applicationId),
  )

  return {
    application: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useApplicationStats(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/applications/stats?userId=${userId}` : "/applications/stats",
    () => applicationService.getApplicationStats(userId),
  )

  return {
    stats: data || {},
    isLoading,
    error,
    refresh: mutate,
  }
}
