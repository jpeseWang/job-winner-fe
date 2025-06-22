import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Lock, Users, Mail, FileText, Calendar } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
    const lastUpdated = "January 15, 2024"

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="bg-white rounded-full p-6 shadow-lg mx-auto w-fit mb-6">
                        <Shield className="h-16 w-16 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We take your privacy seriously. This policy explains how we collect, use, and protect your personal
                        information.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Last updated: {lastUpdated}</span>
                    </div>
                </div>

                {/* Quick Overview */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            Quick Overview
                        </CardTitle>
                        <CardDescription>Key points about how we handle your data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <h3 className="font-semibold mb-1">Secure Storage</h3>
                                <p className="text-sm text-gray-600">Your data is encrypted and securely stored</p>
                            </div>
                            <div className="text-center">
                                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <h3 className="font-semibold mb-1">No Selling</h3>
                                <p className="text-sm text-gray-600">We never sell your personal information</p>
                            </div>
                            <div className="text-center">
                                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <h3 className="font-semibold mb-1">Your Control</h3>
                                <p className="text-sm text-gray-600">You control your data and privacy settings</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Information We Collect</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Personal Information</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Name, email address, and contact information</li>
                                    <li>Professional information (resume, work experience, skills)</li>
                                    <li>Account credentials and profile information</li>
                                    <li>Payment information for premium services</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Usage Information</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>How you interact with our platform</li>
                                    <li>Job search preferences and application history</li>
                                    <li>Device information and IP address</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. How We Use Your Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                    <div>
                                        <strong>Service Provision:</strong> To provide and improve our job marketplace services
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                    <div>
                                        <strong>Matching:</strong> To match job seekers with relevant opportunities
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                                    <div>
                                        <strong>Communication:</strong> To send important updates and notifications
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                                    <div>
                                        <strong>Analytics:</strong> To analyze usage patterns and improve our platform
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Information Sharing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">With Employers</h4>
                                <p className="text-gray-600">
                                    When you apply for jobs, we share your application materials with the relevant employers. You control
                                    what information is included in your applications.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Service Providers</h4>
                                <p className="text-gray-600">
                                    We work with trusted third-party service providers who help us operate our platform. These providers
                                    are bound by strict confidentiality agreements.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                                <p className="text-gray-600">
                                    We may disclose information when required by law or to protect our rights and the safety of our users.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>4. Data Security</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        <li>End-to-end encryption</li>
                                        <li>Secure data centers</li>
                                        <li>Regular security audits</li>
                                        <li>Access controls and monitoring</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Organizational Measures</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        <li>Employee training programs</li>
                                        <li>Data minimization practices</li>
                                        <li>Incident response procedures</li>
                                        <li>Privacy by design principles</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>5. Your Rights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold">Access & Portability</h4>
                                        <p className="text-sm text-gray-600">Request a copy of your personal data</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Correction</h4>
                                        <p className="text-sm text-gray-600">Update or correct your information</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Deletion</h4>
                                        <p className="text-sm text-gray-600">Request deletion of your account and data</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold">Restriction</h4>
                                        <p className="text-sm text-gray-600">Limit how we process your data</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Objection</h4>
                                        <p className="text-sm text-gray-600">Object to certain data processing</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Withdraw Consent</h4>
                                        <p className="text-sm text-gray-600">Withdraw consent for data processing</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>6. Cookies and Tracking</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">
                                We use cookies and similar technologies to enhance your experience on our platform. You can control
                                cookie settings through your browser preferences.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-1">Essential Cookies</h4>
                                    <p className="text-sm text-gray-600">Required for basic functionality</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Analytics Cookies</h4>
                                    <p className="text-sm text-gray-600">Help us improve our services</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Marketing Cookies</h4>
                                    <p className="text-sm text-gray-600">Personalize your experience</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>7. Contact Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Privacy Officer</h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            <span>privacy@jobwinner.com</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>Data Protection Request Form</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Response Time</h4>
                                    <p className="text-sm text-gray-600">
                                        We aim to respond to all privacy-related inquiries within 30 days.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 text-center space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/help">
                            <Button variant="outline">Contact Support</Button>
                        </Link>
                        <Link href="/terms-of-service">
                            <Button variant="outline">Terms of Service</Button>
                        </Link>
                        <Link href="/">
                            <Button>Back to Home</Button>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                        This policy is effective as of {lastUpdated} and may be updated from time to time.
                    </p>
                </div>
            </div>
        </div>
    )
}
