import type { Metadata } from "next"
import Link from "next/link"
import { Search, Filter, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CVTemplateCard } from "@/components/cv/cv-template-card"
import { FeaturedTemplateCard } from "@/components/cv/featured-template-card"
import { CategoryCard } from "@/components/cv/category-card"
import { MarketplaceFilters } from "@/components/cv/marketplace-filters"

export const metadata: Metadata = {
  title: "CV Marketplace | Job Winner",
  description: "Browse and purchase premium CV templates to stand out from the crowd",
}

export default function CVMarketplacePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-emerald-600 py-16 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Professional CV Templates for Every Career
              </h1>
              <p className="text-white/90 text-lg">
                Stand out from the crowd with our professionally designed CV templates. Choose from hundreds of
                templates and customize to fit your needs.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-white/90">
                  Browse Templates
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-full h-full bg-white/10 rounded-lg"></div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-white/10 rounded-lg"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <img
                    src="/placeholder.svg?height=400&width=300"
                    alt="CV Template Preview"
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <Input placeholder="Search templates..." className="pl-10 w-full" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filters</span>
              </Button>
              <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="free">Free</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Browse by Category</h2>
            <Link
              href="/cv-marketplace/categories"
              className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
            >
              View all categories <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <CategoryCard
              name="Professional"
              count={42}
              icon="Briefcase"
              href="/cv-marketplace/category/professional"
            />
            <CategoryCard name="Creative" count={38} icon="Palette" href="/cv-marketplace/category/creative" />
            <CategoryCard name="Simple" count={27} icon="FileText" href="/cv-marketplace/category/simple" />
            <CategoryCard name="Modern" count={35} icon="Sparkles" href="/cv-marketplace/category/modern" />
            <CategoryCard name="Academic" count={19} icon="GraduationCap" href="/cv-marketplace/category/academic" />
            <CategoryCard name="Executive" count={23} icon="Award" href="/cv-marketplace/category/executive" />
            <CategoryCard name="Technical" count={31} icon="Code" href="/cv-marketplace/category/technical" />
            <CategoryCard name="Entry Level" count={24} icon="Star" href="/cv-marketplace/category/entry-level" />
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Templates</h2>
            <Link
              href="/cv-marketplace/featured"
              className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
            >
              View all featured <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeaturedTemplateCard
              id="template-1"
              name="Executive Pro"
              description="Perfect for senior professionals and executives looking to make a strong impression."
              thumbnail="/placeholder.svg?height=400&width=300"
              price={29.99}
              rating={4.9}
              reviewCount={124}
              category="Executive"
              isPremium={true}
            />
            <FeaturedTemplateCard
              id="template-2"
              name="Creative Edge"
              description="Stand out with this modern design perfect for creative professionals."
              thumbnail="/placeholder.svg?height=400&width=300"
              price={24.99}
              rating={4.7}
              reviewCount={98}
              category="Creative"
              isPremium={true}
            />
          </div>
        </div>
      </section>

      {/* All Templates */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <MarketplaceFilters />
            </div>

            {/* Templates Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">All Templates</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                  <select className="text-sm border rounded p-1">
                    <option>Popularity</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <CVTemplateCard
                    key={`template-${i + 3}`}
                    id={`template-${i + 3}`}
                    name={
                      [
                        "Professional Plus",
                        "Modern Minimal",
                        "Creative Edge",
                        "Executive Suite",
                        "Technical Pro",
                        "Academic Standard",
                        "Entry Level",
                        "Designer Portfolio",
                        "Developer CV",
                      ][i % 9]
                    }
                    thumbnail="/placeholder.svg?height=300&width=220"
                    price={i % 3 === 0 ? 0 : 19.99 + i * 2}
                    rating={4 + Math.random() * 1}
                    reviewCount={20 + Math.floor(Math.random() * 100)}
                    category={
                      [
                        "Professional",
                        "Modern",
                        "Creative",
                        "Executive",
                        "Technical",
                        "Academic",
                        "Entry Level",
                        "Creative",
                        "Technical",
                      ][i % 9]
                    }
                    isPremium={i % 3 !== 0}
                  />
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button variant="outline" size="lg">
                  Load More Templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The templates are professionally designed and helped me land my dream job. Worth every penny!",
                author: "Sarah Johnson",
                role: "Marketing Director",
                rating: 5,
              },
              {
                quote: "I was struggling with my CV until I found these templates. Easy to use and looks great!",
                author: "Michael Chen",
                role: "Software Engineer",
                rating: 5,
              },
              {
                quote: "The premium templates really stand out. I received more interview calls after using one.",
                author: "Emma Rodriguez",
                role: "Financial Analyst",
                rating: 4,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      className={`w-5 h-5 ${starIndex < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-emerald-600">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Create Your Professional CV?
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Choose from our collection of premium templates and create a CV that stands out. Get hired faster with a
            professionally designed CV.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-white/90">
              Browse Templates
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                question: "What's the difference between free and premium templates?",
                answer:
                  "Premium templates offer more advanced designs, additional sections, and customization options. They also include priority support and updates.",
              },
              {
                question: "Can I customize the templates?",
                answer:
                  "Yes, all templates are fully customizable. You can change colors, fonts, layouts, and add or remove sections to fit your needs.",
              },
              {
                question: "How do I download my CV after creating it?",
                answer:
                  "Once you've completed your CV, you can download it as a PDF, Word document, or HTML file from your dashboard.",
              },
              {
                question: "Do you offer refunds if I'm not satisfied?",
                answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase.",
              },
              {
                question: "Can I use the templates for multiple CVs?",
                answer:
                  "Yes, once you purchase a template, you can use it to create multiple CVs for your personal use.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
