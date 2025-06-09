"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, MoreHorizontal, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { placeholderReports } from "@/utils/placeholders"

export default function ReportsPage() {
  const [reports, setReports] = useState(placeholderReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.reportedUser && report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.reportedJob && report.reportedJob.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleViewReport = (report: any) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  const handleResolveReport = (report: any) => {
    setSelectedReport(report)
    setIsResolveDialogOpen(true)
  }

  const confirmResolve = () => {
    setReports(
      reports.map((report) =>
        report.id === selectedReport.id ? { ...report, status: "resolved", resolutionNotes } : report,
      ),
    )
    setIsResolveDialogOpen(false)
    setSelectedReport(null)
    setResolutionNotes("")
  }

  const updateReportStatus = (reportId: string, newStatus: string) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "investigating":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        )
      case "dismissed":
        return <Badge variant="secondary">Dismissed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "user":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            User Report
          </Badge>
        )
      case "job":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Job Report
          </Badge>
        )
      case "content":
        return <Badge variant="outline">Content Report</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports Center</h1>
          <p className="text-gray-600">Review and manage user reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigating</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "investigating").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "resolved").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Management</CardTitle>
          <CardDescription>Review and take action on user reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user">User Reports</SelectItem>
                <SelectItem value="job">Job Reports</SelectItem>
                <SelectItem value="content">Content Reports</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.reportedUser || report.reportedJob || "Content Report"}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(report.type)}</TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewReport(report)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {report.status === "pending" && (
                          <DropdownMenuItem onClick={() => updateReportStatus(report.id, "investigating")}>
                            Start Investigation
                          </DropdownMenuItem>
                        )}
                        {(report.status === "pending" || report.status === "investigating") && (
                          <>
                            <DropdownMenuItem onClick={() => handleResolveReport(report)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Resolve Report
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateReportStatus(report.id, "dismissed")}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Dismiss Report
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">No reports found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Review complete report information.</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Report Type</h4>
                  {getTypeBadge(selectedReport.type)}
                </div>
                <div>
                  <h4 className="font-semibold">Status</h4>
                  {getStatusBadge(selectedReport.status)}
                </div>
                <div>
                  <h4 className="font-semibold">Reported By</h4>
                  <p>{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Date Reported</h4>
                  <p>{selectedReport.createdAt}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Reported Item</h4>
                <p>{selectedReport.reportedUser || selectedReport.reportedJob || "Content item"}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Reason</h4>
                <p>{selectedReport.reason}</p>
              </div>
              {selectedReport.resolutionNotes && (
                <div>
                  <h4 className="font-semibold mb-2">Resolution Notes</h4>
                  <p className="bg-gray-50 p-3 rounded">{selectedReport.resolutionNotes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Report Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>Add resolution notes and mark this report as resolved.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resolution-notes">Resolution Notes</Label>
              <Textarea
                id="resolution-notes"
                placeholder="Describe the action taken to resolve this report..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmResolve} disabled={!resolutionNotes.trim()}>
              Resolve Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
