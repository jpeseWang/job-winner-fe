// app/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BlogCard from "@/components/about/blog-card";
import { useToast } from "@/hooks/useToast";

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
        const res = await fetch("/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setPosts(data.filter((post: Post) => post.status === "published"));
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
    (post) =>
      selectedCategory === "All" || post.category === selectedCategory
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
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Hành Trang Sự Nghiệp
          </h1>
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

      {/* Featured Post */}
      {filteredPosts[0] && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-80 md:h-auto group">
                  <Image
                    src={filteredPosts[0].featuredImage || "/placeholder.svg"}
                    alt={filteredPosts[0].title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-teal-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                      Nổi bật
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="text-gray-500 text-sm mb-3">
                    {filteredPosts[0].publishedAt
                      ? new Date(filteredPosts[0].publishedAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </div>
                  <h2 className="text-3xl font-bold mb-4 line-clamp-2">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {filteredPosts[0].excerpt}
                  </p>
                  <Link href={`/blog/${filteredPosts[0]._id}`} target="_blank">
                    <Button className="bg-teal-500 hover:bg-teal-600 w-fit">
                      Đọc bài viết
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-10">Bài viết mới nhất</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post._id}
                title={post.title}
                excerpt={post.excerpt}
                date={
                  post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                    : "N/A"
                }
                category={post.category || "General"}
                image={post.featuredImage || "/placeholder.svg"}
                id={post._id} // Thay slug bằng id
                target="_blank"
              />
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-600 mt-8">
              Không tìm thấy bài viết nào.
            </p>
          )}
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-teal-500 text-teal-600 hover:bg-teal-50"
            >
              Tải thêm bài viết
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Đăng ký nhận tin</h2>
          <p className="max-w-2xl mx-auto mb-8 text-teal-100">
            Nhận mẹo sự nghiệp, tin tức ngành, và hướng dẫn tìm việc mới nhất qua email.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              toast({
                title: "Thành công",
                description: "Đã đăng ký nhận tin!",
              });
            }}
          >

            <Button className="bg-black hover:bg-gray-800 text-white">
              Đăng ký
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}