"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Loader2, User, Clock } from "lucide-react";
import DOMPurify from "dompurify";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";

interface Comment {
  user: { _id: string; name: string; email: string } | null;
  content: string;
  createdAt: string;
  isApproved: boolean;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: { _id: string; name: string; email: string } | null;
  publishedAt?: string;
  views: number;
  likes: number;
  categories: string[];
  tags: string[];
  comments: Comment[];
  status: "draft" | "published" | "archived";
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);

  // Validate MongoDB ObjectId
  const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  useEffect(() => {
    async function fetchPost() {
      try {
        const { id } = await params;
        if (!isValidObjectId(id)) {
          throw new Error("Invalid post ID");
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`/api/blogs/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          const text = await res.text();
          try {
            const error = JSON.parse(text);
            throw new Error(error.error || "Failed to fetch post");
          } catch {
            throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
          }
        }

        const data = await res.json();
        if (data.status !== "published") {
          throw new Error("Post not published");
        }
        setPost(data);
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
            description: error.message || "Failed to fetch post",
            variant: "destructive",
          });
        }
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [params, toast]);

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please log in to like this post",
        variant: "destructive",
      });
      return;
    }
    if (!post) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`/api/blogs/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || "Failed to like post");
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }

      const data = await res.json();
      setPost((prev) => (prev ? { ...prev, likes: data.likes } : null));
      setLiked(true);
      toast({
        title: "Success",
        description: "Post liked successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    if (!post) return;

    setIsSubmitting(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`/api/blogs/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || "Failed to post comment");
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }

      const data = await res.json();
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, data.comment],
            }
          : null
      );
      setComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" aria-label="Loading post" />
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Featured Image */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={post.featuredImage || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover brightness-75"
          sizes="100vw"
          priority
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-4 md:px-6">
          <div className="container mx-auto">
            <Badge className="bg-teal-500 text-white mb-4">
              {post.categories?.join(", ") || "Uncategorized"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex flex-col sm:flex-row gap-4 text-white text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" aria-hidden="true" />
                <span>{post.author?.name || "Unknown Author"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US")
                    : "Not published"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" aria-hidden="true" />
                <span>{post.likes} Likes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>{post.comments.length} Comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div
            className="prose prose-teal prose-lg max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-teal-500 text-teal-600"
                aria-label={`Tag: ${tag}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <Button
              onClick={handleLike}
              disabled={liked || !session || isSubmitting}
              className={`${
                liked ? "bg-gray-300" : "bg-teal-500 hover:bg-teal-600"
              } flex items-center gap-2`}
              aria-label={liked ? "Post already liked" : "Like this post"}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} aria-hidden="true" />
              Like ({post.likes})
            </Button>
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <Textarea
              placeholder="Write your comment..."
              className="w-full mb-4 rounded-lg border-gray-300 focus:ring-teal-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!session || isSubmitting}
              maxLength={500}
              aria-label="Enter your comment"
            />
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600"
              disabled={!session || isSubmitting}
              aria-label="Post comment"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
              ) : (
                <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              Post Comment
            </Button>
            {!session && (
              <p className="text-sm text-gray-600 mt-2" aria-live="polite">
                Please log in to comment.
              </p>
            )}
          </form>
          {post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment, index) => (
                <div
                  key={index}
                  className="border-l-4 border-teal-200 pl-4 py-3 bg-white rounded-r-lg shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span className="font-medium">{comment.user?.name || "Unknown User"}</span>
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>{new Date(comment.createdAt).toLocaleDateString("en-US")}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}