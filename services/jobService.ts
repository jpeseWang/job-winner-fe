import axiosInstance from "@/lib/axios"
import type { Job, PaginatedResponse } from "@/types/interfaces"
import type { JobStatus, JobType } from "@/types/enums"

interface JobFilters {
  keyword?: string
  location?: string
  category?: string
  type?: JobType
  page?: number
  limit?: number
  status?: JobStatus
  featured?: boolean
}

export const jobService = {
  // Get all jobs with optional filtering
  async getJobs(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
    const params = new URLSearchParams()

    if (filters.keyword) params.append("keyword", filters.keyword)
    if (filters.location) params.append("location", filters.location)
    if (filters.category) params.append("category", filters.category)
    if (filters.type) params.append("type", filters.type)
    if (filters.status) params.append("status", filters.status)
    if (filters.featured !== undefined) params.append("featured", filters.featured.toString())
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.limit) params.append("limit", filters.limit.toString())

    const response = await axiosInstance.get(`/jobs?${params.toString()}`)
    return response.data
  },

  // Get a specific job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await axiosInstance.get(`/jobs/${id}`)
    return response.data
  },

  // Create a new job
  async createJob(jobData: Partial<Job>): Promise<Job> {
    const response = await axiosInstance.post("/jobs", jobData)
    return response.data
  },

  // Update an existing job
  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData)
    return response.data
  },

  // Delete a job
  async deleteJob(id: string): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`/jobs/${id}`)
    return response.data
  },

  // Change job status
  async changeJobStatus(id: string, status: JobStatus): Promise<Job> {
    const response = await axiosInstance.patch(`/jobs/${id}/status`, { status })
    return response.data
  },

  // Toggle featured status
  async toggleFeatured(id: string, featured: boolean): Promise<Job> {
    const response = await axiosInstance.patch(`/jobs/${id}/featured`, { featured })
    return response.data
  },
}
