import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "HR Director",
    company: "TechCorp Inc.",
    plan: "Premium",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The premium plan has transformed our hiring process. The AI-powered candidate matching saves us hours of screening time, and the advanced analytics help us optimize our job postings for better results.",
    results: "50% faster hiring process",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "Freelancer",
    plan: "Premium",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "As a job seeker, the premium CV templates and featured proposals feature gave me a significant advantage. I landed my dream job within 2 weeks of upgrading to premium!",
    results: "Dream job in 2 weeks",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Talent Acquisition Manager",
    company: "StartupXYZ",
    plan: "Basic",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Perfect for our growing startup. The basic plan gives us everything we need - 20 job postings per month and advanced analytics. Great value for money!",
    results: "200% increase in quality applications",
  },
  {
    id: 4,
    name: "David Park",
    role: "Marketing Manager",
    company: "Job Seeker",
    plan: "Premium",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The career coaching resources and salary insights are incredibly valuable. The premium plan paid for itself with my salary negotiation alone!",
    results: "15% salary increase",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Recruitment Lead",
    company: "Global Solutions",
    plan: "Premium",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The dedicated account manager and white-label solutions have been game-changers for our recruitment agency. Highly recommend the premium plan for serious recruiters.",
    results: "300% client satisfaction",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Recent Graduate",
    company: "Job Seeker",
    plan: "Free",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4,
    content:
      "Even the free plan is fantastic! I was able to create a professional CV and apply to multiple jobs. The platform is user-friendly and the job alerts are very helpful.",
    results: "First job secured",
  },
]

export default function PricingTestimonials() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Don't just take our word for it. Here's what real users say about our platform and how it's helped them
          achieve their goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Quote className="h-8 w-8 text-blue-600 opacity-50" />
                <Badge
                  variant={
                    testimonial.plan === "Premium" ? "default" : testimonial.plan === "Basic" ? "secondary" : "outline"
                  }
                  className="text-xs"
                >
                  {testimonial.plan} Plan
                </Badge>
              </div>

              <div className="flex items-center mb-2">{renderStars(testimonial.rating)}</div>

              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-sm font-semibold text-green-800">Result: {testimonial.results}</p>
              </div>

              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
          <div className="flex items-center">{renderStars(5)}</div>
          <span className="text-blue-800 font-semibold">4.9/5</span>
          <span className="text-blue-600">from 2,500+ reviews</span>
        </div>
      </div>
    </div>
  )
}
