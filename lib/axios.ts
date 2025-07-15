import axios from "axios"
import { API_BASE_URL } from "@/constants"

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 10 seconds
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      if (error.response.status === 401) {
        // Handle unauthorized access
        // For example, redirect to login page
        console.error("Unauthorized access")
        // You could dispatch a logout action here or redirect
      } else if (error.response.status === 403) {
        // Handle forbidden access
        console.error("Forbidden access")
      } else if (error.response.status === 404) {
        // Handle not found
        console.error("Resource not found")
      } else if (error.response.status === 500) {
        // Handle server error
        console.error("Server error")
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server")
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message)
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
