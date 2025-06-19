"use client"

import useSWR from "swr"
import { useState } from "react"
import { jobService } from "@/services"
import type { Job, PaginatedResponse } from "@/types/interfaces"
import { ITEMS_PER_PAGE } from "@/constants"
import type { JobFilters } from "@/types/interfaces/job"

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

  if (filters.sort) queryParams.append("sort", filters.sort)

  if (filters.category?.length)
    queryParams.append("category", filters.category.join(","))

  if (filters.type?.length)
    queryParams.append("type", filters.type.join(","))

  if (filters.experienceLevel?.length)
    queryParams.append("experienceLevel", filters.experienceLevel.join(","))

  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())

  const queryKey = `/jobs?${queryParams.toString()}`

  const { data, error, isLoading, isValidating, mutate } = useSWR(queryKey, () => jobService.getJobs({ ...filters, page, limit }),
    {
      initialData: options.initialData,
      refreshInterval: options.refreshInterval,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  )

  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
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
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/jobs/${id}` : null,
    () => jobService.getJobById(id)
  )

  return {
    job: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
