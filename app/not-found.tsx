"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Home, ArrowLeft, Users, Briefcase } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8 text-center">
                {/* 404 Animation */}
                <div className="relative">
                    <h1 className="text-9xl font-bold text-blue-600/20 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-full p-6 shadow-lg">
                            <Search className="h-16 w-16 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
                        wrong URL.
                    </p>
                </div>

                {/* Search Bar */}
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-lg">Search for what you need</CardTitle>
                        <CardDescription>Try searching for jobs, companies, or resources</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input placeholder="Search jobs, companies..." className="flex-1" />
                            <Button>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <Link href="/">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <h3 className="font-semibold">Home</h3>
                                <p className="text-sm text-gray-600">Back to homepage</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/jobs">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <h3 className="font-semibold">Browse Jobs</h3>
                                <p className="text-sm text-gray-600">Find your next opportunity</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/about-us">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <h3 className="font-semibold">About Us</h3>
                                <p className="text-sm text-gray-600">Learn more about us</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => window.history.back()} variant="outline" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                    <Link href="/">
                        <Button className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-sm text-gray-500">
                    Still can't find what you're looking for?{" "}
                    <Link href="/help" className="text-blue-600 hover:underline">
                        Contact our support team
                    </Link>
                </p>
            </div>
        </div>
    )
}
