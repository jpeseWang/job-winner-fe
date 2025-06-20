import { createSwaggerSpec } from "next-swagger-doc"

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "app/api",
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Job Marketplace API",
                version: "1.0.0",
                description: "A comprehensive job marketplace platform with AI-powered CV analysis and template management",
                contact: {
                    name: "Job Marketplace Team",
                    email: "support@jobmarketplace.com",
                },
                license: {
                    name: "MIT",
                    url: "https://opensource.org/licenses/MIT",
                },
            },
            servers: [
                {
                    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
                    description: "Development server",
                },
                {
                    url: "https://job-winnerr.vercel.app",
                    description: "JobWinner server",
                },
            ],
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                    SessionAuth: {
                        type: "apiKey",
                        in: "cookie",
                        name: "next-auth.session-token",
                    },
                },
                schemas: {
                    User: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "User ID" },
                            name: { type: "string", description: "Full name" },
                            email: { type: "string", format: "email", description: "Email address" },
                            role: {
                                type: "string",
                                enum: ["job_seeker", "recruiter", "admin"],
                                description: "User role",
                            },
                            isVerified: { type: "boolean", description: "Email verification status" },
                            isActive: { type: "boolean", description: "Account active status" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                    Job: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "Job ID" },
                            title: { type: "string", description: "Job title" },
                            company: { type: "string", description: "Company name" },
                            location: { type: "string", description: "Job location" },
                            type: {
                                type: "string",
                                enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
                                description: "Employment type",
                            },
                            category: { type: "string", description: "Job category" },
                            salary: { type: "string", description: "Salary range" },
                            description: { type: "string", description: "Job description" },
                            requirements: {
                                type: "array",
                                items: { type: "string" },
                                description: "Job requirements",
                            },
                            benefits: {
                                type: "array",
                                items: { type: "string" },
                                description: "Job benefits",
                            },
                            contactEmail: { type: "string", format: "email" },
                            applicationUrl: { type: "string", format: "uri" },
                            companyLogo: { type: "string", format: "uri" },
                            featured: { type: "boolean" },
                            postedDate: { type: "string", format: "date-time" },
                            postedDays: { type: "number" },
                        },
                    },
                    Application: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "Application ID" },
                            jobId: { type: "string", description: "Job ID" },
                            userId: { type: "string", description: "User ID" },
                            personalInfo: {
                                type: "object",
                                properties: {
                                    fullName: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    phone: { type: "string" },
                                    location: { type: "string" },
                                },
                            },
                            professionalBackground: {
                                type: "object",
                                properties: {
                                    experienceLevel: { type: "string" },
                                    currentPosition: { type: "string" },
                                    education: { type: "string" },
                                    skills: { type: "array", items: { type: "string" } },
                                },
                            },
                            applicationMaterials: {
                                type: "object",
                                properties: {
                                    resumeUrl: { type: "string", format: "uri" },
                                    coverLetter: { type: "string" },
                                    portfolioUrls: { type: "array", items: { type: "string" } },
                                },
                            },
                            status: {
                                type: "string",
                                enum: ["pending", "reviewing", "shortlisted", "rejected", "accepted"],
                            },
                            appliedAt: { type: "string", format: "date-time" },
                        },
                    },
                    CVTemplate: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "Template ID" },
                            name: { type: "string", description: "Template name" },
                            description: { type: "string", description: "Template description" },
                            category: { type: "string", description: "Template category" },
                            isPremium: { type: "boolean", description: "Premium template flag" },
                            price: { type: "number", description: "Template price" },
                            thumbnailUrl: { type: "string", format: "uri" },
                            previewUrl: { type: "string", format: "uri" },
                            htmlContent: { type: "string", description: "HTML template content" },
                            cssContent: { type: "string", description: "CSS template styles" },
                            tags: { type: "array", items: { type: "string" } },
                            features: { type: "array", items: { type: "string" } },
                            isActive: { type: "boolean" },
                            createdBy: { type: "string", description: "Creator user ID" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                    Error: {
                        type: "object",
                        properties: {
                            error: { type: "string", description: "Error message" },
                            code: { type: "string", description: "Error code" },
                            details: { type: "object", description: "Additional error details" },
                        },
                    },
                    PaginatedResponse: {
                        type: "object",
                        properties: {
                            data: { type: "array", items: {} },
                            total: { type: "number", description: "Total number of items" },
                            page: { type: "number", description: "Current page number" },
                            limit: { type: "number", description: "Items per page" },
                            totalPages: { type: "number", description: "Total number of pages" },
                        },
                    },
                },
            },
            tags: [
                {
                    name: "Authentication",
                    description: "User authentication and authorization endpoints",
                },
                {
                    name: "Jobs",
                    description: "Job management and search endpoints",
                },
                {
                    name: "Applications",
                    description: "Job application management endpoints",
                },
                {
                    name: "Users",
                    description: "User management endpoints",
                },
                {
                    name: "CV Templates",
                    description: "CV template management endpoints",
                },
                {
                    name: "Admin",
                    description: "Administrative endpoints",
                },
                {
                    name: "Upload",
                    description: "File upload endpoints",
                },
            ],
        },
    })
    return spec
}
