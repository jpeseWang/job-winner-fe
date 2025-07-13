"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Phone, Video, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ContactSupportProps {
    defaultSubject?: string
    defaultCategory?: string
}

export function ContactSupport({ defaultSubject = "", defaultCategory = "" }: ContactSupportProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: defaultSubject,
        category: defaultCategory,
        priority: "medium",
        message: "",
        attachments: [] as File[],
    })

    const categories = [
        { value: "general", label: "General Question" },
        { value: "technical", label: "Technical Issue" },
        { value: "billing", label: "Billing & Payments" },
        { value: "account", label: "Account & Profile" },
        { value: "jobs", label: "Jobs & Applications" },
        { value: "feature", label: "Feature Request" },
        { value: "bug", label: "Bug Report" },
    ]

    const priorities = [
        { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
        { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
        { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
        { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
    ]

    const contactMethods = [
        {
            type: "chat",
            title: "Live Chat",
            description: "Get instant help",
            icon: MessageCircle,
            availability: "24/7",
            responseTime: "< 5 minutes",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            type: "email",
            title: "Email Support",
            description: "Detailed assistance",
            icon: Mail,
            availability: "24/7",
            responseTime: "< 24 hours",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            type: "phone",
            title: "Phone Support",
            description: "Speak with an agent",
            icon: Phone,
            availability: "Mon-Fri 9AM-6PM",
            responseTime: "Immediate",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            type: "video",
            title: "Video Call",
            description: "Screen sharing session",
            icon: Video,
            availability: "By appointment",
            responseTime: "Same day",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ]

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }))
    }

    const removeAttachment = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            toast({
                title: "Support ticket created",
                description: "We'll get back to you within 24 hours.",
            })

            // Reset form
            setFormData({
                name: "",
                email: "",
                subject: "",
                category: "",
                priority: "medium",
                message: "",
                attachments: [],
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit support request. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Contact Methods */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Choose Your Preferred Contact Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {contactMethods.map((method) => (
                        <Card key={method.type} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                                <div className={`w-12 h-12 rounded-lg ${method.bgColor} flex items-center justify-center mb-3`}>
                                    <method.icon className={`h-6 w-6 ${method.color}`} />
                                </div>
                                <h4 className="font-semibold mb-1">{method.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                                <div className="space-y-1 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {method.availability}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        {method.responseTime}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Support Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Submit a Support Request</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => handleInputChange("subject", e.target.value)}
                                placeholder="Brief description of your issue"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map((priority) => (
                                            <SelectItem key={priority.value} value={priority.value}>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={priority.color}>{priority.label}</Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => handleInputChange("message", e.target.value)}
                                placeholder="Please provide as much detail as possible about your issue..."
                                rows={6}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attachments">Attachments (Optional)</Label>
                            <Input
                                id="attachments"
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            />
                            {formData.attachments.length > 0 && (
                                <div className="space-y-2">
                                    {formData.attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm">{file.name}</span>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Submitting..." : "Submit Support Request"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Additional Help */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Before contacting support</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Check our FAQ section for quick answers</li>
                                <li>• Try clearing your browser cache and cookies</li>
                                <li>• Make sure you're using the latest version of your browser</li>
                                <li>• Include screenshots or error messages when reporting issues</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
