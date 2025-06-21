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
  async getApplications(filters: ApplicationFilters = {}): Promise<JobApplication[]> {
    const params = new URLSearchParams();

    if (filters.jobId) params.append("jobId", filters.jobId);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    try {
      const response = await axiosInstance.get(`/applications?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to load applications");
    }
  },

  async getApplicationById(id: string): Promise<JobApplication> {
    try {
      const response = await axiosInstance.get(`/applications/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to fetch application");
    }
  },

  async submitApplication(applicationData: Partial<JobApplication>): Promise<JobApplication> {
    try {
      const response = await axiosInstance.post("/applications", applicationData);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to submit application");
    }
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<JobApplication> {
    try {
      const response = await axiosInstance.patch(`/applications/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to update application status");
    }
  },

  async getApplicationsByJobId(jobId: string): Promise<JobApplication[]> {
    try {
      const response = await axiosInstance.get(`/jobs/${jobId}/applications`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to fetch job applications");
    }
  },
};
