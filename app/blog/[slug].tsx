"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  status: string;
  featuredImage: string;
  slug: string;
  publishedAt?: string;
  author: { name: string; email: string };
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (!res.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data = await res.json();
        if (data.status !== "published") {
          throw new Error("Blog not published");
        }
        setPost(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        router.push("/blog");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [slug, toast, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Blog not found</div>;
  }

  return (
    <main className="flex flex-col min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <Link href="/blog">
          <Button variant="outline" className="mb-6">
            Back to Blog
          </Button>
        </Link>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.featuredImage && (
            <div className="relative h-96">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-6">
              <span>By {post.author?.name || "Unknown"}</span>
              <span className="mx-2">•</span>
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "N/A"}</span>
            </div>
            <p className="text-gray-600 mb-6">{post.excerpt}</p>
            <div className="prose max-w-none">{post.content || "No content available"}</div>
          </div>
        </article>
      </div>
    </main>
  );
}