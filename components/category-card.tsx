import Link from "next/link"
import { Leaf, Factory, ShoppingBag, HardHat, Hotel, GraduationCap, Landmark, Truck } from "lucide-react"

interface CategoryCardProps {
  icon: string
  title: string
  jobCount: number
}

export default function CategoryCard({ icon, title, jobCount }: CategoryCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "leaf":
        return <Leaf className="h-6 w-6 text-teal-500" />
      case "factory":
        return <Factory className="h-6 w-6 text-teal-500" />
      case "shopping-bag":
        return <ShoppingBag className="h-6 w-6 text-teal-500" />
      case "hard-hat":
        return <HardHat className="h-6 w-6 text-teal-500" />
      case "hotel":
        return <Hotel className="h-6 w-6 text-teal-500" />
      case "graduation-cap":
        return <GraduationCap className="h-6 w-6 text-teal-500" />
      case "landmark":
        return <Landmark className="h-6 w-6 text-teal-500" />
      case "truck":
        return <Truck className="h-6 w-6 text-teal-500" />
      default:
        return <Leaf className="h-6 w-6 text-teal-500" />
    }
  }

  return (
    <Link href={`/jobs/category/${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition">
        <div className="flex justify-center mb-4 text-gray-500">{getIcon()}</div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{jobCount} jobs</p>
      </div>
    </Link>
  )
}
