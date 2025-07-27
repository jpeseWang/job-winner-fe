"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/utils"
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  FileText,
  Briefcase,
  Loader2,
  User,
  Mail,
  Phone,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getApplicationStatusBadge } from "@/lib/ui/getApplicationStatusBadge"
import type { ApplicationStatus } from "@/types/enums"

interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  userId: string
  name: string
  email: string
  candidatePhoto: string | null
  resumeUrl: string
  coverLetter: string
  status: ApplicationStatus
  appliedDate: string
}

export default function ApplicationsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [applications, setApplications] = useState<Application[]>([])
  const [totalApplications, setTotalApplications] = useState(0)

  // Fetch applications from API
  const fetchApplications = async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/applications/by-recruiter")
      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }
      const data = await response.json()
      setApplications(data)
      setTotalApplications(data.length)
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [session?.user?.id])

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentApplications = filteredApplications.slice(startIndex, endIndex)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as ApplicationStatus | "all")
    setCurrentPage(1)
  }

  const handleViewDetails = (applicationId: string) => {
    setSelectedApplicationId(applicationId)
  }

  const selectedApplication = applications.find(app => app.id === selectedApplicationId)

  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const response = await fetch("/api/applications/by-recruiter", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update application status")
      }

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      )
      
      toast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      })
    }
  }

  const getStatusStats = () => {
    const stats = applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: totalApplications,
      pending: stats.pending || 0,
      reviewed: stats.reviewed || 0,
      interviewed: stats.interviewed || 0,
      hired: stats.hired || 0,
      rejected: stats.rejected || 0,
    }
  }

  const stats = getStatusStats()

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <p className="text-gray-600">Review and manage applications for your job postings</p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/dashboard/recruiter/jobs">
            <Briefcase className="h-4 w-4" /> Manage Jobs
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value="all" onValueChange={() => {}}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchApplications} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>
            Showing {currentApplications.length} of {filteredApplications.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : currentApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "No applications match your search criteria."
                  : "No applications have been submitted yet."}
              </p>
              <Button asChild>
                <Link href="/dashboard/recruiter/jobs">Manage Jobs</Link>
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={application.candidatePhoto || "/placeholder-user.jpg"}
                              alt={application.name}
                            />
                            <AvatarFallback>
                              {application.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{application.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{application.jobTitle}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {getApplicationStatusBadge(application.status)}
                          <Select
                            value={application.status}
                            onValueChange={(value) => handleUpdateStatus(application.id, value as ApplicationStatus)}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="interviewed">Interviewed</SelectItem>
                              <SelectItem value="hired">Hired</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                                                 <div className="text-sm text-gray-500">
                           {formatDate(application.appliedDate)}
                         </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                                                     <Dialog>
                             <DialogTrigger asChild>
                               <Button variant="outline" size="sm" onClick={() => handleViewDetails(application.id)}>
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
                                       <h4 className="font-medium">Company</h4>
                                       <p className="text-sm text-gray-600">{selectedApplication.company}</p>
                                     </div>
                                   </div>
                                   <Separator />
                                   <div>
                                     <h4 className="font-medium">Cover Letter</h4>
                                     <p className="text-sm text-gray-600 mt-2">{selectedApplication.coverLetter}</p>
                                   </div>
                                   {selectedApplication.resumeUrl && (
                                     <>
                                       <Separator />
                                       <div>
                                         <h4 className="font-medium">Resume</h4>
                                         <Button variant="outline" size="sm" className="mt-2">
                                           <Download className="h-4 w-4 mr-2" />
                                           Download Resume
                                         </Button>
                                       </div>
                                     </>
                                   )}
                                   <Separator />
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

                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/jobs/${application.jobId}`}>
                              <FileText className="h-4 w-4" />
                            </Link>
                          </Button>

                          {application.resumeUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredApplications.length)} of {filteredApplications.length} applications
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNumber)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 