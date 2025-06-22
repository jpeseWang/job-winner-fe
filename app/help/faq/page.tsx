"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronUp, HelpCircle, Users, Briefcase, CreditCard, Settings } from "lucide-react"
import Link from "next/link"

interface FAQItem {
    id: string
    question: string
    answer: string
    category: string
    tags: string[]
    helpful: number
}

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const categories = [
        { id: "all", name: "All Categories", icon: HelpCircle, count: 24 },
        { id: "general", name: "General", icon: HelpCircle, count: 8 },
        { id: "jobs", name: "Jobs & Applications", icon: Briefcase, count: 6 },
        { id: "account", name: "Account & Profile", icon: Users, count: 5 },
        { id: "billing", name: "Billing & Payments", icon: CreditCard, count: 3 },
        { id: "technical", name: "Technical Issues", icon: Settings, count: 2 },
    ]

    const faqItems: FAQItem[] = [
        {
            id: "1",
            question: "How do I create an account?",
            answer:
                "To create an account, click the 'Sign Up' button in the top right corner of the homepage. You can register using your email address or sign up with Google. Choose whether you're a job seeker or recruiter, fill in your basic information, and verify your email address to complete the process.",
            category: "general",
            tags: ["account", "registration", "signup"],
            helpful: 45,
        },
        {
            id: "2",
            question: "How do I apply for a job?",
            answer:
                "To apply for a job, first find the job listing you're interested in. Click on the job title to view the full details, then click the 'Apply Now' button. You'll be guided through our application process where you can upload your resume, write a cover letter, and provide additional information requested by the employer.",
            category: "jobs",
            tags: ["apply", "jobs", "application"],
            helpful: 38,
        },
        {
            id: "3",
            question: "Can I edit my profile after creating it?",
            answer:
                "Yes, you can edit your profile at any time. Go to your dashboard and click on 'My Profile' or 'Profile Settings'. You can update your personal information, work experience, skills, education, and profile picture. Remember to save your changes before leaving the page.",
            category: "account",
            tags: ["profile", "edit", "update"],
            helpful: 32,
        },
        {
            id: "4",
            question: "What payment methods do you accept?",
            answer:
                "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for premium subscriptions. All payments are processed securely through our encrypted payment system. You can manage your payment methods in your account settings.",
            category: "billing",
            tags: ["payment", "billing", "subscription"],
            helpful: 28,
        },
        {
            id: "5",
            question: "How do I post a job as a recruiter?",
            answer:
                "As a recruiter, go to your dashboard and click 'Post New Job'. Fill in the job details including title, description, requirements, salary range, and location. You can preview your job posting before publishing. Once published, your job will be visible to job seekers and you'll start receiving applications.",
            category: "jobs",
            tags: ["recruiter", "post job", "hiring"],
            helpful: 41,
        },
        {
            id: "6",
            question: "Why can't I log into my account?",
            answer:
                "If you're having trouble logging in, first check that you're using the correct email and password. Try resetting your password using the 'Forgot Password' link. Clear your browser cache and cookies, or try using a different browser. If the problem persists, contact our support team.",
            category: "technical",
            tags: ["login", "password", "technical"],
            helpful: 25,
        },
    ]

    const filteredFAQs = faqItems.filter((item) => {
        const matchesSearch =
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const toggleExpanded = (id: string) => {
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="bg-white rounded-full p-6 shadow-lg mx-auto w-fit mb-6">
                        <HelpCircle className="h-16 w-16 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find quick answers to the most common questions about our platform.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search FAQs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory(category.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <category.icon className="h-4 w-4" />
                                            {category.name}
                                            <Badge variant="secondary" className="ml-1">
                                                {category.count}
                                            </Badge>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4 mb-12">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((item) => (
                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="cursor-pointer" onClick={() => toggleExpanded(item.id)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg text-left">{item.question}</CardTitle>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline">{item.category}</Badge>
                                                {item.tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        {expandedItems.includes(item.id) ? (
                                            <ChevronUp className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </CardHeader>
                                {expandedItems.includes(item.id) && (
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">{item.answer}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-500">Was this helpful?</span>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        👍 Yes
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        👎 No
                                                    </Button>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">{item.helpful} people found this helpful</span>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No FAQs found</h3>
                                <p className="text-gray-500 mb-4">Try adjusting your search terms or browse different categories.</p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm("")
                                        setSelectedCategory("all")
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Contact Support */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Still need help?</CardTitle>
                        <CardDescription className="text-blue-700">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/help">
                                <Button className="flex-1">Contact Support</Button>
                            </Link>
                            <Button variant="outline" className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100">
                                Submit a Question
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
