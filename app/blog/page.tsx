"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BlogList from "@/components/blog/BlogList";
import { useToast } from "@/hooks/use-toast";
import { getBlogPosts } from "@/services/blogService";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  status: string;
  featuredImage: string;
  slug: string;
  publishedAt?: string;
  category?: string;
}

export default function BlogPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
        setIsLoading(true);
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không tải được bài viết",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [toast]);

  const filteredPosts = posts.filter(
    (post) => selectedCategory === "All" || post.category === selectedCategory
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white py-24">
        <div className="container mx-auto px-4 text-center animate-in fade-in-50 duration-500">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Hành Trang Sự Nghiệp</h1>
          <p className="max-w-2xl mx-auto text-xl text-teal-100">
            Khám phá mẹo hay, xu hướng ngành nghề, và hướng dẫn để chinh phục công việc mơ ước.
          </p>
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </section>

      {/* Categories */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={
                  selectedCategory === category
                    ? "bg-teal-500 hover:bg-teal-600 text-white"
                    : "border-gray-300 hover:bg-teal-50"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-10">Bài viết mới nhất</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogList posts={filteredPosts} />
          </div>
        </div>
      </section>
    </main>
  );
}
