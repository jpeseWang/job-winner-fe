"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function MarketplaceFilters() {
  const [priceRange, setPriceRange] = useState([0, 50])
  const [isOpen, setIsOpen] = useState({
    categories: true,
    price: true,
    features: true,
    rating: true,
  })

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <Button variant="outline" className="w-full justify-between" onClick={() => {}}>
          <span>Filters</span>
          <ChevronDown size={16} />
        </Button>
      </div>

      <div className="hidden md:block space-y-6">
        <div>
          <Collapsible open={isOpen.categories} onOpenChange={(open) => setIsOpen({ ...isOpen, categories: open })}>
            <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
              <span>Categories</span>
              <ChevronDown size={16} className={`transition-transform ${isOpen.categories ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-3">
              {[
                "Professional",
                "Creative",
                "Simple",
                "Modern",
                "Academic",
                "Executive",
                "Technical",
                "Entry Level",
              ].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={`category-${category.toLowerCase()}`} />
                  <label htmlFor={`category-${category.toLowerCase()}`} className="text-sm cursor-pointer">
                    {category}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Separator className="my-4" />
        </div>

        <div>
          <Collapsible open={isOpen.price} onOpenChange={(open) => setIsOpen({ ...isOpen, price: open })}>
            <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
              <span>Price Range</span>
              <ChevronDown size={16} className={`transition-transform ${isOpen.price ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="free-only" />
                <label htmlFor="free-only" className="text-sm cursor-pointer">
                  Free Only
                </label>
              </div>
              <div className="space-y-4">
                <Slider value={priceRange} min={0} max={50} step={1} onValueChange={setPriceRange} />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator className="my-4" />
        </div>

        <div>
          <Collapsible open={isOpen.features} onOpenChange={(open) => setIsOpen({ ...isOpen, features: open })}>
            <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
              <span>Features</span>
              <ChevronDown size={16} className={`transition-transform ${isOpen.features ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-3">
              {[
                "ATS-Friendly",
                "Responsive Design",
                "Multiple Pages",
                "Custom Sections",
                "Cover Letter",
                "Multiple Color Schemes",
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox id={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`} />
                  <label
                    htmlFor={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm cursor-pointer"
                  >
                    {feature}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Separator className="my-4" />
        </div>

        <div>
          <Collapsible open={isOpen.rating} onOpenChange={(open) => setIsOpen({ ...isOpen, rating: open })}>
            <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
              <span>Rating</span>
              <ChevronDown size={16} className={`transition-transform ${isOpen.rating ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1">& Up</span>
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Separator className="my-4" />
        </div>

        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Reset
        </Button>
      </div>
    </div>
  )
}
