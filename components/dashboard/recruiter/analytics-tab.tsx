"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Briefcase, FileText, Eye } from "lucide-react"

export default function RecruiterAnalyticsTab() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics/recruiter")
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const json = await res.json()
        console.log("📊 Full analytics data:", json)
        setData(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return <div>Loading analytics...</div>
  if (error || !data) return <div>Error loading analytics: {error}</div>

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  // Use applicationTimeline array directly
  const applicationTimeline = (data.applicationTimeline || []).map(
    (item: { month: string; count: number }) => ({
      name: item.month,
      applications: item.count,
    })
  )

  // Fix key from jobPerformance to topJobPerformance
  const jobPerformanceData = (data.topJobPerformance || []).map((job: any) => ({
    name: job.title,
    views: job.views,
    applications: job.applications,
  }))

  const applicationStatusPie = Object.entries(data.applicationStatusBreakdown || {}).map(
    ([status, value]) => ({ name: status, value })
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Jobs</p>
                <h3 className="text-2xl font-bold">{data.totalJobs}</h3>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <FileText className="text-teal-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <h3 className="text-2xl font-bold">{data.totalApplications}</h3>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <FileText className="text-teal-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Jobs</p>
                <h3 className="text-2xl font-bold">{data.activeJobs}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Briefcase className="text-purple-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Candidates Hired</p>
                <h3 className="text-2xl font-bold">{data.candidatesHired}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="text-green-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <h3 className="text-2xl font-bold">{data.totalViews}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Eye className="text-blue-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>Timeline of candidate applications</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {applicationTimeline.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={applicationTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#14b8a6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No application data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {applicationStatusPie.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={applicationStatusPie} dataKey="value" label>
                    {applicationStatusPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No status data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Performance</CardTitle>
          <CardDescription>Views vs. Applications</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          {jobPerformanceData.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={jobPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="applications" fill="#14b8a6" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No job performance data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}