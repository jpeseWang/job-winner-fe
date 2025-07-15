"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Code, Download, ExternalLink, FileText, Globe, Key, Server, Shield, Zap } from "lucide-react"

// Dynamically import SwaggerUI to avoid SSR issues
// const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false })
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
    const [spec, setSpec] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/swagger")
            .then((res) => res.json())
            .then((data) => {
                setSpec(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Failed to load API spec:", err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading API documentation...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">API Documentation</h1>
                        <p className="text-muted-foreground">Comprehensive documentation for the Job Marketplace API</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        REST API
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        OAuth 2.0
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Server className="h-3 w-3" />
                        Next.js
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        OpenAPI 3.0
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="authentication">Authentication</TabsTrigger>
                    <TabsTrigger value="endpoints">API Reference</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code className="h-5 w-5" />
                                    Getting Started
                                </CardTitle>
                                <CardDescription>Quick start guide for integrating with our API</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Our REST API provides programmatic access to job listings, applications, user management, and CV
                                    templates.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Quick Start
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    Authentication
                                </CardTitle>
                                <CardDescription>Secure API access with OAuth 2.0 and session tokens</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    All API endpoints require authentication. We support both session-based and token-based
                                    authentication.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Auth Guide
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    OpenAPI Spec
                                </CardTitle>
                                <CardDescription>Download the complete OpenAPI specification</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get the full API specification in OpenAPI 3.0 format for code generation and testing.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Spec
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>API Features</CardTitle>
                            <CardDescription>Comprehensive functionality for job marketplace operations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Core Features</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Job listing management</li>
                                        <li>• Application processing</li>
                                        <li>• User authentication & profiles</li>
                                        <li>• CV template management</li>
                                        <li>• File upload & storage</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Advanced Features</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• AI-powered CV analysis</li>
                                        <li>• Real-time notifications</li>
                                        <li>• Analytics & reporting</li>
                                        <li>• Admin management tools</li>
                                        <li>• Payment processing</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="authentication" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Authentication Methods</CardTitle>
                            <CardDescription>Multiple authentication options for different use cases</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-2">Session Authentication</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Used for web applications. Automatically handled by NextAuth.js.
                                    </p>
                                    <div className="bg-muted p-3 rounded text-sm font-mono">
                                        Cookie: next-auth.session-token=eyJhbGciOiJIUzI1NiJ9...
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-2">Bearer Token</h4>
                                    <p className="text-sm text-muted-foreground mb-3">For API integrations and mobile applications.</p>
                                    <div className="bg-muted p-3 rounded text-sm font-mono">
                                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-2">OAuth 2.0 Providers</h4>
                                    <p className="text-sm text-muted-foreground mb-3">Supported OAuth providers for social login.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">Google</Badge>
                                        <Badge variant="outline">GitHub</Badge>
                                        <Badge variant="outline">LinkedIn</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="endpoints" className="space-y-6">
                    {spec && (
                        <div className="border rounded-lg overflow-hidden">
                            <SwaggerUI spec={spec} docExpansion="list" defaultModelsExpandDepth={2} defaultModelExpandDepth={2} />
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="examples" className="space-y-6">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Common API Examples</CardTitle>
                                <CardDescription>Practical examples for common API operations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Get Job Listings</h4>
                                        <div className="bg-muted p-4 rounded text-sm font-mono overflow-x-auto">
                                            <div className="text-green-600 mb-2">GET /api/jobs?category=technology&location=remote</div>
                                            <div className="text-gray-600">
                                                {`{
  "jobs": [...],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}`}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Submit Job Application</h4>
                                        <div className="bg-muted p-4 rounded text-sm font-mono overflow-x-auto">
                                            <div className="text-blue-600 mb-2">POST /api/applications</div>
                                            <div className="text-gray-600">
                                                {`{
  "jobId": "job-123",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "applicationMaterials": {
    "resumeUrl": "https://...",
    "coverLetter": "Dear Hiring Manager..."
  }
}`}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Upload File</h4>
                                        <div className="bg-muted p-4 rounded text-sm font-mono overflow-x-auto">
                                            <div className="text-purple-600 mb-2">POST /api/upload/image</div>
                                            <div className="text-gray-600">
                                                {`Content-Type: multipart/form-data

{
  "file": [File object],
  "folder": "resumes",
  "tags": ["resume", "user-123"]
}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
