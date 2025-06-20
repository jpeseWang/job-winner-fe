"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BlogCard from "@/components/about/blog-card";
import { useToast } from "@/hooks/use-toast";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  status: string;
  featuredImage: string;
  slug: string;
  publishedAt?: string;
}

export default function BlogPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "All",
    "Career Advice",
    "Industry Trends",
    "Interview Tips",
    "Resume Writing",
    "Job Search",
    "Workplace Culture",
  ];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await res.json();
        setPosts(data.filter((post: Post) => post.status === "published"));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load blogs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          {posts[0] && (
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={posts[0].featuredImage || "/placeholder.svg?height=600&width=800"}
                    alt={posts[0].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">Featured</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-gray-500 text-sm mb-2">
                    {posts[0].publishedAt ? new Date(posts[0].publishedAt).toLocaleDateString() : "N/A"}
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{posts[0].title}</h2>
                  <p className="text-gray-600 mb-6">{posts[0].excerpt}</p>
                  <Link href={`/blog/${posts[0].slug}`}>
                    <Button className="bg-teal-500 hover:bg-teal-600">Read Full Article</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                title={post.title}
                excerpt={post.excerpt}
                date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "N/A"}
                category={post.status}
                image={post.featuredImage || "/placeholder.svg?height=400&width=800"}
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
  );
}