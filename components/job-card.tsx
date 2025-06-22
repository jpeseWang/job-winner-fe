import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Briefcase, DollarSign, Tags, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JobCardProps {
  id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  experienceLevel: string
  salary: string
  postedDays: number
  logo: string
  hideButton?: boolean
}

export default function JobCard({
  id,
  title,
  company,
  location,
  type,
  category,
  experienceLevel,
  salary,
  postedDays,
  logo,
  hideButton
}: JobCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Image src={logo || "/placeholder.svg"} alt={company} width={50} height={50} className="rounded-full" />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-gray-600 text-sm">{company}</p>
            </div>
            <div className="text-xs text-gray-500">
              {postedDays} day{postedDays !== 1 ? "s" : ""} ago
            </div>
          </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Tags className="h-4 w-4 text-gray-400" />
                <span>{category}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{type}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <BarChart className="h-4 w-4 text-gray-400" />
                <span>{experienceLevel}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>{salary}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>Apply by {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
            </div>
        </div>

        {!hideButton && (
          <div className="flex-shrink-0">
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600" asChild>
              <Link href={`/jobs/${id}`}>View Job</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
