import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scale, AlertTriangle, Calendar } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
    const lastUpdated = "January 15, 2024"

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="bg-white rounded-full p-6 shadow-lg mx-auto w-fit mb-6">
                        <Scale className="h-16 w-16 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        These terms govern your use of our job marketplace platform. Please read them carefully.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Last updated: {lastUpdated}</span>
                    </div>
                </div>

                {/* Important Notice */}
                <Card className="mb-8 border-orange-200 bg-orange-50">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-orange-900 mb-2">Important Notice</h3>
                                <p className="text-orange-800 text-sm">
                                    By using our platform, you agree to these terms. If you don't agree with any part of these terms,
                                    please do not use our services.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Acceptance of Terms</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">
                                By accessing and using Job Winner ("the Platform"), you accept and agree to be bound by the terms and
                                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">What this means:</h4>
                                <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                                    <li>You must be at least 18 years old to use our platform</li>
                                    <li>You agree to follow all applicable laws and regulations</li>
                                    <li>You understand that these terms may change over time</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. User Accounts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Account Creation</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>You must provide accurate and complete information</li>
                                    <li>You are responsible for maintaining account security</li>
                                    <li>One person may not maintain multiple accounts</li>
                                    <li>You must notify us of any unauthorized use</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Account Types</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h5 className="font-semibold text-green-900">Job Seekers</h5>
                                        <p className="text-sm text-green-700">Search and apply for jobs</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h5 className="font-semibold text-blue-900">Recruiters</h5>
                                        <p className="text-sm text-blue-700">Post jobs and find candidates</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h5 className="font-semibold text-purple-900">Companies</h5>
                                        <p className="text-sm text-purple-700">Manage company presence</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Acceptable Use</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2 text-green-600">You May:</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Use the platform for legitimate job searching or recruiting</li>
                                    <li>Post accurate job listings and professional information</li>
                                    <li>Communicate professionally with other users</li>
                                    <li>Share your own content and experiences</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-red-600">You May Not:</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Post false, misleading, or discriminatory content</li>
                                    <li>Spam users or send unsolicited communications</li>
                                    <li>Attempt to hack or disrupt the platform</li>
                                    <li>Violate any applicable laws or regulations</li>
                                    <li>Infringe on intellectual property rights</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>4. Content and Intellectual Property</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Your Content</h4>
                                <p className="text-gray-600 mb-2">
                                    You retain ownership of content you post, but grant us a license to use it for platform operations.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>You're responsible for the accuracy of your content</li>
                                    <li>You must have rights to any content you upload</li>
                                    <li>We may remove content that violates our policies</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Our Content</h4>
                                <p className="text-gray-600">
                                    The platform design, features, and original content are owned by Job Winner and protected by copyright
                                    laws.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>5. Privacy and Data Protection</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">
                                Your privacy is important to us. Our data practices are governed by our Privacy Policy, which is
                                incorporated into these terms by reference.
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">Key Privacy Points:</h4>
                                <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                                    <li>We collect only necessary information to provide our services</li>
                                    <li>Your data is securely stored and encrypted</li>
                                    <li>You control your privacy settings and data sharing</li>
                                    <li>We never sell your personal information</li>
                                </ul>
                            </div>
                            <Link href="/privacy-policy">
                                <Button variant="outline" size="sm">
                                    Read Full Privacy Policy
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>6. Payment and Subscriptions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Premium Services</h4>
                                <p className="text-gray-600 mb-2">
                                    Some features require payment. All fees are clearly disclosed before purchase.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Payments are processed securely through trusted providers</li>
                                    <li>Subscriptions auto-renew unless cancelled</li>
                                    <li>Refunds are subject to our refund policy</li>
                                    <li>Price changes will be communicated in advance</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Cancellation</h4>
                                <p className="text-gray-600">
                                    You may cancel your subscription at any time through your account settings. Cancellation takes effect
                                    at the end of your current billing period.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>7. Disclaimers and Limitations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Service Availability</h4>
                                <p className="text-gray-600">
                                    We strive for 99.9% uptime but cannot guarantee uninterrupted service. Maintenance and updates may
                                    temporarily affect availability.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Third-Party Content</h4>
                                <p className="text-gray-600">
                                    Job listings and user-generated content are provided by third parties. We are not responsible for the
                                    accuracy or quality of such content.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Employment Outcomes</h4>
                                <p className="text-gray-600">
                                    While we facilitate connections between job seekers and employers, we cannot guarantee employment
                                    outcomes or hiring decisions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>8. Termination</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">By You</h4>
                                <p className="text-gray-600">
                                    You may terminate your account at any time by contacting support or using account settings.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">By Us</h4>
                                <p className="text-gray-600 mb-2">
                                    We may suspend or terminate accounts that violate these terms, including:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Posting false or misleading information</li>
                                    <li>Engaging in harassment or discrimination</li>
                                    <li>Attempting to circumvent platform security</li>
                                    <li>Violating applicable laws</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>9. Changes to Terms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">We may update these terms from time to time. When we do, we will:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                                <li>Notify you via email or platform notification</li>
                                <li>Post the updated terms on our website</li>
                                <li>Provide at least 30 days notice for material changes</li>
                                <li>Allow you to review changes before they take effect</li>
                            </ul>
                            <p className="text-gray-600">
                                Continued use of the platform after changes take effect constitutes acceptance of the new terms.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>10. Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">If you have questions about these terms, please contact us:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Legal Department</h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div>Email: legal@jobwinner.com</div>
                                        <div>Phone: +1 (555) 123-4567</div>
                                        <div>Address: 123 Business St, City, State 12345</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Response Time</h4>
                                    <p className="text-sm text-gray-600">
                                        We aim to respond to all legal inquiries within 5-7 business days.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 text-center space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/privacy-policy">
                            <Button variant="outline">Privacy Policy</Button>
                        </Link>
                        <Link href="/help">
                            <Button variant="outline">Contact Support</Button>
                        </Link>
                        <Link href="/">
                            <Button>Back to Home</Button>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                        These terms are effective as of {lastUpdated} and supersede all previous versions.
                    </p>
                </div>
            </div>
        </div>
    )
}
