import useSWR from "swr"
import { statsService } from "@/services"
import type { PlatformStats } from "@/types/interfaces"

export function usePlatformStats(refreshInterval = 60000) {
  const { data, error, isLoading, mutate } = useSWR<PlatformStats>("/stats", statsService.getPlatformStats, {
    refreshInterval,
    revalidateOnFocus: true,
  })

  return {
    stats: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useJobAnalytics(jobId: string) {
  const { data, error, isLoading, mutate } = useSWR(jobId ? `/jobs/${jobId}/analytics` : null, () =>
    statsService.getJobAnalytics(jobId),
  )

  return {
    analytics: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useRecruiterAnalytics(recruiterId: string) {
  const { data, error, isLoading, mutate } = useSWR(recruiterId ? `/recruiters/${recruiterId}/analytics` : null, () =>
    statsService.getRecruiterAnalytics(recruiterId),
  )

  return {
    analytics: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
