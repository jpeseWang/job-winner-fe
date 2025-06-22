import axiosInstance from "@/lib/axios"

export const notificationService = {
  async notifyRecruiter(params: {
    applicantName: string
    applicantEmail: string
    jobId: string
  }) {
    try {
      await axiosInstance.post("/notify-recruiter", params)
    } catch (err) {
      console.error("Failed to notify recruiter:", err)
    }
  },
}