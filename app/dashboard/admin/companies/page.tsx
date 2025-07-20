"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

export default function AdminCompanyManagerPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tab, setTab] = useState<"pending" | "verified">("pending")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const endpoint =
          tab === "pending" ? "/api/get-unverified-companies" : "/api/get-verified-companies"
        const res = await fetch(endpoint)
        const data = await res.json()
        setCompanies(data)
      } catch (err) {
        toast.error("Lỗi khi tải danh sách công ty")
      }
      setLoading(false)
    }

    fetchCompanies()
  }, [tab])

  const approveCompany = async (id: string) => {
    const res = await fetch(`/api/verify-company/${id}`, { method: "PATCH" })
    if (res.ok) {
      toast.success("✅ Duyệt thành công!")
      setCompanies(prev => prev.filter(c => c._id !== id))
    }
  }

  const deleteCompany = async (id: string) => {
    if (confirm("Bạn có chắc muốn xoá công ty này?")) {
      const res = await fetch(`/api/delete-company/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("🗑 Đã xoá công ty.")
        setCompanies(prev => prev.filter(c => c._id !== id))
      }
    }
  }

  const disableCompany = async (id: string) => {
    const res = await fetch(`/api/disable-company/${id}`, { method: "PATCH" })
    if (res.ok) {
      toast.success("🚫 Đã vô hiệu hoá công ty.")
      setCompanies(prev =>
        prev.map(c => (c._id === id ? { ...c, isVerified: false } : c))
      )
    }
  }


const viewDetails = (company: any) => {
  if (!company?._id) {
    toast.error("Không tìm thấy ID công ty")
    return
  }

  router.push(`/dashboard/admin/companies/${company._id}`)
}

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto my-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách công ty</h1>
        <Button onClick={() => router.push("/dashboard/admin/companies/create")}>
          ➕ Thêm công ty
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        <Button
          variant={tab === "pending" ? "default" : "outline"}
          onClick={() => setTab("pending")}
        >
          ⏳ Chờ duyệt
        </Button>
        <Button
          variant={tab === "verified" ? "default" : "outline"}
          onClick={() => setTab("verified")}
        >
          ✅ Đã duyệt
        </Button>
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder="🔍 Tìm theo tên công ty..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Logo</th>
              <th className="p-2 text-left">Tên công ty</th>
              <th className="p-2 text-left">Chủ sở hữu</th>
              <th className="p-2 text-left">Mô tả</th>
              <th className="p-2 text-left">Trạng thái</th>
              <th className="p-2 text-left">Ngày đăng</th>
              <th className="p-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Không tìm thấy công ty nào.
                </td>
              </tr>
            ) : (
              filteredCompanies.map(company => (
                <tr key={company._id} className="border-t">
                  <td className="p-2">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt="logo"
                        className="w-10 h-10 object-contain rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Không có</span>
                    )}
                  </td>
                  <td className="p-2 font-semibold">{company.name}</td>
                  <td className="p-2">{company.owner?.name || "Không rõ"}</td>
                  <td className="p-2 text-sm text-gray-600">{company.description}</td>
                  <td className="p-2">
                    {company.isVerified ? (
                      <span className="text-green-600 font-medium">Đã duyệt</span>
                    ) : (
                      <span className="text-yellow-500 font-medium">Chờ duyệt</span>
                    )}
                  </td>
                  <td className="p-2">
                    {new Date(company.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => viewDetails(company)}>
                          Xem chi tiết
                        </DropdownMenuItem>
                        {!company.isVerified && (
                          <DropdownMenuItem onClick={() => approveCompany(company._id)}>
                            Duyệt công ty
                          </DropdownMenuItem>
                        )}
                        {company.isVerified && (
                          <DropdownMenuItem onClick={() => disableCompany(company._id)}>
                            Vô hiệu hoá
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => deleteCompany(company._id)}>
                          Xoá công ty
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
