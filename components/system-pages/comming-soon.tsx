"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Rocket, Mail, Calendar, Star, Users, Briefcase, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ComingSoonPage() {
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)

    // This would typically come from your backend
    const featureInfo = {
        title: "Advanced Job Matching",
        description: "AI-powered job recommendations tailored to your skills and preferences",
        progress: 75,
        launchDate: "March 2024",
        features: ["Smart job recommendations", "Skill-based matching", "Salary predictions", "Career path suggestions"],
        subscribers: 1247,
    }

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        // Handle email subscription
        setIsSubscribed(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8 text-center">
                {/* Coming Soon Icon */}
                <div className="relative">
                    <div className="bg-white rounded-full p-8 shadow-lg mx-auto w-fit">
                        <Rocket className="h-20 w-20 text-purple-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                        <Star className="h-6 w-6 text-white" />
                    </div>
                </div>

                {/* Main Message */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">{featureInfo.title}</h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">{featureInfo.description}</p>
                </div>

                {/* Launch Info */}
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            Expected Launch
                        </CardTitle>
                        <CardDescription>We're working hard to bring this to you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-2xl font-bold text-purple-600">{featureInfo.launchDate}</div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Development Progress</span>
                                <span>{featureInfo.progress}%</span>
                            </div>
                            <Progress value={featureInfo.progress} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Features Preview */}
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>What's Coming</CardTitle>
                        <CardDescription>Exciting features we're building for you</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-left">
                            {featureInfo.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Email Subscription */}
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-600" />
                            Get Notified
                        </CardTitle>
                        <CardDescription>Be the first to know when we launch</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isSubscribed ? (
                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" className="w-full">
                                    Notify Me
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-3">
                                <div className="text-green-600 font-semibold">✓ You're subscribed!</div>
                                <p className="text-sm text-gray-600">We'll send you an email as soon as this feature is available.</p>
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>{featureInfo.subscribers.toLocaleString()} people waiting</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Current Features */}
                <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Available Now</CardTitle>
                        <CardDescription className="text-blue-700">Explore our current features while you wait</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/jobs">
                            <Button
                                variant="outline"
                                className="w-full justify-between border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                                <span className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    Browse Jobs
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/dashboard/job-seeker/generate-cv">
                            <Button
                                variant="outline"
                                className="w-full justify-between border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                                <span className="flex items-center gap-2">
                                    <Star className="h-4 w-4" />
                                    Create CV
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Social Sharing */}
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Excited about this feature? Share with your network!</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" size="sm">
                            Share on Twitter
                        </Button>
                        <Button variant="outline" size="sm">
                            Share on LinkedIn
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
