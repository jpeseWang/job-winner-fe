"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Eye, Download, CheckCircle, XCircle, Clock, MessageSquare, Calendar } from "lucide-react"
import { useApplications } from "@/hooks/index"
import { ApplicationStatus } from "@/types/enums"
import { formatDate } from "@/utils"
import { APPLICATION_STATUSES, DEFAULT_AVATAR } from "@/constants"
import type { JobApplication } from "@/types/interfaces"

export default function RecruiterApplicationsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [jobFilter, setJobFilter] = useState<string>("all")

  // Use the custom hook to fetch applications with SWR
  const { applications, isLoading, updateStatus } = useApplications({
    status: statusFilter !== "all" ? (statusFilter as ApplicationStatus) : undefined,
    jobId: jobFilter !== "all" ? jobFilter : undefined,
  })

  // Filter applications based on search term
  const filteredApplications = applications.filter((app: JobApplication) => {
    return (
      searchTerm === "" ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Get unique job titles for filter
  const jobTitles = Array.from(new Set(applications.map((app: JobApplication) => app.jobTitle).filter(Boolean))) as string[];

  const getStatusBadge = (status: string) => {
    const statusConfig = APPLICATION_STATUSES.find((s) => s.value === status) || APPLICATION_STATUSES[0]

    return (
      <Badge
        variant="outline"
        className={`bg-${statusConfig.color}-50 text-${statusConfig.color}-700 border-${statusConfig.color}-200 flex items-center`}
      >
        {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
        {status === "reviewed" && <Eye className="h-3 w-3 mr-1" />}
        {status === "interviewed" && <Calendar className="h-3 w-3 mr-1" />}
        {status === "hired" && <CheckCircle className="h-3 w-3 mr-1" />}
        {status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
        {statusConfig.label}
      </Badge>
    )
  }

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateStatus(id, status)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search applications..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobTitles.map((title) => (
              <SelectItem key={title} value={title || ""}>
                {title}
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
            {APPLICATION_STATUSES.map((status) => (
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
                <TableHead className="w-[300px]">Candidate</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No applications found. Try adjusting your search filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application: JobApplication) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={application.candidatePhoto || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                          alt={application.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{application.jobTitle}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>{formatDate(application.appliedDate)}</TableCell>
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
                            <span>View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download Resume</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Message</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Schedule Interview</span>
                          </DropdownMenuItem>

                          {/* Status change options */}
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(application.id, ApplicationStatus.REVIEWED)}
                          >
                            <Eye className="mr-2 h-4 w-4 text-blue-600" />
                            <span>Mark as Reviewed</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(application.id, ApplicationStatus.INTERVIEWED)}
                          >
                            <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                            <span>Mark as Interviewed</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(application.id, ApplicationStatus.HIRED)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            <span>Mark as Hired</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(application.id, ApplicationStatus.REJECTED)}
                          >
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            <span>Mark as Rejected</span>
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
    </div>
  )
}
