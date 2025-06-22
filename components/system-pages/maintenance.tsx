import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wrench, Clock, CheckCircle, AlertCircle, Twitter, Facebook, Linkedin } from "lucide-react"
import Link from "next/link"

export default function MaintenancePage() {
    // This would typically come from your backend/config
    const maintenanceInfo = {
        title: "Scheduled Maintenance",
        description: "We're performing scheduled maintenance to improve your experience.",
        estimatedDuration: "2 hours",
        startTime: "2:00 AM UTC",
        endTime: "4:00 AM UTC",
        progress: 65,
        currentTask: "Database optimization",
        completedTasks: ["Server updates", "Security patches", "Performance improvements"],
        remainingTasks: ["Database optimization", "Cache refresh", "Final testing"],
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8 text-center">
                {/* Maintenance Icon */}
                <div className="relative">
                    <div className="bg-white rounded-full p-8 shadow-lg mx-auto w-fit">
                        <Wrench className="h-20 w-20 text-blue-600 animate-pulse" />
                    </div>
                </div>

                {/* Main Message */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">{maintenanceInfo.title}</h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">{maintenanceInfo.description}</p>
                </div>

                {/* Maintenance Details */}
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            Maintenance Window
                        </CardTitle>
                        <CardDescription>Estimated completion time</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">Start:</span>
                                <div>{maintenanceInfo.startTime}</div>
                            </div>
                            <div>
                                <span className="font-semibold">End:</span>
                                <div>{maintenanceInfo.endTime}</div>
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold text-sm">Duration:</span>
                            <div className="text-sm">{maintenanceInfo.estimatedDuration}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress */}
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Progress</CardTitle>
                        <CardDescription>Current maintenance status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Overall Progress</span>
                                <span>{maintenanceInfo.progress}%</span>
                            </div>
                            <Progress value={maintenanceInfo.progress} className="h-2" />
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold">Current Task:</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                {maintenanceInfo.currentTask}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Task Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {maintenanceInfo.completedTasks.map((task, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        {task}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                                <AlertCircle className="h-5 w-5" />
                                Remaining
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {maintenanceInfo.remainingTasks.map((task, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-orange-600" />
                                        {task}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Information */}
                <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Stay Updated</CardTitle>
                        <CardDescription className="text-blue-700">
                            Follow us for real-time updates on the maintenance progress
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Emergency Contact</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            For urgent issues during maintenance, please contact our emergency support.
                        </p>
                        <Link href="/help">
                            <Button variant="outline" size="sm">
                                Emergency Support
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-sm text-gray-500">Thank you for your patience. We'll be back online shortly!</p>
            </div>
        </div>
    )
}
