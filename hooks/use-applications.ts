"use client"

import useSWR from "swr"
import { useState } from "react"
import { applicationService } from "@/services"
import type { ApplicationStatus } from "@/types/enums"
import { ITEMS_PER_PAGE } from "@/constants"

interface ApplicationFilters {
  jobId?: string
  status?: ApplicationStatus
}

export function useApplications(filters: ApplicationFilters = {}) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(ITEMS_PER_PAGE)

  // Create a unique key for SWR based on all filter parameters
  const queryParams = new URLSearchParams()
  if (filters.jobId) queryParams.append("jobId", filters.jobId)
  if (filters.status) queryParams.append("status", filters.status)
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())

  const queryKey = `/applications/by-recruiter?${queryParams.toString()}`

  // Fetch applications with SWR
  const { data, error, isLoading, isValidating, mutate } = useSWR(queryKey, () =>
    applicationService.getApplicationsByRecruiter({ ...filters, page, limit }),
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
