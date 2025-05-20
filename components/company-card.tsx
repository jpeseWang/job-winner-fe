import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CompanyCardProps {
  name: string
  logo: string
  description: string
  jobCount: number
}

export default function CompanyCard({ name, logo, description, jobCount }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-md transition">
      <div className="flex justify-center mb-4">
        <Image src={logo || "/placeholder.svg"} alt={name} width={60} height={60} className="rounded-full" />
      </div>
      <h3 className="font-semibold text-center mb-2">{name}</h3>
      <p className="text-sm text-gray-600 text-center mb-4">{description}</p>
      <div className="text-center mb-4">
        <span className="text-sm text-gray-500">{jobCount} open jobs</span>
      </div>
      <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50" asChild>
        <Link href={`/companies/${name.toLowerCase()}`}>View Jobs</Link>
      </Button>
    </div>
  )
}
