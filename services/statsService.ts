import axiosInstance from "@/lib/axios"
import type { PlatformStats } from "@/types/interfaces"

export const statsService = {
  // Get platform statistics
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await axiosInstance.get("/stats")
    return response.data
  },

  // Get job analytics
  async getJobAnalytics(jobId: string): Promise<any> {
    const response = await axiosInstance.get(`/jobs/${jobId}/analytics`)
    return response.data
  },

  // Get recruiter analytics
  async getRecruiterAnalytics(recruiterId: string): Promise<any> {
    const response = await axiosInstance.get(`/recruiters/${recruiterId}/analytics`)
    return response.data
  },
}
