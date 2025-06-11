"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreVertical, Eye, Edit, Trash2, ArrowUpDown, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useJobs } from "@/hooks/index"
import type { JobStatus } from "@/types/enums"
import { formatDate } from "@/utils"
import { JOB_STATUSES } from "@/constants"
import { jobService } from "@/services"

export default function RecruiterJobsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Use the custom hook to fetch jobs with SWR
  const { jobs, total, totalPages, currentPage, isLoading, goToPage, refresh } = useJobs({
    status: statusFilter !== "all" ? (statusFilter as JobStatus) : undefined,
    keyword: searchTerm || undefined,
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = JOB_STATUSES.find((s) => s.value === status) || JOB_STATUSES[0]

    return (
      <Badge
        variant="outline"
        className={`bg-${statusConfig.color}-50 text-${statusConfig.color}-700 border-${statusConfig.color}-200 flex items-center`}
      >
        {status === "active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
        {status === "expired" && <XCircle className="h-3 w-3 mr-1" />}
        {status === "draft" && <Clock className="h-3 w-3 mr-1" />}
        {statusConfig.label}
      </Badge>
    )
  }

  const handleDeleteJob = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        // Call the API to delete the job
        await jobService.deleteJob(id)
        refresh()
      } catch (error) {
        console.error("Error deleting job:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search jobs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {JOB_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button asChild>
          <Link href="/dashboard/recruiter/jobs/new">
            <Plus className="h-4 w-4 mr-2" />
            Post a Job
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div className="flex items-center">
                    Job Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Posted Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading jobs...
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No jobs found. Try adjusting your search or post a new job.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status || "active")}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{Math.floor(Math.random() * 50)} applications</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(job.postedDate)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/jobs/${job.id}`} className="flex items-center w-full">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={`/dashboard/recruiter/jobs/${job.id}/edit`}
                              className="flex items-center w-full"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteJob(job.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
