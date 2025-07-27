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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useApplications } from "@/hooks/index"
import { ApplicationStatus } from "@/types/enums"
import { formatDate } from "@/utils"
import { APPLICATION_STATUSES, DEFAULT_AVATAR } from "@/constants"
import type { JobApplication } from "@/types/interfaces"

export default function RecruiterApplicationsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)

  // Use the custom hook to fetch applications with SWR
  const { applications, isLoading, updateStatus } = useApplications({
    status: statusFilter !== "all" ? (statusFilter as ApplicationStatus) : undefined,
  })

  // Ensure applications is always an array
  const applicationsArray = Array.isArray(applications) ? applications : []

  // Filter applications based on search term and status filter
  const filteredApplications = applicationsArray.filter((app: JobApplication) => {
    // Search filter
    const matchesSearch = searchTerm === "" ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Status filter
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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

  const handleViewDetails = (applicationId: string) => {
    setSelectedApplicationId(applicationId)
  }

  const selectedApplication = applicationsArray.find((app: JobApplication) => app.id === selectedApplicationId)

  const handleDownloadResume = (resumeUrl: string, candidateName: string) => {
    if (!resumeUrl) {
      alert("No resume available for download")
      return
    }

    // Create a temporary link element to trigger download
    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = `${candidateName}_resume.pdf` // Set filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get statistics
  const getStats = () => {
    const stats = applicationsArray.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: applicationsArray.length,
      pending: stats.pending || 0,
      reviewed: stats.reviewed || 0,
      interviewed: stats.interviewed || 0,
      hired: stats.hired || 0,
      rejected: stats.rejected || 0,
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.interviewed}</div>
            <div className="text-sm text-gray-600">Interviewed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
            <div className="text-sm text-gray-600">Hired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

             {/* Search and Filters */}
       <Card>
         <CardContent className="p-4">
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
             
             <Button 
               variant="outline" 
               onClick={() => {
                 setSearchTerm("")
                 setStatusFilter("all")
               }}
               disabled={searchTerm === "" && statusFilter === "all"}
             >
               Clear Filters
             </Button>
           </div>
         </CardContent>
       </Card>

             <Card>
         <CardContent className="p-0">
           <div className="p-4 border-b">
             <div className="flex justify-between items-center">
               <div>
                 <h3 className="text-lg font-semibold">Applications ({filteredApplications.length})</h3>
                                   <p className="text-sm text-gray-600">
                    Showing {filteredApplications.length} of {applicationsArray.length} applications
                    {(searchTerm || statusFilter !== "all") && (
                      <span className="text-blue-600">
                        {" "}• Filtered results
                      </span>
                    )}
                  </p>
               </div>
             </div>
           </div>
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
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewDetails(application.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about this application
                              </DialogDescription>
                            </DialogHeader>
                            {selectedApplication ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">Candidate</h4>
                                    <p className="text-sm text-gray-600">{selectedApplication.name}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Job Title</h4>
                                    <p className="text-sm text-gray-600">{selectedApplication.jobTitle}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Email</h4>
                                    <p className="text-sm text-gray-600">{selectedApplication.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Status</h4>
                                    <p className="text-sm text-gray-600">{selectedApplication.status}</p>
                                  </div>
                                </div>
                                <Separator />
                                {selectedApplication.coverLetter && (
                                  <>
                                    <div>
                                      <h4 className="font-medium">Cover Letter</h4>
                                      <p className="text-sm text-gray-600 mt-2">{selectedApplication.coverLetter}</p>
                                    </div>
                                    <Separator />
                                  </>
                                )}
                                                                 {selectedApplication.resumeUrl && (
                                   <>
                                     <div>
                                       <h4 className="font-medium">Resume</h4>
                                       <Button 
                                         variant="outline" 
                                         size="sm" 
                                         className="mt-2"
                                         onClick={() => handleDownloadResume(selectedApplication.resumeUrl, selectedApplication.name)}
                                       >
                                         <Download className="h-4 w-4 mr-2" />
                                         Download Resume
                                       </Button>
                                     </div>
                                     <Separator />
                                   </>
                                 )}
                                <div>
                                  <h4 className="font-medium">Application Timeline</h4>
                                  <div className="text-sm text-gray-600 mt-2">
                                    <p>Applied: {formatDate(selectedApplication.appliedDate)}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-gray-500">Loading application details...</p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                                                     <DropdownMenuContent align="end">
                             <DropdownMenuItem
                               onClick={() => handleDownloadResume(application.resumeUrl, application.name)}
                             >
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
                      </div>
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
