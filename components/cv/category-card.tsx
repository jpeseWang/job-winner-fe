import Link from "next/link"
import { Briefcase, Palette, FileText, Sparkles, GraduationCap, Award, Code, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  name: string
  count: number
  icon: string
  href: string
}

export function CategoryCard({ name, count, icon, href }: CategoryCardProps) {
  const getIcon = (iconName: string) => {
    const props = { className: "h-6 w-6 text-emerald-600 dark:text-emerald-400" }

    switch (iconName) {
      case "Briefcase":
        return <Briefcase {...props} />
      case "Palette":
        return <Palette {...props} />
      case "FileText":
        return <FileText {...props} />
      case "Sparkles":
        return <Sparkles {...props} />
      case "GraduationCap":
        return <GraduationCap {...props} />
      case "Award":
        return <Award {...props} />
      case "Code":
        return <Code {...props} />
      case "Star":
        return <Star {...props} />
      default:
        return <FileText {...props} />
    }
  }

  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-all cursor-pointer h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4">{getIcon(icon)}</div>
          <h3 className="font-medium mb-1">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{count} templates</p>
        </CardContent>
      </Card>
    </Link>
  )
}
