import axiosInstance from "@/lib/axios"
import type { Job, PaginatedResponse } from "@/types/interfaces"
import type { JobStatus } from "@/types/enums"
import type { JobFilters } from "@/types/interfaces/job"

export const jobService = {
  // Get all jobs with optional filtering
  async getJobs(filters: JobFilters = {}) {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return

      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(","))
      } else if (!Array.isArray(value)) {
        params.append(key, String(value))
      }
    })

    const res = await axiosInstance.get(`/jobs?${params.toString()}`)
    return res.data
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

  // Get filter metadata (categories, types, levels, etc.)
  async getFilterMetadata(): Promise<{
    categories: { label: string; count: number }[]
    types: { label: string; count: number }[]
    experienceLevels: { label: string; count: number }[]
    locations: string[]
  }> {
    const response = await axiosInstance.get("/meta/job-filters")
    return response.data
  },
}
