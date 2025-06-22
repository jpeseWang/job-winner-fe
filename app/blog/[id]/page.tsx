// app/blog/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Loader2, User, Clock } from "lucide-react";
import DOMPurify from "dompurify";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: { name: string };
  publishedAt: string;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  comments: { user: { name: string }; content: string; createdAt: string; isApproved: boolean }[];
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blogs/${params.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
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
    fetchPost();
  }, [params.id, toast]);

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thích bài viết",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch(`/api/blogs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to like post");
      const data = await res.json();
      setPost((prev) => (prev ? { ...prev, likes: data.likes } : null));
      setLiked(true);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thích bài viết",
        variant: "destructive",
      });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để bình luận",
        variant: "destructive",
      });
      return;
    }
    if (!comment.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung bình luận",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      if (!res.ok) throw new Error("Failed to submit comment");
      const data = await res.json();
      setPost((prev) => (prev ? { ...prev, comments: [...prev.comments, data.comment] } : null));
      setComment("");
      toast({
        title: "Thành công",
        description: "Bình luận đã được gửi",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi bình luận",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
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
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-4 md:px-6">
          <div className="container mx-auto">
            <Badge className="bg-teal-500 text-white mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 text-white text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{post.likes} Lượt thích</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.length} Bình luận</span>
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
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <Button
              onClick={handleLike}
              disabled={liked || !session}
              className={`${
                liked ? "bg-gray-300" : "bg-teal-500 hover:bg-teal-600"
              } flex items-center gap-2`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
              Thích ({post.likes})
            </Button>
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8">Bình luận</h2>
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <Textarea
              placeholder="Viết bình luận của bạn..."
              className="w-full mb-4 rounded-lg border-gray-300 focus:ring-teal-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!session || isSubmitting}
            />
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600"
              disabled={!session || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MessageCircle className="h-4 w-4 mr-2" />
              )}
              Gửi bình luận
            </Button>
            {!session && (
              <p className="text-sm text-gray-600 mt-2">
                Vui lòng đăng nhập để bình luận.
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
                    <User className="h-4 w-4" />
                    <span className="font-medium">{comment.user.name}</span>
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Chưa có bình luận nào.</p>
          )}
        </div>
      </section>
    </main>
  );
}