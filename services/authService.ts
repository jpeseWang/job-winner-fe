import axiosInstance from "@/lib/axios"
import type { UserRole } from "@/types/enums"

export const authService = {
  async register(data: {
    name: string
    email: string
    password: string
    role: UserRole
    company?: string
  }) {
    const response = await axiosInstance.post("/auth/register", data)
    return response.data
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post("/auth/forgot-password", { email })
    return response.data
  },

  async resetPassword(payload: { token: string | null; password: string }) {
    const response = await axiosInstance.post("/auth/reset-password", payload)
    return response.data
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await axiosInstance.post("/auth/verify-email", { token })
    return response.data
  },
}
