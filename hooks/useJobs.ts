"use client"

import useSWR from "swr"
import { useState } from "react"
import { jobService } from "@/services"
import type { Job, PaginatedResponse } from "@/types/interfaces"
import type { JobStatus, JobType } from "@/types/enums"
import { ITEMS_PER_PAGE } from "@/constants"

interface JobFilters {
  keyword?: string
  location?: string
  category?: string
  type?: JobType
  status?: JobStatus
  featured?: boolean
}

interface UseJobsOptions {
  initialData?: PaginatedResponse<Job>
  refreshInterval?: number
}

export function useJobs(filters: JobFilters = {}, options: UseJobsOptions = {}) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(ITEMS_PER_PAGE)

  // Create a unique key for SWR based on all filter parameters
  const queryParams = new URLSearchParams()
  if (filters.keyword) queryParams.append("keyword", filters.keyword)
  if (filters.location) queryParams.append("location", filters.location)
  if (filters.category) queryParams.append("category", filters.category)
  if (filters.type) queryParams.append("type", filters.type)
  if (filters.status) queryParams.append("status", filters.status)
  if (filters.featured !== undefined) queryParams.append("featured", filters.featured.toString())
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())

  const queryKey = `/jobs?${queryParams.toString()}`

  // Fetch jobs with SWR
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    queryKey,
    () => jobService.getJobs({ ...filters, page, limit }),
    {
      initialData: options.initialData,
      refreshInterval: options.refreshInterval,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
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
    jobs: data?.data || [],
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
  }
}

export function useJob(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/jobs/${id}` : null, () => jobService.getJobById(id))

  return {
    job: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
