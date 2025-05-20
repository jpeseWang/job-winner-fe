import axiosInstance from "@/lib/axios"
import type { JobApplication } from "@/types/interfaces"
import type { ApplicationStatus } from "@/types/enums"

interface ApplicationFilters {
  jobId?: string
  status?: ApplicationStatus
  page?: number
  limit?: number
}

export const applicationService = {
  // Get all applications with optional filtering
  async getApplications(filters: ApplicationFilters = {}): Promise<JobApplication[]> {
    const params = new URLSearchParams()

    if (filters.jobId) params.append("jobId", filters.jobId)
    if (filters.status) params.append("status", filters.status)
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.limit) params.append("limit", filters.limit.toString())

    const response = await axiosInstance.get(`/applications?${params.toString()}`)
    return response.data
  },

  // Get a specific application by ID
  async getApplicationById(id: string): Promise<JobApplication> {
    const response = await axiosInstance.get(`/applications/${id}`)
    return response.data
  },

  // Submit a new application
  async submitApplication(applicationData: Partial<JobApplication>): Promise<JobApplication> {
    const response = await axiosInstance.post("/applications", applicationData)
    return response.data
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<JobApplication> {
    const response = await axiosInstance.patch(`/applications/${id}/status`, { status })
    return response.data
  },

  // Get applications for a specific job
  async getApplicationsByJobId(jobId: string): Promise<JobApplication[]> {
    const response = await axiosInstance.get(`/jobs/${jobId}/applications`)
    return response.data
  },
}
