"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminCompanyManagerPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const endpoint = "/api/company"
        const res = await fetch(endpoint)
        const data = await res.json()
        setCompanies(data)
      } catch (err) {
        toast.error("Error fetching companies")
      }
      setLoading(false)
    }

    fetchCompanies()
  }, [])

  const approveCompany = async (id: string) => {
    const res = await fetch(`/api/company/${id}/verify`, { method: "PATCH" })
    if (res.ok) {
      toast.success("Approved company successfully!")
      setCompanies(prev => prev.filter(c => c._id !== id))
    }
  }

  const deleteCompany = async (id: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      const res = await fetch(`/api/company/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("🗑 Company deleted successfully.")
        setCompanies(prev => prev.filter(c => c._id !== id))
      }
    }
  }

  const disableCompany = async (id: string) => {
    const res = await fetch(`/api/company/${id}/disable`, { method: "PATCH" })
    if (res.ok) {
      toast.success("Company disabled successfully.")
      setCompanies(prev =>
        prev.map(c => (c._id === id ? { ...c, isVerified: false } : c))
      )
    }
  }


  const viewDetails = (company: any) => {
    if (!company?._id) {
      toast.error("Company ID not found")
      return
    }
    setSelectedCompany(company)
    setModalOpen(true)
  }

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (isVerified: boolean) => {
    if (isVerified === undefined) return null
    else if (isVerified === true) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Verified
        </Badge>
      )
    } else if (isVerified === false) {
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
          Pending
        </Badge>
      )
    }
  }

  return (
    <div className="max-w-6xl mx-auto my-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">List of company</h1>
        <Button onClick={() => router.push("/dashboard/admin/companies/create")}>
          Add New Company
        </Button>
      </div>


      {/* Search */}
      <Input
        type="text"
        placeholder="🔍 Search by Company name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full"
      />



      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                Loading companies...
              </td>
            </TableRow>
          ) : filteredCompanies.length === 0 ? (
            <TableRow>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                No companies found.
              </td>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt="logo"
                      className="w-10 h-10 object-contain rounded-full"
                    />
                  ) : (
                    <span className="text-gray-400 italic">None</span>
                  )}

                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.owner?.name || "None"}</TableCell>
                <TableCell>{company.description}</TableCell>
                <TableCell>{getStatusBadge(company.isVerified)}</TableCell>
                <TableCell>  {new Date(company.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => viewDetails(company)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {company.isVerified === false && (
                        <>
                          <DropdownMenuItem onClick={() => approveCompany(company._id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve Company
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem onClick={() => updateJobStatus(company.id, "rejected")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Job
                          </DropdownMenuItem> */}
                        </>
                      )}
                      {company.isVerified === true && (
                        <DropdownMenuItem onClick={() => disableCompany(company._id)}>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Disable Company
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteCompany(company._id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )))}
        </TableBody>
      </Table>
      {/* Modal for company details */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-2">
              <div> {selectedCompany.logo ? (
                <img src={selectedCompany.logo} alt="Logo công ty" className="w-24 h-24 object-contain rounded-md border" />
              ) : (
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-md text-gray-500 border">
                  No Logo
                </div>
              )}</div>
              <div>
                <strong>Name:</strong> {selectedCompany.name}
              </div>
              <div>
                <strong>Owner:</strong> {selectedCompany.owner?.name || "None"}
              </div>
              <div>
                <strong>Description:</strong> {selectedCompany.description}
              </div>
              <div>
                <strong>Status:</strong> {getStatusBadge(selectedCompany.isVerified)}
              </div>
              <div>
                <strong>Created:</strong> {new Date(selectedCompany.createdAt).toLocaleDateString("vi-VN")}
              </div>
              {/* {selectedCompany.logo && (
                <img src={selectedCompany.logo} alt="logo" className="w-20 h-20 object-contain rounded-full mt-2" />
              )} */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
