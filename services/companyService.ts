import axiosInstance from "@/lib/axios"

export interface Company {
    _id: string
    name: string
    owner: string
    logo?: string
    website?: string
    description: string
    industry: string
    size: string
    founded?: number
    headquarters: string
    specialties: string[]
    socialLinks: {
        linkedin?: string
        twitter?: string
        facebook?: string
        instagram?: string
    }
    isVerified: boolean
    employees: string[]
    createdAt: string
    updatedAt: string
}

export const companyService = {
    // Get current user's company
    async getMyCompany(): Promise<Company> {
        const response = await axiosInstance.get("/companies/my-company")
        return response.data
    },

    // Create new company
    async createCompany(companyData: Partial<Company>): Promise<Company> {
        const response = await axiosInstance.post("/companies", companyData)
        return response.data
    },

    // Update company
    async updateCompany(id: string, companyData: Partial<Company>): Promise<Company> {
        const response = await axiosInstance.put(`/companies/${id}`, companyData)
        return response.data
    },

    // Get company by ID
    async getCompanyById(id: string): Promise<Company> {
        const response = await axiosInstance.get(`/my-company?userId=${id}`)
        return response.data
    },

    // Search companies
    async searchCompanies(query: string): Promise<Company[]> {
        const response = await axiosInstance.get(`/companies/search?q=${encodeURIComponent(query)}`)
        return response.data
    },
}
