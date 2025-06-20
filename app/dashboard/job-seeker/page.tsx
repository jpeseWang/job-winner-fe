"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import JobSeekerDashboardHeader from "@/components/dashboard/job-seeker/dashboard-header"
import {
    Briefcase,
    FileText,
    Eye,
    TrendingUp,
    Calendar,
    MapPin,
    Clock,
    Star,
    Plus,
    ArrowRight,
    AlertCircle,
    Users,
} from "lucide-react"

// Mock data - replace with real API calls
const mockStats = {
    totalApplications: 12,
    pendingApplications: 8,
    interviewsScheduled: 2,
    profileViews: 45,
    savedJobs: 6,
    cvDownloads: 23,
}

const mockRecentApplications = [
    {
        id: "1",
        jobTitle: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        appliedDate: "2024-01-15",
        status: "pending",
        salary: "$80,000 - $100,000",
        location: "San Francisco, CA",
    },
    {
        id: "2",
        jobTitle: "React Developer",
        company: "StartupXYZ",
        appliedDate: "2024-01-12",
        status: "interview",
        salary: "$70,000 - $90,000",
        location: "Remote",
    },
    {
        id: "3",
        jobTitle: "Full Stack Engineer",
        company: "Innovation Labs",
        appliedDate: "2024-01-10",
        status: "rejected",
        salary: "$85,000 - $110,000",
        location: "New York, NY",
    },
]

const mockRecommendedJobs = [
    {
        id: "1",
        title: "Senior React Developer",
        company: "Google",
        location: "Mountain View, CA",
        salary: "$120,000 - $150,000",
        type: "Full-time",
        posted: "2 days ago",
        match: 95,
    },
    {
        id: "2",
        title: "Frontend Engineer",
        company: "Meta",
        location: "Menlo Park, CA",
        salary: "$110,000 - $140,000",
        type: "Full-time",
        posted: "1 day ago",
        match: 88,
    },
    {
        id: "3",
        title: "JavaScript Developer",
        company: "Netflix",
        location: "Los Gatos, CA",
        salary: "$100,000 - $130,000",
        type: "Full-time",
        posted: "3 days ago",
        match: 82,
    },
]

const mockUpcomingInterviews = [
    {
        id: "1",
        jobTitle: "React Developer",
        company: "StartupXYZ",
        date: "2024-01-20",
        time: "2:00 PM",
        type: "Video Call",
    },
    {
        id: "2",
        jobTitle: "Frontend Engineer",
        company: "TechFlow",
        date: "2024-01-22",
        time: "10:00 AM",
        type: "In-person",
    },
]

export default function JobSeekerDashboard() {
    const { data: session } = useSession()
    const [profileCompletion, setProfileCompletion] = useState(75)

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                    </Badge>
                )
            case "interview":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Interview
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Rejected
                    </Badge>
                )
            case "accepted":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Accepted
                    </Badge>
                )
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <JobSeekerDashboardHeader /> */}

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {session?.user?.name?.split(" ")[0] || "there"}! 👋
                    </h1>
                    <p className="text-gray-600">Here's what's happening with your job search today.</p>
                </div>

                {/* Profile Completion Alert */}
                {profileCompletion < 100 && (
                    <Card className="mb-8 border-orange-200 bg-orange-50">
                        <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                                <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-orange-900 mb-2">Complete Your Profile</h3>
                                    <p className="text-orange-700 mb-4">
                                        Your profile is {profileCompletion}% complete. Complete it to get better job recommendations.
                                    </p>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <Progress value={profileCompletion} className="flex-1" />
                                        <span className="text-sm font-medium text-orange-700">{profileCompletion}%</span>
                                    </div>
                                    <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                                        <Link href="/dashboard/job-seeker/my-profile">Complete Profile</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalApplications}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Briefcase className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                                    <p className="text-3xl font-bold text-gray-900">{mockStats.pendingApplications}</p>
                                </div>
                                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Interviews</p>
                                    <p className="text-3xl font-bold text-gray-900">{mockStats.interviewsScheduled}</p>
                                </div>
                                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Profile Views</p>
                                    <p className="text-3xl font-bold text-gray-900">{mockStats.profileViews}</p>
                                </div>
                                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Eye className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Applications */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Applications</CardTitle>
                                    <CardDescription>Your latest job applications and their status</CardDescription>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/dashboard/job-seeker/proposals">
                                        View All <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockRecentApplications.map((application) => (
                                        <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{application.jobTitle}</h4>
                                                <p className="text-sm text-gray-600">{application.company}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {application.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {formatDate(application.appliedDate)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(application.status)}
                                                <p className="text-sm font-medium text-gray-900 mt-1">{application.salary}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommended Jobs */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recommended Jobs</CardTitle>
                                    <CardDescription>Jobs that match your profile and preferences</CardDescription>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/jobs">
                                        Browse All <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockRecommendedJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        {job.match}% match
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600">{job.company}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {job.posted}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">{job.salary}</p>
                                                <Button asChild size="sm" className="mt-2">
                                                    <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Upcoming Interviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Upcoming Interviews
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mockUpcomingInterviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {mockUpcomingInterviews.map((interview) => (
                                            <div key={interview.id} className="p-4 border rounded-lg">
                                                <h4 className="font-semibold text-gray-900">{interview.jobTitle}</h4>
                                                <p className="text-sm text-gray-600">{interview.company}</p>
                                                <div className="mt-2 space-y-1 text-sm text-gray-500">
                                                    <p className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {formatDate(interview.date)}
                                                    </p>
                                                    <p className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {interview.time}
                                                    </p>
                                                    <Badge variant="outline" className="mt-2">
                                                        {interview.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No upcoming interviews</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full justify-start" variant="outline">
                                    <Link href="/generate-cv">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Create New CV
                                    </Link>
                                </Button>
                                <Button asChild className="w-full justify-start" variant="outline">
                                    <Link href="/jobs">
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        Search Jobs
                                    </Link>
                                </Button>
                                <Button asChild className="w-full justify-start" variant="outline">
                                    <Link href="/dashboard/job-seeker/my-profile">
                                        <Star className="mr-2 h-4 w-4" />
                                        Update Profile
                                    </Link>
                                </Button>
                                <Button asChild className="w-full justify-start" variant="outline">
                                    <Link href="/cv-marketplace">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Browse CV Templates
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Profile Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Profile Views</span>
                                    <span className="font-semibold">{mockStats.profileViews}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">CV Downloads</span>
                                    <span className="font-semibold">{mockStats.cvDownloads}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Saved Jobs</span>
                                    <span className="font-semibold">{mockStats.savedJobs}</span>
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="flex items-center text-sm text-green-600">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        <span>+12% from last week</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
