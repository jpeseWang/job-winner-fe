import Link from "next/link"
import { Star, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FeaturedTemplateCardProps {
  id: string
  name: string
  description: string
  thumbnail: string
  price: number
  rating: number
  reviewCount: number
  category: string
  isPremium: boolean
}

export function FeaturedTemplateCard({
  id,
  name,
  description,
  thumbnail,
  price,
  rating,
  reviewCount,
  category,
  isPremium,
}: FeaturedTemplateCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-2/5">
          <Link href={`/cv-marketplace/template/${id}`}>
            <img
              src={thumbnail || "/placeholder.svg"}
              alt={name}
              className="w-full h-[220px] md:h-full object-cover object-top"
            />
          </Link>
          {isPremium && <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">Premium</Badge>}
        </div>
        <CardContent className="p-6 md:w-3/5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Badge variant="outline" className="mb-2">
                {category}
              </Badge>
              <Link href={`/cv-marketplace/template/${id}`} className="hover:underline">
                <h3 className="font-semibold text-xl">{name}</h3>
              </Link>
            </div>
            <div className="font-medium text-lg">
              {price === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                <span>${price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 mb-4">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {["ATS-Friendly", "Responsive Design", "Multiple Color Schemes", "Custom Sections"].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="default" className="w-full" asChild>
              <Link href={`/cv-marketplace/template/${id}`}>Preview Template</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/cv-marketplace/template/${id}/purchase`}>{price === 0 ? "Use Free" : "Purchase"}</Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
