"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import BlogCard from "@/components/about/blog-card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  status: string;
  featuredImage: string;
  slug: string;
  publishedAt?: string;
  categories: string[];
}

export default function BlogPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [email, setEmail] = useState("");
  const limit = 9;

  const categories = [
    "All",
    "Career Advice",
    "Industry Trends",
    "Interview Tips",
    "Resume Writing",
    "Job Search",
    "Workplace Culture",
  ];

  // Validate MongoDB ObjectId
  const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Fetch blog posts
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`/api/blogs?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          const text = await res.text();
          try {
            const error = JSON.parse(text);
            throw new Error(error.error || "Failed to fetch posts");
          } catch {
            throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
          }
        }
        const data = await res.json();
        const filteredBlogs = (data.blogs || []).filter(
          (post: Post) => post.status === "published" && isValidObjectId(post._id)
        );
        if (page === 1) {
          setPosts(filteredBlogs);
        } else {
          setPosts((prev) => [...prev, ...filteredBlogs]);
        }
        setTotalPages(Math.ceil(data.total / limit));
      } catch (error: any) {
        if (error.name === "AbortError") {
          setError("Request timed out");
          toast({
            title: "Error",
            description: "Request timed out",
            variant: "destructive",
          });
        } else {
          setError(error.message);
          toast({
            title: "Error",
            description: error.message || "Failed to fetch posts",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [page, toast]);

  // Filter posts by category
  const filteredPosts = posts.filter(
    (post) =>
      isValidObjectId(post._id) &&
      (selectedCategory === "All" || post.categories?.includes(selectedCategory))
  );

  // Handle load more posts
  const handleLoadMore = async () => {
    if (page >= totalPages) return;
    setIsLoadingMore(true);
    setPage((prev) => prev + 1);
    setIsLoadingMore(false);
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || "Failed to subscribe");
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }

      toast({
        title: "Success",
        description: "Subscribed successfully! Check your email.",
      });
      setEmail("");
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast({
          title: "Error",
          description: "Request timed out",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to subscribe",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2
          className="h-8 w-8 animate-spin text-teal-500"
          aria-label="Loading posts"
        />
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mx-auto max-w-4xl mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white py-24">
        <div className="container mx-auto px-4 text-center animate-in fade-in-50 duration-500">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Career Insights
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-teal-100">
            Discover tips, industry trends, and guides to land your dream job.
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
                aria-label={`Filter posts by ${category} category`}
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
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-teal-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="text-gray-500 text-sm mb-3">
                    {filteredPosts[0].publishedAt
                      ? new Date(filteredPosts[0].publishedAt).toLocaleDateString("en-US")
                      : "Not published"}
                  </div>
                  <h2 className="text-3xl font-bold mb-4 line-clamp-2">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {filteredPosts[0].excerpt}
                  </p>
                  <Link href={`/blog/${filteredPosts[0]._id}`} target="_blank">
                    <Button
                      className="bg-teal-500 hover:bg-teal-600 w-fit"
                      aria-label={`Read post ${filteredPosts[0].title}`}
                    >
                      Read Post
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
          <h2 className="text-3xl font-bold mb-10">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post._id}
                title={post.title}
                excerpt={post.excerpt}
                date={
                  post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US")
                    : "Not published"
                }
                category={post.categories?.join(", ") || "General"}
                image={post.featuredImage || "/placeholder.svg"}
                id={post._id}
                target="_blank"
              />
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-600 mt-8">
              No posts found.
            </p>
          )}
          {page < totalPages && (
            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-teal-500 text-teal-600 hover:bg-teal-50"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                aria-label="Load more posts"
              >
                {isLoadingMore ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : null}
                Load More
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="max-w-2xl mx-auto mb-8 text-teal-100">
            Get career tips, industry news, and job search guides delivered to your inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            onSubmit={handleNewsletterSubmit}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-black border-none focus:ring-2 focus:ring-teal-300"
              required
              aria-label="Email for newsletter subscription"
            />
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}