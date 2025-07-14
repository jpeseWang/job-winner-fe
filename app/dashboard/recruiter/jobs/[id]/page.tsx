"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Edit, Trash2, Eye, Users, Calendar, MapPin, Briefcase, GraduationCap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Job {
  _id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  description: string
  requirements: string[]
  benefits: string[]
  responsibilities: string[]
  skills: string[]
  salary: {
    min?: number
    max?: number
    currency: string
    period: string
  }
  experienceLevel: string
  contactEmail: string
  applicationUrl?: string
  status: string
  isFeatured: boolean
  views: number
  applications: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch job")
        }
        const data = await response.json()
        setJob(data)
      } catch (error) {
        console.error("Error fetching job:", error)
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [params.id, toast])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete job")
      }

      toast({
        title: "Success",
        description: "Job deleted successfully",
      })
      router.push("/dashboard/recruiter")
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Job not found</p>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-xl text-gray-600">{job.company}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/recruiter/jobs/${job._id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the job posting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { icon: <MapPin className="w-6 h-6 text-blue-500" />, label: "Location", value: job.location },
          { icon: <Briefcase className="w-6 h-6 text-green-500" />, label: "Type", value: job.type },
          { icon: <GraduationCap className="w-6 h-6 text-purple-500" />, label: "Experience", value: job.experienceLevel },
          { icon: <Calendar className="w-6 h-6 text-gray-500" />, label: "Posted", value: format(new Date(job.createdAt), "MMM d, yyyy") },
          { icon: <Calendar className="w-6 h-6 text-red-500" />, label: "Expires", value: job.expiresAt ? format(new Date(job.expiresAt), "MMM d, yyyy") : "No expiry set" }
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="mb-2">{item.icon}</div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-lg font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Eye className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold">{job.views}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-2xl font-bold">{job.applications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 