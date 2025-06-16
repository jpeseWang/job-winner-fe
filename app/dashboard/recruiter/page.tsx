"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Briefcase, Users, Eye } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApplicationsTab from "@/components/dashboard/recruiter/applications-tab"
import CandidatesTab from "@/components/dashboard/recruiter/candidates-tab"
import AnalyticsTab from "@/components/dashboard/recruiter/analytics-tab"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  status: string
  experienceLevel: string
  createdAt: string
  views: number
  applications: number
}

export default function RecruiterDashboard() {
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs")
        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }
        const result = await response.json()
        setJobs(result.jobs)
        
        // Calculate stats
        setStats({
          totalJobs: result.jobs.length,
          activeJobs: result.jobs.filter((job: Job) => job.status === "active").length,
          totalApplications: result.jobs.reduce((sum: number, job: Job) => sum + job.applications, 0)
        })
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
  }, [toast])

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/recruiter/jobs/new">Post New Job</Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeJobs} active jobs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Across all job postings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Job Postings</CardTitle>
              <CardDescription>
                Your most recent job listings and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No jobs posted yet. Create your first job posting!
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{job.title}</h3>
                          <Badge variant={job.status === "active" ? "default" : "secondary"}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job.company} • {job.location} • {job.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{job.views} views</p>
                          <p className="text-xs text-muted-foreground">
                            {job.applications} applications
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/recruiter/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {jobs.length > 5 && (
                    <div className="text-center">
                      <Button variant="link" asChild>
                        <Link href="/dashboard/recruiter/jobs">View All Jobs</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                View and manage job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Applications content will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <CandidatesTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </main>
  )
}
