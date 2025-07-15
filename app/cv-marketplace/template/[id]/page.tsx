import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Star, Check, Eye, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CVTemplateCard } from "@/components/cv/cv-template-card"

export const metadata: Metadata = {
  title: "Template Details | CV Marketplace | Job Winner",
  description: "View and purchase premium CV templates",
}

export default function TemplateDetailsPage({ params }: { params: { id: string } }) {
  // Mock data - in a real app, you would fetch this from an API
  const template = {
    id: params.id,
    name: "Executive Pro",
    description:
      "Perfect for senior professionals and executives looking to make a strong impression. This template highlights your leadership experience and achievements in a clean, professional layout.",
    longDescription:
      "The Executive Pro template is designed specifically for senior professionals, executives, and leaders who want to make a powerful impression with their CV. This premium template features a sophisticated design with a perfect balance of white space and content, making it easy for recruiters to scan and find the information they need.\n\nThe template includes dedicated sections for your executive summary, leadership experience, key achievements, and professional skills. It's fully customizable, allowing you to add or remove sections as needed to showcase your unique qualifications.",
    thumbnail: "/placeholder.svg?height=600&width=400",
    price: 29.99,
    rating: 4.9,
    reviewCount: 124,
    category: "Executive",
    isPremium: true,
    features: [
      "ATS-Friendly Design",
      "Multiple Color Schemes",
      "Matching Cover Letter",
      "Reference Page",
      "Custom Sections",
      "Lifetime Updates",
      "Priority Support",
    ],
    reviews: [
      {
        id: "review-1",
        author: "James Wilson",
        rating: 5,
        date: "2023-10-15",
        content:
          "This template helped me land interviews at three Fortune 500 companies. The design is professional and stands out without being flashy. Highly recommend for executive positions.",
      },
      {
        id: "review-2",
        author: "Linda Chen",
        rating: 5,
        date: "2023-09-22",
        content:
          "Worth every penny. I received compliments on my CV from every recruiter I spoke with. The template is easy to customize and looks very professional.",
      },
      {
        id: "review-3",
        author: "Robert Johnson",
        rating: 4,
        date: "2023-08-30",
        content:
          "Great template with a clean design. I would have liked a few more color options, but overall very satisfied with my purchase.",
      },
    ],
    relatedTemplates: [
      {
        id: "template-2",
        name: "Corporate Leader",
        thumbnail: "/placeholder.svg?height=300&width=220",
        price: 24.99,
        rating: 4.7,
        reviewCount: 98,
        category: "Executive",
        isPremium: true,
      },
      {
        id: "template-3",
        name: "Professional Plus",
        thumbnail: "/placeholder.svg?height=300&width=220",
        price: 19.99,
        rating: 4.8,
        reviewCount: 112,
        category: "Professional",
        isPremium: true,
      },
      {
        id: "template-4",
        name: "Modern Executive",
        thumbnail: "/placeholder.svg?height=300&width=220",
        price: 27.99,
        rating: 4.6,
        reviewCount: 87,
        category: "Executive",
        isPremium: true,
      },
    ],
  }

  return (
    <main className="min-h-screen py-8 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/cv-marketplace"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img src={template.thumbnail || "/placeholder.svg"} alt={template.name} className="w-full h-auto" />
                {template.isPremium && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600">Premium</Badge>
                )}
              </div>

              <div className="p-6">
                <Tabs defaultValue="preview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({template.reviews.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="flex justify-center">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Eye size={16} />
                        <span>View Full Preview</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <img
                          key={i}
                          src={`/placeholder.svg?height=150&width=100&text=Section ${i}`}
                          alt={`Template section ${i}`}
                          className="w-full h-auto rounded border border-gray-200 dark:border-gray-700"
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{template.longDescription}</p>

                      <h3 className="text-lg font-semibold mt-6 mb-3">Template Features</h3>
                      <ul className="space-y-2">
                        {template.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-lg font-semibold mt-6 mb-3">What's Included</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>CV Template (HTML format)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Matching Cover Letter Template</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Reference Page Template</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>User Guide & Tips</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="text-3xl font-bold">{template.rating.toFixed(1)}</div>
                      <div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < Math.floor(template.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Based on {template.reviewCount} reviews
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {template.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{review.author}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{review.date}</div>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">{review.content}</p>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full">
                      Load More Reviews
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Template Info & Purchase */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {template.category}
                </Badge>
                <h1 className="text-2xl font-bold mb-2">{template.name}</h1>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{template.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({template.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
              </div>

              <div className="mb-6">
                <div className="text-2xl font-bold mb-4">
                  {template.price === 0 ? (
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  ) : (
                    <span>${template.price.toFixed(2)}</span>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full flex items-center justify-center gap-2" size="lg">
                    <ShoppingCart size={18} />
                    {template.price === 0 ? "Get Free Template" : "Purchase Template"}
                  </Button>

                  <Button variant="outline" className="w-full flex items-center justify-center gap-2" size="lg">
                    <Eye size={18} />
                    Try with Your Data
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-semibold">Key Features</h3>
                <ul className="space-y-2">
                  {template.features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Templates */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {template.relatedTemplates.map((relatedTemplate) => (
              <CVTemplateCard
                key={relatedTemplate.id}
                id={relatedTemplate.id}
                name={relatedTemplate.name}
                thumbnail={relatedTemplate.thumbnail}
                price={relatedTemplate.price}
                rating={relatedTemplate.rating}
                reviewCount={relatedTemplate.reviewCount}
                category={relatedTemplate.category}
                isPremium={relatedTemplate.isPremium}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
