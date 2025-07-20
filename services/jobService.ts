import axiosInstance from "@/lib/axios"
import axiosServer from "@/lib/axiosServer";
import type { Job, PaginatedResponse } from "@/types/interfaces"
import type { JobStatus } from "@/types/enums"
import type { JobFilters } from "@/types/interfaces/job"

export const jobService = {
  async getJobs(filters: JobFilters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;
      params.append(key, Array.isArray(value) ? value.join(",") : String(value));
    });

    try {
      const res = await axiosInstance.get(`/jobs?${params.toString()}`);
      const fixedData = (res.data.data as any[]).map((j) =>
        j.id ? j : j._id ? { ...j, id: j._id.toString() } : null
      ).filter(Boolean);

      return { ...res.data, data: fixedData };
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to fetch jobs");
    }
  },

  async getJobById(id: string, server = false): Promise<Job> {
    try {
      if (server) {
        const res = await axiosServer.get(`/jobs/${id}`);
        const job = res.data;
        return job.id ? job : { ...job, id: job._id?.toString?.() ?? "" };
      } else {
        const res = await axiosInstance.get(`/jobs/${id}`);
        const job = res.data;
        return job.id ? job : { ...job, id: job._id?.toString?.() ?? "" };
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new Error("Job not found");
      }
      throw new Error(error?.response?.data?.error || "Failed to fetch job");
    }
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      const res = await axiosInstance.post("/jobs", jobData)
      return res.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to create job")
    }
  },

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      const res = await axiosInstance.put(`/jobs/${id}`, jobData)
      return res.data
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new Error("Job not found for update")
      }
      throw new Error(error?.response?.data?.error || "Failed to update job")
    }
  },

  async deleteJob(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosInstance.delete(`/jobs/${id}`)
      return res.data
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new Error("Job not found for deletion")
      }
      throw new Error(error?.response?.data?.error || "Failed to delete job")
    }
  },

  async changeJobStatus(id: string, status: JobStatus): Promise<Job> {
    try {
      const res = await axiosInstance.patch(`/jobs/${id}/status`, { status })
      return res.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to change job status")
    }
  },

  async toggleFeatured(id: string, featured: boolean): Promise<Job> {
    try {
      const res = await axiosInstance.patch(`/jobs/${id}/featured`, { featured })
      return res.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to toggle featured")
    }
  },

  async getFilterMetadata() {
    try {
      const res = await axiosInstance.get("/meta/job-filters")
      return res.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to load filter metadata")
    }
  },

  async getJobOverview(): Promise<{ jobCount: number; companyCount: number; candidateCount: number }> {
    try {
      const res = await axiosInstance.get("/meta/overview")
      return res.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to fetch job overview")
    }
  },

  async getLatestJobs(limit = 5) {
    try {
      const res = await axiosInstance.get(`/jobs?sort=latest&limit=${limit}`)

      return (res.data.data as any[]).flatMap((j) =>
        j.id
          ? j
          : j._id
            ? { ...j, id: j._id.toString() }
            : []
      );
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to load latest jobs")
    }
  }
}
