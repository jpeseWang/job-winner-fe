import axiosInstance from "@/lib/axios"
import type { ICVTemplate, PaginatedResponse, ApiResponse } from "@/types/interfaces"

export interface TemplateFilters {
    page?: number
    limit?: number
    search?: string
    category?: string
    isPremium?: boolean
    isActive?: boolean
}

export interface CreateTemplateData {
    name: string
    description: string
    thumbnail?: string
    previewImages?: string[]
    htmlTemplate: string
    cssStyles: string
    category: string
    tags?: string[]
    isPremium?: boolean
    price?: number
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {
    isActive?: boolean
}

class TemplateService {
    private baseUrl = "/templates"

    async getTemplates(filters: TemplateFilters = {}): Promise<PaginatedResponse<ICVTemplate>> {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value.toString())
            }
        })

        const response = await axiosInstance.get(`${this.baseUrl}?${params.toString()}`)
        return response.data
    }

    async getTemplate(id: string): Promise<ApiResponse<ICVTemplate>> {
        const response = await axiosInstance.get(`${this.baseUrl}/${id}`)
        return response.data
    }

    async createTemplate(data: CreateTemplateData): Promise<ApiResponse<ICVTemplate>> {
        const response = await axiosInstance.post(this.baseUrl, data)
        return response.data
    }

    async updateTemplate(id: string, data: UpdateTemplateData): Promise<ApiResponse<ICVTemplate>> {
        const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data)
        return response.data
    }

    async deleteTemplate(id: string): Promise<ApiResponse<void>> {
        const response = await axiosInstance.delete(`${this.baseUrl}/${id}`)
        return response.data
    }

    async toggleTemplateStatus(id: string): Promise<ApiResponse<{ isActive: boolean }>> {
        const response = await axiosInstance.patch(`${this.baseUrl}/${id}/toggle-status`)
        return response.data
    }

    async duplicateTemplate(id: string): Promise<ApiResponse<ICVTemplate>> {
        const response = await axiosInstance.post(`${this.baseUrl}/${id}/duplicate`)
        return response.data
    }

    async getTemplateAnalytics(): Promise<ApiResponse<any>> {
        const response = await axiosInstance.get(`${this.baseUrl}/analytics`)
        return response.data
    }
}

export const templateService = new TemplateService()
