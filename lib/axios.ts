import axios from "axios"
import { API_BASE_URL } from "@/constants"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    let token: string | null = null
    if (typeof window !== "undefined" && window.localStorage) {
      token = localStorage.getItem("token")
    }
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
      if (error.response.status === 401) {
        console.error("Unauthorized access")
      } else if (error.response.status === 403) {
        console.error("Forbidden access")
      } else if (error.response.status === 404) {
        console.error("Resource not found")
      } else if (error.response.status === 500) {
        console.error("Server error")
      }
    } else if (error.request) {
      console.error("No response received from server")
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message)
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
