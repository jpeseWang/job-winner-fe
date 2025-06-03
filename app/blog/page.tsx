import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import BlogCard from "@/components/about/blog-card"

export default function BlogPage() {
  const featuredPosts = [
    {
      title: "Revitalizing Workplace Morale: Innovative Tactics for Boosting Employee Engagement in 2024",
      excerpt:
        "Discover effective strategies to enhance workplace culture and improve employee satisfaction in the modern work environment.",
      date: "10 March 2024",
      category: "News",
      image: "/placeholder.svg?height=400&width=800",
      slug: "revitalizing-workplace-morale",
    },
    {
      title: "How To Avoid The Top Six Most Common Job Interview Mistakes",
      excerpt:
        "Learn how to navigate job interviews successfully by avoiding these common pitfalls that can cost you the position.",
      date: "05 March 2024",
      category: "Tips",
      image: "/placeholder.svg?height=400&width=800",
      slug: "common-interview-mistakes",
    },
    {
      title: "The Future of Remote Work: Trends to Watch in 2024",
      excerpt:
        "Explore the evolving landscape of remote work and the key trends that will shape how we work in the coming year.",
      date: "28 February 2024",
      category: "Trends",
      image: "/placeholder.svg?height=400&width=800",
      slug: "future-of-remote-work",
    },
    {
      title: "Building a Personal Brand That Gets You Noticed by Recruiters",
      excerpt:
        "Discover how to create a compelling personal brand that will make you stand out in a competitive job market.",
      date: "20 February 2024",
      category: "Career",
      image: "/placeholder.svg?height=400&width=800",
      slug: "personal-branding-for-job-seekers",
    },
    {
      title: "Salary Negotiation: How to Get the Compensation You Deserve",
      excerpt:
        "Master the art of salary negotiation with these proven strategies to ensure you're fairly compensated for your skills and experience.",
      date: "15 February 2024",
      category: "Advice",
      image: "/placeholder.svg?height=400&width=800",
      slug: "salary-negotiation-strategies",
    },
    {
      title: "AI in Recruitment: How Technology is Changing the Hiring Process",
      excerpt:
        "Explore how artificial intelligence is transforming recruitment and what it means for job seekers and employers alike.",
      date: "10 February 2024",
      category: "Technology",
      image: "/placeholder.svg?height=400&width=800",
      slug: "ai-in-recruitment",
    },
  ]

  const categories = [
    "All",
    "Career Advice",
    "Industry Trends",
    "Interview Tips",
    "Resume Writing",
    "Job Search",
    "Workplace Culture",
  ]

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Career Insights & Advice</h1>
          <p className="max-w-2xl mx-auto text-gray-300">
            Expert tips, industry trends, and career guidance to help you succeed in your professional journey.
          </p>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input placeholder="Search articles..." className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={index === 0 ? "bg-teal-500 hover:bg-teal-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image src="/placeholder.svg?height=600&width=800" alt="Featured post" fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">Featured</span>
                </div>
              </div>
              <div className="p-8">
                <div className="text-gray-500 text-sm mb-2">15 March 2024</div>
                <h2 className="text-2xl font-bold mb-4">
                  The Great Resignation: What It Means for Job Seekers in 2024
                </h2>
                <p className="text-gray-600 mb-6">
                  The pandemic-induced "Great Resignation" continues to reshape the job market. Learn how this ongoing
                  trend affects your job search and how you can leverage it to find better opportunities.
                </p>
                <Link href="/blog/great-resignation-2024">
                  <Button className="bg-teal-500 hover:bg-teal-600">Read Full Article</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <BlogCard
                key={index}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                category={post.category}
                image={post.image}
                slug={post.slug}
              />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-teal-500 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Get the latest career advice, industry insights, and job search tips delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Your email address" className="bg-white text-black" />
            <Button className="bg-black hover:bg-gray-800 text-white">Subscribe</Button>
          </div>
        </div>
      </section>
    </main>
  )
}
