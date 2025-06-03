import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface BlogCardProps {
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  slug: string
}

export default function BlogCard({ title, excerpt, date, category, image, slug }: BlogCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg?height=300&width=600"}
          alt={title}
          width={600}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">{category}</span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="text-gray-500 text-sm mb-2">{date}</div>
        <h3 className="font-bold text-xl mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <Link href={`/blog/${slug}`} className="text-teal-500 font-medium hover:text-teal-600">
          Read More
        </Link>
      </CardContent>
    </Card>
  )
}
