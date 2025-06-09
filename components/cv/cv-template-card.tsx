import Link from "next/link"
import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface CVTemplateCardProps {
  id: string
  name: string
  thumbnail: string
  price: number
  rating: number
  reviewCount: number
  category: string
  isPremium: boolean
}

export function CVTemplateCard({
  id,
  name,
  thumbnail,
  price,
  rating,
  reviewCount,
  category,
  isPremium,
}: CVTemplateCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/cv-marketplace/template/${id}`}>
          <img src={thumbnail || "/placeholder.svg"} alt={name} className="w-full h-[220px] object-cover object-top" />
        </Link>
        {isPremium && <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">Premium</Badge>}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/cv-marketplace/template/${id}`} className="hover:underline">
            <h3 className="font-semibold text-lg">{name}</h3>
          </Link>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span>
        </div>
        <div className="font-medium">
          {price === 0 ? (
            <span className="text-green-600 dark:text-green-400">Free</span>
          ) : (
            <span>${price.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="default" size="sm" className="w-full" asChild>
          <Link href={`/cv-marketplace/template/${id}`}>{price === 0 ? "Use Template" : "Preview"}</Link>
        </Button>
        {price > 0 && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/cv-marketplace/template/${id}/purchase`}>Purchase</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
