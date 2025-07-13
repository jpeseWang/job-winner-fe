"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminCompanyRequestsPage() {
  const [companies, setCompanies] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/get-unverified-companies")
      .then(res => res.json())
      .then(setCompanies)
  }, [])

  const approve = async (id: string) => {
    const res = await fetch(`/api/verify-company/${id}`, { method: "PATCH" })
    if (res.ok) {
      alert("Company approved successfully.")
      setCompanies(prev => prev.filter(c => c._id !== id))
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-xl font-bold mb-6">Companies Pending Verification</h1>
      {companies.map((c) => (
        <div key={c._id} className="p-4 border mb-4 rounded">
          <h2 className="font-semibold">{c.name}</h2>
          <p>{c.description}</p>
          <Button onClick={() => approve(c._id)} className="mt-2">Approve</Button>
        </div>
      ))}
    </div>
  )
}
