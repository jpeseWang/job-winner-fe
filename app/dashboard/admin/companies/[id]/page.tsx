import { notFound } from "next/navigation"
import dbConnect from "@/lib/db"
import Company from "@/models/Company"

interface CompanyType {
  _id: string
  name: string
  description: string
  industry: string
  size: string
  headquarters: string
  website?: string
  logo?: string
  isVerified: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  await dbConnect()

  const rawCompany = await Company.findById(params.id).lean()
  if (!rawCompany) return notFound()

  const company = rawCompany as unknown as CompanyType

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
      <div className="border rounded-lg shadow-sm p-6 bg-white">
        <div className="flex items-center space-x-6">
          {company.logo ? (
            <img src={company.logo} alt="Logo công ty" className="w-24 h-24 object-contain rounded-md border" />
          ) : (
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-md text-gray-500 border">
              No Logo
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-sm text-gray-500">
              {company.isVerified ? "✅ Đã xác minh" : "⏳ Chưa xác minh"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p><span className="font-semibold">Ngành nghề:</span> {company.industry}</p>
            <p><span className="font-semibold">Quy mô:</span> {company.size}</p>
            <p><span className="font-semibold">Trụ sở:</span> {company.headquarters}</p>
          </div>
          <div>
            {company.website && (
              <p>
                <span className="font-semibold">Website:</span>{" "}
                <a href={company.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {company.website}
                </a>
              </p>
            )}
            <p>
              <span className="font-semibold">Ngày tạo:</span>{" "}
              {new Date(company.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Giới thiệu</h2>
          <p className="text-gray-800 whitespace-pre-line">{company.description}</p>
        </div>
      </div>
    </div>
  )
}
