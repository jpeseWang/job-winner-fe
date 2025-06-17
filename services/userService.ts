import axiosInstance from "@/lib/axios"
import type { User, UserProfile, PaginatedResponse } from "@/types/interfaces"
import { IUserProfile } from "@/types/interfaces/user"
import type { UserRole, UserStatus } from "@/types/enums"

interface UserFilters {
  role?: UserRole
  status?: UserStatus
  page?: number
  limit?: number
}

export const userService = {
  // Get all users with optional filtering
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams()

    if (filters.role) params.append("role", filters.role)
    if (filters.status) params.append("status", filters.status)
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.limit) params.append("limit", filters.limit.toString())

    const response = await axiosInstance.get(`/users?${params.toString()}`)
    return response.data
  },

  // Get a specific user by ID
  async getUserById(id: string): Promise<User> {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  },

  // Get a user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await axiosInstance.get(`/users/email/${email}`)
      return response.data
    } catch (error) {
      return null
    }
  },

  // Update user role
  async updateRole(role: UserRole) {
    const response = await axiosInstance.post("/set-role", { role })
    return response.data
  },

  // Create a new user
  async createUser(userData: Partial<User>): Promise<User> {
    const response = await axiosInstance.post("/users", userData)
    return response.data
  },

  // Update an existing user
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await axiosInstance.put(`/users/${id}`, userData)
    return response.data
  },

  // Change user status
  async changeUserStatus(id: string, status: UserStatus): Promise<User> {
    const response = await axiosInstance.patch(`/users/${id}/status`, { status })
    return response.data
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<IUserProfile> {
    const response = await axiosInstance.get(`/profiles/${userId}`)
    return response.data
  },

  // Update user profile
  async updateUserProfile(userId: string, profileData: Partial<IUserProfile>): Promise<UserProfile> {
    const response = await axiosInstance.put(`/profiles/${userId}`, profileData)
    return response.data
  },

  // Authenticate user (mock implementation)
  async authenticateUser(email: string, password: string, userType: UserRole): Promise<User | null> {
    // In a real app, this would verify credentials against your database
    // For demo purposes, we'll use a mock authentication
    try {
      const response = await axiosInstance.post("/auth/login", { email, password, userType })
      return response.data
    } catch (error) {
      return null
    }
  },
}
