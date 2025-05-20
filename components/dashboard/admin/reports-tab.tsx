"use client"

import { useState } from "react"
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
import { Search, MoreVertical, Eye, CheckCircle, XCircle, AlertTriangle, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock report types and statuses
const REPORT_TYPES = [
  { value: "job_spam", label: "Job Spam" },
  { value: "inappropriate_content", label: "Inappropriate Content" },
  { value: "fake_job", label: "Fake Job" },
  { value: "harassment", label: "Harassment" },
  { value: "technical_issue", label: "Technical Issue" },
  { value: "other", label: "Other" },
]

const REPORT_STATUSES = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "investigating", label: "Investigating", color: "blue" },
  { value: "resolved", label: "Resolved", color: "green" },
  { value: "dismissed", label: "Dismissed", color: "gray" },
]

// Mock report data
interface Report {
  id: string
  title: string
  type: string
  status: string
  reportedBy: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  reportedItem: {
    id: string
    type: "job" | "user" | "company" | "content"
    title: string
  }
  description: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  resolution?: string
}

const mockReports: Report[] = [
  {
    id: "rep-001",
    title: "Suspicious job posting with unrealistic salary",
    type: "fake_job",
    status: "pending",
    reportedBy: {
      id: "user-123",
      name: "John Smith",
      email: "john.smith@example.com",
    },
    reportedItem: {
      id: "job-456",
      type: "job",
      title: "Senior Developer - $500k",
    },
    description: "This job posting seems fake. The salary is unrealistically high and the company doesn't exist.",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "rep-002",
    title: "Inappropriate language in job description",
    type: "inappropriate_content",
    status: "investigating",
    reportedBy: {
      id: "user-456",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
    },
    reportedItem: {
      id: "job-789",
      type: "job",
      title: "Marketing Assistant",
    },
    description: "The job description contains inappropriate language and discriminatory requirements.",
    createdAt: "2023-05-14T15:45:00Z",
    updatedAt: "2023-05-15T09:20:00Z",
    assignedTo: "admin-002",
  },
  {
    id: "rep-003",
    title: "Company posting multiple identical jobs",
    type: "job_spam",
    status: "resolved",
    reportedBy: {
      id: "user-789",
      name: "Michael Brown",
      email: "m.brown@example.com",
    },
    reportedItem: {
      id: "company-123",
      type: "company",
      title: "TechCorp Inc.",
    },
    description: "This company has posted the same job 15 times in the last hour.",
    createdAt: "2023-05-13T08:15:00Z",
    updatedAt: "2023-05-14T11:30:00Z",
    assignedTo: "admin-001",
    resolution: "Duplicate job postings removed and company account temporarily restricted.",
  },
  {
    id: "rep-004",
    title: "Harassing messages from recruiter",
    type: "harassment",
    status: "pending",
    reportedBy: {
      id: "user-101",
      name: "Emily Wilson",
      email: "emily.w@example.com",
    },
    reportedItem: {
      id: "user-202",
      type: "user",
      title: "Robert Thompson (Recruiter)",
    },
    description: "This recruiter has been sending inappropriate and harassing messages after I declined an interview.",
    createdAt: "2023-05-15T14:20:00Z",
    updatedAt: "2023-05-15T14:20:00Z",
  },
  {
    id: "rep-005",
    title: "Profile page not loading correctly",
    type: "technical_issue",
    status: "dismissed",
    reportedBy: {
      id: "user-303",
      name: "David Lee",
      email: "david.lee@example.com",
    },
    reportedItem: {
      id: "system",
      type: "content",
      title: "Profile Page",
    },
    description: "My profile page isn't loading correctly. I can't update my skills section.",
    createdAt: "2023-05-12T09:45:00Z",
    updatedAt: "2023-05-13T10:15:00Z",
    assignedTo: "admin-003",
    resolution: "Issue was specific to user's browser cache. Provided troubleshooting steps.",
  },
]

export default function AdminReportsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)
  const [resolution, setResolution] = useState("")

  // Filter reports based on search term, type, and status
  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  const handleResolveReport = (report: Report) => {
    setSelectedReport(report)
    setResolution("")
    setIsResolveDialogOpen(true)
  }

  const submitResolution = () => {
    // In a real app, this would call an API to update the report status
    console.log(`Resolving report ${selectedReport?.id} with resolution: ${resolution}`)
    setIsResolveDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = REPORT_STATUSES.find((s) => s.value === status) || REPORT_STATUSES[0]

    return (
      <Badge
        variant="outline"
        className={`bg-${statusConfig.color}-50 text-${statusConfig.color}-700 border-${statusConfig.color}-200 flex items-center gap-1`}
      >
        {status === "pending" && <AlertTriangle className="h-3 w-3" />}
        {status === "investigating" && <Search className="h-3 w-3" />}
        {status === "resolved" && <CheckCircle className="h-3 w-3" />}
        {status === "dismissed" && <XCircle className="h-3 w-3" />}
        {statusConfig.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {REPORT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {REPORT_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Report</TableHead>
                <TableHead>Reported Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No reports found. Try adjusting your search filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={report.reportedBy.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{report.reportedBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium truncate max-w-[200px]">{report.title}</div>
                          <div className="text-sm text-gray-500">{report.reportedBy.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {report.reportedItem.type}
                        </Badge>
                        <span className="truncate max-w-[150px]">{report.reportedItem.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {REPORT_TYPES.find((type) => type.value === report.type)?.label || report.type}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewReport(report)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          {report.status !== "resolved" && report.status !== "dismissed" && (
                            <DropdownMenuItem onClick={() => handleResolveReport(report)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Resolve Report</span>
                            </DropdownMenuItem>
                          )}
                          {report.status === "pending" && (
                            <DropdownMenuItem>
                              <Search className="mr-2 h-4 w-4" />
                              <span>Mark as Investigating</span>
                            </DropdownMenuItem>
                          )}
                          {report.status !== "dismissed" && report.status !== "resolved" && (
                            <DropdownMenuItem>
                              <XCircle className="mr-2 h-4 w-4" />
                              <span>Dismiss Report</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Contact Reporter</span>
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

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Report ID</h3>
                  <p>{selectedReport.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                  <p>{selectedReport.reportedBy.name}</p>
                  <p className="text-sm text-gray-500">{selectedReport.reportedBy.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Reported</h3>
                  <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Report Type</h3>
                  <p>{REPORT_TYPES.find((type) => type.value === selectedReport.type)?.label || selectedReport.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reported Item</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {selectedReport.reportedItem.type}
                    </Badge>
                    <span>{selectedReport.reportedItem.title}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm">{selectedReport.description}</div>
              </div>

              {selectedReport.resolution && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Resolution</h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">{selectedReport.resolution}</div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                {selectedReport.status !== "resolved" && selectedReport.status !== "dismissed" && (
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      handleResolveReport(selectedReport)
                    }}
                  >
                    Resolve Report
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Report Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Provide details on how this report was resolved and any actions taken.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Report</h3>
              <p className="text-sm">{selectedReport?.title}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="resolution" className="text-sm font-medium">
                Resolution Details
              </label>
              <Textarea
                id="resolution"
                placeholder="Describe how the issue was resolved..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={5}
              />
            </div>

            <Select defaultValue="resolved">
              <SelectTrigger>
                <SelectValue placeholder="Select resolution status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resolved">Resolved - Action Taken</SelectItem>
                <SelectItem value="dismissed">Dismissed - No Action Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitResolution} disabled={!resolution.trim()}>
              Submit Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
