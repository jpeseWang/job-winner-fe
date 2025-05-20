"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Mock analytics data
const jobViewsData = [
  { name: "Jan", views: 400 },
  { name: "Feb", views: 300 },
  { name: "Mar", views: 500 },
  { name: "Apr", views: 280 },
  { name: "May", views: 590 },
  { name: "Jun", views: 320 },
  { name: "Jul", views: 350 },
]

const applicationsData = [
  { name: "Jan", applications: 65 },
  { name: "Feb", applications: 45 },
  { name: "Mar", applications: 90 },
  { name: "Apr", applications: 75 },
  { name: "May", applications: 110 },
  { name: "Jun", applications: 62 },
  { name: "Jul", applications: 85 },
]

const applicationSourcesData = [
  { name: "Direct", value: 45 },
  { name: "Job Boards", value: 30 },
  { name: "Social Media", value: 15 },
  { name: "Referrals", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const jobPerformanceData = [
  {
    name: "Forward Security Director",
    views: 1200,
    applications: 85,
    interviews: 12,
  },
  {
    name: "Regional Creative Facilitator",
    views: 950,
    applications: 62,
    interviews: 8,
  },
  {
    name: "Internal Integration Planner",
    views: 850,
    applications: 45,
    interviews: 6,
  },
  {
    name: "District Intranet Director",
    views: 780,
    applications: 38,
    interviews: 5,
  },
  {
    name: "Corporate Tactics Facilitator",
    views: 650,
    applications: 30,
    interviews: 4,
  },
]

export default function RecruiterAnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Job Views</p>
                <h3 className="text-2xl font-bold mt-1">24,521</h3>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <h3 className="text-2xl font-bold mt-1">532</h3>
                <p className="text-xs text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
                <p className="text-xs text-gray-500 mt-1">3 expiring soon</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Candidates Hired</p>
                <h3 className="text-2xl font-bold mt-1">18</h3>
                <p className="text-xs text-green-600 mt-1">+5 this month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Views</CardTitle>
            <CardDescription>Number of views your job listings received over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={jobViewsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#14b8a6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications Received</CardTitle>
            <CardDescription>Number of applications received over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Performance</CardTitle>
            <CardDescription>Comparison of views, applications, and interviews by job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={jobPerformanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="views" stackId="a" fill="#8884d8" name="Views" />
                  <Bar dataKey="applications" stackId="a" fill="#14b8a6" name="Applications" />
                  <Bar dataKey="interviews" stackId="a" fill="#ffc658" name="Interviews" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
            <CardDescription>Where your applications are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicationSourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {applicationSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Actionable insights to improve your recruitment process</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="applications">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="hires">Hires</TabsTrigger>
            </TabsList>
            <TabsContent value="applications" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Application Completion Rate</h4>
                <p className="text-sm text-gray-500">
                  Your application completion rate is 68%, which is 5% below industry average. Consider simplifying your
                  application process to improve completion rates.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Top Performing Job</h4>
                <p className="text-sm text-gray-500">
                  "Forward Security Director" has the highest application rate at 7.1%. Consider using similar job
                  descriptions and requirements for future postings.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Candidate Quality</h4>
                <p className="text-sm text-gray-500">
                  42% of applicants meet all required qualifications. Consider refining job requirements to attract more
                  qualified candidates.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="interviews" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Interview to Offer Ratio</h4>
                <p className="text-sm text-gray-500">
                  Your interview to offer ratio is 4:1, which is better than the industry average of 6:1. Your
                  pre-screening process is effective at identifying qualified candidates.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Interview Scheduling</h4>
                <p className="text-sm text-gray-500">
                  The average time to schedule an interview is 3.5 days. Consider implementing an automated scheduling
                  system to reduce this time.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Candidate Feedback</h4>
                <p className="text-sm text-gray-500">
                  85% of interviewed candidates rated their experience positively. The most common feedback was
                  appreciation for clear communication about next steps.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="hires" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Time to Hire</h4>
                <p className="text-sm text-gray-500">
                  Your average time to hire is 28 days, which is 15% faster than industry average. Your streamlined
                  interview process is contributing to this efficiency.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Offer Acceptance Rate</h4>
                <p className="text-sm text-gray-500">
                  Your offer acceptance rate is 82%. The most common reason for declined offers is compensation not
                  meeting expectations. Consider reviewing your compensation packages.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">New Hire Retention</h4>
                <p className="text-sm text-gray-500">
                  90% of new hires remain with the company after 6 months. This suggests your job descriptions
                  accurately reflect the actual role responsibilities.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
