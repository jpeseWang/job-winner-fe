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
  const [ownerId, setOwnerId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    description: "",
    industry: "",
    size: "",
    headquarters: "",
    website: "",
    logo: "",
    owner: "", // sẽ set sau khi có session
  })

  // Cập nhật owner khi session sẵn sàng
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setOwnerId(session.user.id)
      setForm(prev => ({ ...prev, owner: session.user.id }))
    }
  }, [session, status])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.owner) {
      toast.error("Không thể xác định người tạo công ty.")
      return
    }

    const res = await fetch("/api/create-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      toast.success("Đã tạo công ty mới 🎉")
      router.push("/dashboard/admin/companies")
    } else {
      toast.error("Tạo công ty thất bại")
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">➕ Thêm công ty mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Tên công ty" value={form.name} onChange={handleChange} required />
        <Textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} required />
        <Input name="industry" placeholder="Ngành nghề" value={form.industry} onChange={handleChange} required />
        <Input name="size" placeholder="Quy mô (VD: 1-10, 11-50...)" value={form.size} onChange={handleChange} required />
        <Input name="headquarters" placeholder="Trụ sở chính" value={form.headquarters} onChange={handleChange} required />
        <Input name="website" placeholder="Website" value={form.website} onChange={handleChange} />
        <Input name="logo" placeholder="Link logo" value={form.logo} onChange={handleChange} />
        <Button type="submit" className="w-full" disabled={status !== "authenticated"}>
          Tạo công ty
        </Button>
      </form>
    </div>
  )
}
