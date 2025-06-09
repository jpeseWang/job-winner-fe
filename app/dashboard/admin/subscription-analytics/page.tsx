"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Users, DollarSign, CreditCard, Target } from "lucide-react"
import { placeholderAnalytics } from "@/utils/placeholders"

export default function SubscriptionAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const analytics = placeholderAnalytics

  const subscriptionPlans = [
    { name: "Free", users: 12080, revenue: 0, color: "bg-gray-100 text-gray-800" },
    { name: "Basic", users: 2340, revenue: 23400, color: "bg-blue-100 text-blue-800" },
    { name: "Premium", users: 890, revenue: 17800, color: "bg-purple-100 text-purple-800" },
    { name: "Enterprise", users: 110, revenue: 4400, color: "bg-yellow-100 text-yellow-800" },
  ]

  const recentSubscriptions = [
    { id: "1", user: "John Doe", plan: "Premium", amount: "$29.99", date: "2024-01-28", status: "active" },
    { id: "2", user: "Jane Smith", plan: "Basic", amount: "$9.99", date: "2024-01-28", status: "active" },
    { id: "3", user: "Mike Johnson", plan: "Enterprise", amount: "$99.99", date: "2024-01-27", status: "active" },
    { id: "4", user: "Sarah Wilson", plan: "Premium", amount: "$29.99", date: "2024-01-27", status: "cancelled" },
    { id: "5", user: "David Brown", plan: "Basic", amount: "$9.99", date: "2024-01-26", status: "active" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscription Analytics</h1>
          <p className="text-gray-600">Monitor subscription performance and revenue</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeSubscriptions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Breakdown of users and revenue by subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={plan.color}>{plan.name}</Badge>
                  <div>
                    <div className="font-medium">{plan.users.toLocaleString()} users</div>
                    <div className="text-sm text-gray-500">
                      {plan.name === "Free" ? "Free plan" : `$${(plan.revenue / plan.users).toFixed(2)} avg per user`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${plan.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">monthly revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Metrics</CardTitle>
            <CardDescription>Key revenue performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Average Revenue Per User</span>
              <span className="font-bold">${analytics.averageRevenuePerUser}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Churn Rate</span>
              <span className="font-bold text-red-600">{analytics.churnRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Customer Lifetime Value</span>
              <span className="font-bold">$247.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Monthly Recurring Revenue</span>
              <span className="font-bold">${analytics.monthlyRevenue.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
            <CardDescription>User acquisition and growth trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">New Signups (30d)</span>
              <span className="font-bold text-green-600">+1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Upgrades (30d)</span>
              <span className="font-bold text-green-600">+189</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Downgrades (30d)</span>
              <span className="font-bold text-red-600">-23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Cancellations (30d)</span>
              <span className="font-bold text-red-600">-67</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>Latest subscription activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subscription.plan}</Badge>
                  </TableCell>
                  <TableCell>{subscription.amount}</TableCell>
                  <TableCell>{subscription.date}</TableCell>
                  <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
