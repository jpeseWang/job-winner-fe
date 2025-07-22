"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"

export default function CreateCompanyPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [form, setForm] = useState({
    name: "",
    description: "",
    industry: "",
    size: "",
    headquarters: "",
    website: "",
    logo: "",
    owner: "",
  })

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setForm(prev => ({ ...prev, owner: session.user.id }))
    }
  }, [session, status])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.owner) {
      toast.error("Unable to determine company creator.")
      return
    }

    const res = await fetch("/api/company/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      toast.success("Company created successfully 🎉")
      router.push("/dashboard/admin/companies")
    } else {
      toast.error("Failed to create company")
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800"> Add New Company</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Company Name" value={form.name} onChange={handleChange} required />
        <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <Input name="industry" placeholder="Industry" value={form.industry} onChange={handleChange} required />
        <Input name="size" placeholder="Company Size (e.g., 1-10, 11-50...)" value={form.size} onChange={handleChange} required />
        <Input name="headquarters" placeholder="Headquarters" value={form.headquarters} onChange={handleChange} required />
        <Input name="website" placeholder="Website" value={form.website} onChange={handleChange} />
        <Input name="logo" placeholder="Logo URL" value={form.logo} onChange={handleChange} />
        <Button type="submit" className="w-full" disabled={status !== "authenticated"}>
          Create Company
        </Button>
      </form>
    </div>
  )
}
