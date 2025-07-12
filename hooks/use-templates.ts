"use client"

import { useState, useEffect } from "react"
import {
    templateService,
    type TemplateFilters,
    type CreateTemplateData,
    type UpdateTemplateData,
} from "@/services/templateService"
import type { CVTemplate } from "@/types/interfaces"
import { useToast } from "@/hooks/use-toast"

export function useTemplates(initialFilters: TemplateFilters = {}) {
    const [templates, setTemplates] = useState<CVTemplate[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<TemplateFilters>(initialFilters)
    const { toast } = useToast()

    const fetchTemplates = async (newFilters?: TemplateFilters) => {
        try {
            setLoading(true)
            setError(null)

            const currentFilters = newFilters || filters
            const response = await templateService.getTemplates(currentFilters)

            setTemplates(response.data)
            setPagination({
                total: response.total,
                page: response.page,
                limit: response.limit,
                totalPages: response.totalPages
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to fetch templates"
            setError(errorMessage)
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const createTemplate = async (data: CreateTemplateData) => {
        try {
            setLoading(true)
            const response = await templateService.createTemplate(data)

            toast({
                title: "Success",
                description: response.message || "Template created successfully",
            })

            await fetchTemplates()
            return response.data
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to create template"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateTemplate = async (id: string, data: UpdateTemplateData) => {
        try {
            setLoading(true)
            const response = await templateService.updateTemplate(id, data)

            toast({
                title: "Success",
                description: response.message || "Template updated successfully",
            })

            await fetchTemplates()
            return response.data
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to update template"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteTemplate = async (id: string) => {
        try {
            setLoading(true)
            const response = await templateService.deleteTemplate(id)

            toast({
                title: "Success",
                description: response.message || "Template deleted successfully",
            })

            await fetchTemplates()
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to delete template"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
            throw err
        } finally {
            setLoading(false)
        }
    }

    const toggleTemplateStatus = async (id: string) => {
        try {
            const response = await templateService.toggleTemplateStatus(id)

            toast({
                title: "Success",
                description: response.message || "Template status updated",
            })

            await fetchTemplates()
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to update template status"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    const duplicateTemplate = async (id: string) => {
        try {
            setLoading(true)
            const response = await templateService.duplicateTemplate(id)

            toast({
                title: "Success",
                description: response.message || "Template duplicated successfully",
            })

            await fetchTemplates()
            return response.data
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to duplicate template"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateFilters = (newFilters: Partial<TemplateFilters>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)
        fetchTemplates(updatedFilters)
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    return {
        templates,
        pagination,
        loading,
        error,
        filters,
        fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        toggleTemplateStatus,
        duplicateTemplate,
        updateFilters,
        refetch: () => fetchTemplates(),
    }
}

export function useTemplateAnalytics() {
    const [analytics, setAnalytics] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchAnalytics = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await templateService.getTemplateAnalytics()
            setAnalytics(response.data)
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to fetch analytics"
            setError(errorMessage)
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [])

    return {
        analytics,
        loading,
        error,
        refetch: fetchAnalytics,
    }
}
