import Link from "next/link"
import { Cpu, RadioTower, Stethoscope, GraduationCap, Hotel, Factory, Wrench, Landmark} from "lucide-react"

interface CategoryCardProps {
  icon: string
  title: string
  jobCount: number
}

export default function CategoryCard({ icon, title, jobCount }: CategoryCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "cpu":
        return <Cpu className="h-6 w-6 text-teal-500" />
      case "radio-tower":
        return <RadioTower className="h-6 w-6 text-teal-500" />
      case "stethoscope":
        return <Stethoscope className="h-6 w-6 text-teal-500" />
      case "graduation-cap":
        return <GraduationCap className="h-6 w-6 text-teal-500" />
      case "hotel":
        return <Hotel className="h-6 w-6 text-teal-500" />
      case "factory":
        return <Factory className="h-6 w-6 text-teal-500" />
      case "wrench":
        return <Wrench className="h-6 w-6 text-teal-500" />
      case "landmark":
        return <Landmark className="h-6 w-6 text-teal-500" />
      default:
        return <Cpu className="h-6 w-6 text-teal-500" />
    }
  }

  return (
    <Link
      href={{
        pathname: "/jobs",
        query: { category: title },
      }}
    >
      <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition cursor-pointer">
        <div className="flex justify-center mb-4">{getIcon()}</div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{jobCount} jobs</p>
      </div>
    </Link>
  )
}
