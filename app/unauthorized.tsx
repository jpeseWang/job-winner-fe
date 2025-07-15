"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, LogIn, UserPlus, ArrowLeft, AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8 text-center">
                {/* Unauthorized Icon */}
                <div className="relative">
                    <div className="bg-white rounded-full p-8 shadow-lg mx-auto w-fit">
                        <Shield className="h-20 w-20 text-red-600" />
                        <div className="absolute -top-2 -right-2 bg-red-100 rounded-full p-2">
                            <Lock className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        You don't have permission to access this page. Please log in with the appropriate account or contact support
                        if you believe this is an error.
                    </p>
                </div>

                {/* Access Requirements */}
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-5 w-5" />
                            Access Requirements
                        </CardTitle>
                        <CardDescription>This page requires special permissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span>Valid user account</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <span>Appropriate user role</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            <span>Active session</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Link href="/auth/login">
                        <Button className="w-full flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button variant="outline" className="w-full flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Create Account
                        </Button>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => window.history.back()} variant="ghost" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                    <Link href="/">
                        <Button variant="ghost">Return to Homepage</Button>
                    </Link>
                </div>

                {/* Help Section */}
                <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                        <p className="text-sm text-blue-700 mb-3">
                            If you believe you should have access to this page, please contact our support team.
                        </p>
                        <Link href="/help">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                Contact Support
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
