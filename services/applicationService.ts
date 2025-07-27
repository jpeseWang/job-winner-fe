import axiosInstance from "@/lib/axios"
import type { ApplicationStatus } from "@/types/enums"

export interface ApplicationFilters {
  search?: string
  status?: ApplicationStatus
  jobId?: string
  page?: number
  limit?: number
}

export interface UserApplicationsResponse {
  applications: any[]
  total: number
  totalPages: number
  currentPage: number
  limit: number
}

export const applicationService = {
  // Get applications with filters
  async getApplications(filters: ApplicationFilters = {}) {
    const params = new URLSearchParams()

    if (filters.search) params.append("search", filters.search)
    if (filters.status) params.append("status", filters.status)
    if (filters.jobId) params.append("jobId", filters.jobId)
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.limit) params.append("limit", filters.limit.toString())

    // Use recruiter-specific endpoint if no specific jobId is provided
    const endpoint = filters.jobId ? `/applications?${params.toString()}` : `/applications/by-recruiter?${params.toString()}`
    const response = await axiosInstance.get(endpoint)
    
    // Handle different response structures
    if (filters.jobId) {
      // Regular applications endpoint returns { data: [...] }
      return response.data.data || response.data
    } else {
      // Recruiter endpoint returns array directly
      return response.data
    }
  },

  // Get user's applications
  async getUserApplications(userId: string, filters: ApplicationFilters = {}): Promise<UserApplicationsResponse> {
    const params = new URLSearchParams()

    if (filters.search) params.append("search", filters.search)
    if (filters.status) params.append("status", filters.status)
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.limit) params.append("limit", filters.limit.toString())

    const response = await axiosInstance.get(`/applications/user/${userId}?${params.toString()}`)
    return response.data.data
  },

  // Get applications for a specific job
  async getApplicationsByJobId(jobId: string) {
    const response = await axiosInstance.get(`/jobs/${jobId}/applications`)
    return response.data.data
  },

  // Get single application by ID
  async getApplicationById(id: string) {
    const response = await axiosInstance.get(`/applications/${id}`)
    return response.data.data
  },

  // Create new application
  async createApplication(applicationData: {
    jobId: string
    coverLetter?: string
    resumeUrl?: string
    additionalDocuments?: string[]
  }) {
    const response = await axiosInstance.post("/applications", applicationData)
    return response.data.data
  },

  // Update application status (for recruiters)
  async updateApplicationStatus(id: string, status: ApplicationStatus, feedback?: string) {
    const response = await axiosInstance.patch(`/applications/by-recruiter`, {
      applicationId: id,
      status,
      feedback,
    })
    return response.data.data
  },

  // Update application notes (for job seekers)
  async updateApplicationNotes(id: string, notes: string) {
    const response = await axiosInstance.put(`/applications/${id}`, {
      notes,
    })
    return response.data.data
  },

  // Schedule interview
  async scheduleInterview(id: string, interviewDate: string) {
    const response = await axiosInstance.put(`/applications/${id}`, {
      interviewDate,
      status: "interviewed" as ApplicationStatus,
    })
    return response.data.data
  },

  // Delete application
  async deleteApplication(id: string) {
    const response = await axiosInstance.delete(`/applications/${id}`)
    return response.data
  },

  // Get application statistics
  async getApplicationStats(userId?: string) {
    const params = userId ? `?userId=${userId}` : ""
    const response = await axiosInstance.get(`/applications/stats${params}`)
    return response.data.data
  },

  // Bulk update applications
  async bulkUpdateApplications(
    applicationIds: string[],
    updates: Partial<{
      status: ApplicationStatus
      notes: string
      feedback: string
    }>,
  ) {
    const response = await axiosInstance.put("/applications/bulk", {
      applicationIds,
      updates,
    })
    return response.data.data
  },

  // Export applications
  async exportApplications(filters: ApplicationFilters = {}, format: "csv" | "pdf" = "csv") {
    const params = new URLSearchParams()

    if (filters.search) params.append("search", filters.search)
    if (filters.status) params.append("status", filters.status)
    if (filters.jobId) params.append("jobId", filters.jobId)
    params.append("format", format)

    const response = await axiosInstance.get(`/applications/export?${params.toString()}`, {
      responseType: "blob",
    })

    return response.data
  },
}
