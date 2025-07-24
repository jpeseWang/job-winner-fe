"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal, Eye, CheckCircle, XCircle, Trash2, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { placeholderJobs } from "@/utils/placeholders"
import { jobService } from "@/services/jobService"
import { JobStatus } from "@/types/enums"

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState(placeholderJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Lấy tất cả job có status khác nhau cho admin
        const { data } = await jobService.getJobs({ status: undefined, limit: 100 })
        setJobs(data)
      } catch (error) {
        // handle error
      }
    }
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    const matchesType = typeFilter === "all" || job.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewJob = (job: any) => {
    setSelectedJob(job)
    setIsViewDialogOpen(true)
  }

  const handleDeleteJob = (job: any) => {
    setSelectedJob(job)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setJobs(jobs.filter((job) => job.id !== selectedJob.id))
    setIsDeleteDialogOpen(false)
    setSelectedJob(null)
  }

  const updateJobStatus = (jobId: string, newStatus: string) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
  }

  const approveJob = async (jobId: string) => {
    try {
      await jobService.updateJob(jobId, { status: JobStatus.ACTIVE })
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: JobStatus.ACTIVE } : job)))
    } catch (error) {
      // handle error
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "full-time":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Full-time
          </Badge>
        )
      case "part-time":
        return <Badge variant="outline">Part-time</Badge>
      case "contract":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Contract
          </Badge>
        )
      case "freelance":
        return <Badge variant="secondary">Freelance</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          <p className="text-gray-600">Review and manage all job postings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Postings</CardTitle>
          <CardDescription>
            Total jobs: {jobs.length} | Active: {jobs.filter((j) => j.status === "active").length} | Pending:{" "}
            {jobs.filter((j) => j.status === "pending").length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{getTypeBadge(job.type)}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell>{job.postedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewJob(job)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {job.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => approveJob(job.id)}>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Duyệt
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateJobStatus(job.id, "rejected")}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject Job
                            </DropdownMenuItem>
                          </>
                        )}
                        {job.status === "active" && (
                          <DropdownMenuItem onClick={() => updateJobStatus(job.id, "expired")}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Mark as Expired
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteJob(job)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8 text-gray-500">No jobs found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* View Job Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>Review complete job posting information.</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Job Title</h4>
                  <p>{selectedJob.title}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Company</h4>
                  <p>{selectedJob.company}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p>{selectedJob.location}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Job Type</h4>
                  <p>{selectedJob.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Salary</h4>
                  <p>{selectedJob.salary}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Applications</h4>
                  <p>{selectedJob.applications} candidates</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                {getStatusBadge(selectedJob.status)}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Posted Date</h4>
                <p>{selectedJob.postedAt}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Job Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedJob?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
