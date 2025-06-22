import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Home, Briefcase, Users, FileText, Settings, HelpCircle, Calendar } from "lucide-react"
import Link from "next/link"

export default function SitemapPage() {
    const lastUpdated = "January 15, 2024"

    const siteStructure = [
        {
            category: "Main Pages",
            icon: Home,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            pages: [
                { title: "Homepage", url: "/", description: "Main landing page" },
                { title: "About Us", url: "/about-us", description: "Learn about our company" },
                { title: "Contact Us", url: "/contact-us", description: "Get in touch with us" },
                { title: "Blog", url: "/blog", description: "Latest news and insights" },
            ],
        },
        {
            category: "Jobs & Applications",
            icon: Briefcase,
            color: "text-green-600",
            bgColor: "bg-green-50",
            pages: [
                { title: "Browse Jobs", url: "/jobs", description: "Search and filter job listings" },
                { title: "Job Details", url: "/jobs/[id]", description: "Individual job posting pages" },
                { title: "Apply for Job", url: "/jobs/[id]/apply", description: "Job application form" },
                {
                    title: "Application Success",
                    url: "/jobs/[id]/application-success",
                    description: "Application confirmation",
                },
            ],
        },
        {
            category: "CV & Templates",
            icon: FileText,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            pages: [
                { title: "Upload CV", url: "/upload-cv", description: "Upload and analyze your CV" },
                { title: "Generate CV", url: "/generate-cv", description: "Create a new CV with AI" },
                { title: "CV Marketplace", url: "/cv-marketplace", description: "Browse CV templates" },
                { title: "Template Details", url: "/cv-marketplace/template/[id]", description: "Individual template pages" },
            ],
        },
        {
            category: "Authentication",
            icon: Users,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            pages: [
                { title: "Login", url: "/auth/login", description: "User login page" },
                { title: "Register", url: "/auth/register", description: "User registration" },
                { title: "Forgot Password", url: "/auth/forgot-password", description: "Password reset request" },
                { title: "Reset Password", url: "/auth/reset-password", description: "Password reset form" },
                { title: "Verify Email", url: "/auth/verify-email", description: "Email verification" },
            ],
        },
        {
            category: "Job Seeker Dashboard",
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            pages: [
                { title: "Dashboard", url: "/dashboard/job-seeker", description: "Main dashboard overview" },
                { title: "My Profile", url: "/dashboard/job-seeker/my-profile", description: "Profile management" },
                { title: "CV Library", url: "/dashboard/job-seeker/cv-library", description: "Manage your CVs" },
                { title: "Proposals", url: "/dashboard/job-seeker/proposals", description: "Job proposals and applications" },
            ],
        },
        {
            category: "Recruiter Dashboard",
            icon: Briefcase,
            color: "text-teal-600",
            bgColor: "bg-teal-50",
            pages: [
                { title: "Dashboard", url: "/dashboard/recruiter", description: "Recruiter overview" },
                { title: "Post New Job", url: "/dashboard/recruiter/jobs/new", description: "Create job posting" },
                { title: "Manage Jobs", url: "/dashboard/recruiter/jobs", description: "Job management" },
                { title: "Applications", url: "/dashboard/recruiter/applications", description: "Review applications" },
            ],
        },
        {
            category: "Admin Dashboard",
            icon: Settings,
            color: "text-red-600",
            bgColor: "bg-red-50",
            pages: [
                { title: "Admin Dashboard", url: "/dashboard/admin", description: "Admin overview" },
                { title: "Manage Users", url: "/dashboard/admin/manage-users", description: "User management" },
                { title: "Manage Jobs", url: "/dashboard/admin/manage-jobs", description: "Job moderation" },
                { title: "Manage Templates", url: "/dashboard/admin/manage-templates", description: "Template management" },
                { title: "Templates", url: "/dashboard/admin/templates", description: "Template overview" },
                { title: "Add Template", url: "/dashboard/admin/templates/new", description: "Create new template" },
                { title: "Reports", url: "/dashboard/admin/reports", description: "Analytics and reports" },
                {
                    title: "Subscription Analytics",
                    url: "/dashboard/admin/subscription-analytics",
                    description: "Subscription metrics",
                },
            ],
        },
        {
            category: "Company Management",
            icon: Users,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
            pages: [
                { title: "Register Company", url: "/register-company", description: "Company registration form" },
                { title: "Company Profile", url: "/company/[id]", description: "Public company pages" },
            ],
        },
        {
            category: "Help & Support",
            icon: HelpCircle,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            pages: [
                { title: "Help Center", url: "/help", description: "Main help and support page" },
                { title: "FAQ", url: "/help/faq", description: "Frequently asked questions" },
                { title: "API Documentation", url: "/api-docs", description: "Developer documentation" },
            ],
        },
        {
            category: "Legal & Policies",
            icon: FileText,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
            pages: [
                { title: "Privacy Policy", url: "/privacy-policy", description: "Privacy and data protection" },
                { title: "Terms of Service", url: "/terms-of-service", description: "Terms and conditions" },
                { title: "Sitemap", url: "/sitemap", description: "This page - site structure" },
            ],
        },
        {
            category: "Error Pages",
            icon: HelpCircle,
            color: "text-pink-600",
            bgColor: "bg-pink-50",
            pages: [
                { title: "404 Not Found", url: "/404", description: "Page not found error" },
                { title: "Unauthorized", url: "/unauthorized", description: "Access denied page" },
                { title: "Maintenance", url: "/maintenance", description: "Maintenance mode page" },
                { title: "Coming Soon", url: "/coming-soon", description: "Feature announcement page" },
            ],
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="bg-white rounded-full p-6 shadow-lg mx-auto w-fit mb-6">
                        <Search className="h-16 w-16 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Map</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Complete overview of all pages and sections available on our job marketplace platform.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Last updated: {lastUpdated}</span>
                    </div>
                </div>

                {/* Search */}
                <Card className="mb-8 max-w-2xl mx-auto">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search pages..." className="pl-10" />
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {siteStructure.reduce((total, category) => total + category.pages.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Pages</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">{siteStructure.length}</div>
                            <div className="text-sm text-gray-600">Categories</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                            <div className="text-sm text-gray-600">User Types</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                            <div className="text-sm text-gray-600">API Endpoints</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Site Structure */}
                <div className="space-y-8">
                    {siteStructure.map((section, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                                        <section.icon className={`h-5 w-5 ${section.color}`} />
                                    </div>
                                    {section.category}
                                    <Badge variant="secondary">{section.pages.length} pages</Badge>
                                </CardTitle>
                                <CardDescription>
                                    {section.category === "Main Pages" && "Core pages that form the foundation of our platform"}
                                    {section.category === "Jobs & Applications" && "Everything related to job searching and applications"}
                                    {section.category === "CV & Templates" && "CV creation, management, and template marketplace"}
                                    {section.category === "Authentication" && "User login, registration, and account management"}
                                    {section.category === "Job Seeker Dashboard" && "Dashboard and tools for job seekers"}
                                    {section.category === "Recruiter Dashboard" && "Dashboard and tools for recruiters and employers"}
                                    {section.category === "Admin Dashboard" && "Administrative tools and management interfaces"}
                                    {section.category === "Company Management" && "Company registration and profile management"}
                                    {section.category === "Help & Support" && "Help documentation and support resources"}
                                    {section.category === "Legal & Policies" && "Legal documents and platform policies"}
                                    {section.category === "Error Pages" && "Error handling and status pages"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {section.pages.map((page, pageIndex) => (
                                        <div key={pageIndex} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-sm">{page.title}</h4>
                                                {page.url.includes("[id]") && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Dynamic
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 mb-2">{page.description}</p>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{page.url}</code>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-12 text-center space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/help">
                            <Button variant="outline">Help Center</Button>
                        </Link>
                        <Link href="/api-docs">
                            <Button variant="outline">API Documentation</Button>
                        </Link>
                        <Link href="/">
                            <Button>Back to Home</Button>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                        This sitemap provides a comprehensive overview of all available pages and features.
                    </p>
                </div>
            </div>
        </div>
    )
}
