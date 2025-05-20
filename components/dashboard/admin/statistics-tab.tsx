"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  AreaChart,
  Area,
} from "recharts"
import { Users, Briefcase, FileText, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

// Mock statistics data
const userGrowthData = [
  { name: "Jan", jobSeekers: 850, recruiters: 120 },
  { name: "Feb", jobSeekers: 940, recruiters: 140 },
  { name: "Mar", jobSeekers: 1050, recruiters: 160 },
  { name: "Apr", jobSeekers: 1200, recruiters: 190 },
  { name: "May", jobSeekers: 1350, recruiters: 210 },
  { name: "Jun", jobSeekers: 1500, recruiters: 240 },
  { name: "Jul", jobSeekers: 1650, recruiters: 270 },
]

const jobPostsData = [
  { name: "Jan", jobs: 320 },
  { name: "Feb", jobs: 380 },
  { name: "Mar", jobs: 420 },
  { name: "Apr", jobs: 450 },
  { name: "May", jobs: 520 },
  { name: "Jun", jobs: 580 },
  { name: "Jul", jobs: 620 },
]

const applicationData = [
  { name: "Jan", applications: 1200 },
  { name: "Feb", applications: 1400 },
  { name: "Mar", applications: 1600 },
  { name: "Apr", applications: 1800 },
  { name: "May", applications: 2200 },
  { name: "Jun", applications: 2500 },
  { name: "Jul", applications: 2800 },
]

const categoryDistributionData = [
  { name: "Technology", value: 2340 },
  { name: "Healthcare", value: 1250 },
  { name: "Education", value: 980 },
  { name: "Finance", value: 1120 },
  { name: "Marketing", value: 860 },
  { name: "Sales", value: 720 },
  { name: "Customer Service", value: 680 },
  { name: "Administrative", value: 800 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

const revenueData = [
  { name: "Jan", revenue: 18500 },
  { name: "Feb", revenue: 21200 },
  { name: "Mar", revenue: 24500 },
  { name: "Apr", revenue: 26800 },
  { name: "May", revenue: 29400 },
  { name: "Jun", revenue: 32400 },
  { name: "Jul", revenue: 35600 },
]

export default function AdminStatisticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">15,420</h3>
                <div className="flex items-center mt-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <h3 className="text-2xl font-bold mt-1">5,230</h3>
                <div className="flex items-center mt-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+8% from last month</span>
                </div>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Applications</p>
                <h3 className="text-2xl font-bold mt-1">42,680</h3>
                <div className="flex items-center mt-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+15% from last month</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$285,600</h3>
                <div className="flex items-center mt-1 text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>-3% from last month</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Number of job seekers and recruiters joining the platform over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userGrowthData}
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
                  <Area
                    type="monotone"
                    dataKey="jobSeekers"
                    stackId="1"
                    stroke="#14b8a6"
                    fill="#14b8a6"
                    name="Job Seekers"
                  />
                  <Area
                    type="monotone"
                    dataKey="recruiters"
                    stackId="2"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Recruiters"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Postings</CardTitle>
            <CardDescription>Number of jobs posted on the platform over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={jobPostsData}
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
                  <Bar dataKey="jobs" fill="#14b8a6" name="Jobs Posted" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Applications Submitted</CardTitle>
            <CardDescription>Number of job applications submitted over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={applicationData}
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
                  <Line type="monotone" dataKey="applications" stroke="#14b8a6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Categories</CardTitle>
            <CardDescription>Distribution of jobs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistributionData.map((entry, index) => (
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
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Monthly revenue generated from premium job postings and recruiter subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" fill="#14b8a6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
