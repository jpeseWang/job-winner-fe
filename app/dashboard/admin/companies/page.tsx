"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminCompanyManagerPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tab, setTab] = useState<"pending" | "verified">("pending")

  useEffect(() => {
    const fetchCompanies = async () => {
      const endpoint =
        tab === "pending" ? "/api/get-unverified-companies" : "/api/get-verified-companies"

      const res = await fetch(endpoint)
      const data = await res.json()
      setCompanies(data)
    }

    fetchCompanies()
  }, [tab])

  const approveCompany = async (id: string) => {
    const res = await fetch(`/api/verify-company/${id}`, {
      method: "PATCH",
    })
    if (res.ok) {
      alert("Approved successfully!")
      setCompanies(prev => prev.filter(c => c._id !== id))
    }
  }

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">Company List</h1>

      {/* Tabs */}
      <div className="flex space-x-4">
        <Button
          variant={tab === "pending" ? "default" : "outline"}
          onClick={() => setTab("pending")}
        >
          Pending (Unverified)
        </Button>
        <Button
          variant={tab === "verified" ? "default" : "outline"}
          onClick={() => setTab("verified")}
        >
          Approved (Verified)
        </Button>
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder="Search by company name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full"
      />

      {/* Company List */}
      {filteredCompanies.length === 0 ? (
        <p className="text-gray-500">No companies found.</p>
      ) : (
        filteredCompanies.map(company => (
          <div key={company._id} className="p-4 border mb-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold">{company.name}</h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Owner:</strong> {company.owner?.name || "Unknown"}
            </p>
            <p className="text-sm text-gray-600 mb-2">{company.description}</p>
            {tab === "pending" && (
              <Button onClick={() => approveCompany(company._id)}>Approve</Button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
