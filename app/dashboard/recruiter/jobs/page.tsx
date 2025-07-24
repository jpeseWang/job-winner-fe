"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"

interface Job {
  _id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  status: string
  experienceLevel: string
  createdAt: string
  views: number
  applications: number
}

export default function JobsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!user?.id) return
        const response = await fetch(`/api/jobs?recruiterId=${user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }
        const result = await response.json()
        setJobs(result.data || [])
      } catch (error) {
        console.error("Error fetching jobs:", error)
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [toast, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Postings</h1>
        <Button onClick={() => router.push("/dashboard/recruiter/jobs/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">No jobs posted yet</p>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/recruiter/jobs/${job._id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{job.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{job.experienceLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge variant={job.status === "active" ? "default" : "secondary"}>
                      {job.status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-500">
                  <div>
                    <p>Posted</p>
                    <p className="font-medium">{format(new Date(job.createdAt), "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p>Views</p>
                    <p className="font-medium">{job.views}</p>
                  </div>
                  <div>
                    <p>Applications</p>
                    <p className="font-medium">{job.applications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
} 