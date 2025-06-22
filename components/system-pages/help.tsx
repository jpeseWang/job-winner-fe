import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, Book, MessageCircle, Mail, Phone, Video, FileText } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
    const helpCategories = [
        {
            title: "Getting Started",
            description: "Learn the basics of using our platform",
            icon: Book,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            articles: ["Creating your account", "Setting up your profile", "Understanding user roles", "Platform overview"],
        },
        {
            title: "Job Searching",
            description: "Find and apply for your dream job",
            icon: Search,
            color: "text-green-600",
            bgColor: "bg-green-50",
            articles: ["How to search for jobs", "Using filters effectively", "Saving jobs for later", "Application process"],
        },
        {
            title: "For Recruiters",
            description: "Post jobs and find great candidates",
            icon: FileText,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            articles: ["Posting your first job", "Managing applications", "Company profile setup", "Premium features"],
        },
        {
            title: "Account & Billing",
            description: "Manage your account and subscriptions",
            icon: MessageCircle,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            articles: ["Account settings", "Subscription management", "Payment methods", "Billing issues"],
        },
    ]

    const contactOptions = [
        {
            title: "Live Chat",
            description: "Get instant help from our support team",
            icon: MessageCircle,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            availability: "24/7",
            action: "Start Chat",
        },
        {
            title: "Email Support",
            description: "Send us a detailed message",
            icon: Mail,
            color: "text-green-600",
            bgColor: "bg-green-50",
            availability: "Response within 24h",
            action: "Send Email",
        },
        {
            title: "Phone Support",
            description: "Speak directly with our team",
            icon: Phone,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            availability: "Mon-Fri 9AM-6PM",
            action: "Call Now",
        },
        {
            title: "Video Call",
            description: "Schedule a screen-sharing session",
            icon: Video,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            availability: "By appointment",
            action: "Schedule",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="bg-white rounded-full p-6 shadow-lg mx-auto w-fit mb-6">
                        <HelpCircle className="h-16 w-16 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find answers to your questions and get the support you need to make the most of our platform.
                    </p>
                </div>

                {/* Search Bar */}
                <Card className="mb-12 max-w-2xl mx-auto">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input placeholder="Search for help articles, guides, or FAQs..." className="pl-10" />
                            </div>
                            <Button>Search</Button>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
                            <div className="flex flex-wrap gap-2">
                                {["How to apply for jobs", "Reset password", "Upload resume", "Premium features"].map((term) => (
                                    <Button key={term} variant="outline" size="sm" className="text-xs">
                                        {term}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {helpCategories.map((category) => (
                            <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-4`}>
                                        <category.icon className={`h-6 w-6 ${category.color}`} />
                                    </div>
                                    <CardTitle className="text-lg">{category.title}</CardTitle>
                                    <CardDescription>{category.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {category.articles.map((article, index) => (
                                            <li key={index}>
                                                <Link href={`/help/articles/${article.toLowerCase().replace(/\s+/g, "-")}`}>
                                                    <Button variant="ghost" size="sm" className="w-full justify-start text-left p-0 h-auto">
                                                        {article}
                                                    </Button>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Link href="/help/faq">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="font-semibold mb-2">Frequently Asked Questions</h3>
                                    <p className="text-sm text-gray-600">Find quick answers to common questions</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/api-docs">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                    <h3 className="font-semibold mb-2">API Documentation</h3>
                                    <p className="text-sm text-gray-600">Technical documentation for developers</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/help/video-tutorials">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <Video className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                    <h3 className="font-semibold mb-2">Video Tutorials</h3>
                                    <p className="text-sm text-gray-600">Step-by-step video guides</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Support</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactOptions.map((option) => (
                            <Card key={option.title} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center mb-4`}>
                                        <option.icon className={`h-6 w-6 ${option.color}`} />
                                    </div>
                                    <CardTitle className="text-lg">{option.title}</CardTitle>
                                    <CardDescription>{option.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-600">
                                            <strong>Available:</strong> {option.availability}
                                        </div>
                                        <Button className="w-full">{option.action}</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Status and Updates */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            System Status
                        </CardTitle>
                        <CardDescription>All systems are operational</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">99.9%</div>
                                <div className="text-sm text-gray-600">Uptime</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">&lt;2s</div>
                                <div className="text-sm text-gray-600">Response Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">24/7</div>
                                <div className="text-sm text-gray-600">Support</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Can't find what you're looking for? Our support team is here to help!</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button>Contact Support</Button>
                        <Link href="/help/faq">
                            <Button variant="outline">Browse FAQ</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
