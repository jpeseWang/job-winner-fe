"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  StarOff,
  MessageSquare,
} from "lucide-react"
import { jobs, categories } from "@/lib/data"
import { jobService } from "@/services/jobService"
import { JobStatus } from "@/types/enums"

export default function AdminJobsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewDecision, setReviewDecision] = useState<"approve" | "reject" | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [jobsData, setJobsData] = useState<any[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await jobService.getJobs({ status: undefined, limit: 100 })
        setJobsData(data)
      } catch (error) {}
    }
    fetchJobs()
  }, [])

  const jobsWithStatus = jobsData.length > 0 ? jobsData : jobs.map((job) => ({ ...job, status: Math.random() > 0.3 ? "approved" : Math.random() > 0.5 ? "pending" : "rejected" }))

  // Filter jobs based on search term, category, and status
  const filteredJobs = jobsWithStatus.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter
    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const handleReviewJob = (job: any) => {
    setSelectedJob(job)
    setReviewDecision(null)
    setRejectionReason("")
    setIsReviewDialogOpen(true)
  }

  const submitReview = async () => {
    if (!selectedJob) return
    if (reviewDecision === "approve") {
      await jobService.updateJob(selectedJob.id, { status: JobStatus.ACTIVE })
      setJobsData(jobsData.map((job) => (job.id === selectedJob.id ? { ...job, status: JobStatus.ACTIVE } : job)))
    } else if (reviewDecision === "reject") {
      await jobService.updateJob(selectedJob.id, { status: JobStatus.REJECTED, rejectionReason })
      setJobsData(jobsData.map((job) => (job.id === selectedJob.id ? { ...job, status: JobStatus.REJECTED, rejectionReason } : job)))
    }
    setIsReviewDialogOpen(false)
  }

  useEffect(() => {
    if (reviewDecision) {
      submitReview()
      setReviewDecision(null)
    }
  }, [reviewDecision])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No jobs found. Try adjusting your search filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {job.featured && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                        <span>{job.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.category}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : (job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-")}</TableCell>
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
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Job</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Job</span>
                          </DropdownMenuItem>
                          {job.status === "pending" && (
                            <DropdownMenuItem onClick={() => handleReviewJob(job)}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              <span>Review Job</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Contact Recruiter</span>
                          </DropdownMenuItem>
                          {job.featured ? (
                            <DropdownMenuItem>
                              <StarOff className="mr-2 h-4 w-4" />
                              <span>Remove Featured</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" />
                              <span>Mark as Featured</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Job</span>
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

      {/* Job Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Job</DialogTitle>
            <DialogDescription>
              Approve or reject this job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="font-semibold">{selectedJob?.title}</div>
            <div>Status: <span className="capitalize">{selectedJob?.status}</span></div>
            {reviewDecision === "reject" && (
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setReviewDecision("reject"); }}>Reject</Button>
            <Button variant="default" onClick={() => { setReviewDecision("approve"); }}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
