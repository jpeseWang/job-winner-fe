"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Loader2, User, Clock } from "lucide-react";
import DOMPurify from "dompurify";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { getBlogPostById } from "@/services/blogService";

export default function BlogPost({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getBlogPostById(params.id);
        setPost(data);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không tải được bài viết",
          variant: "destructive",
        });
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
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="relative">
            <img
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-4 px-6">
              <Badge className="bg-teal-500 text-white mb-4">{post.category}</Badge>
              <h1 className="text-4xl text-white font-bold">{post.title}</h1>
            </div>
          </div>

          <div
            className="prose prose-teal mt-8"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          <div className="flex items-center gap-4 mt-8">
            <Button onClick={handleLike} disabled={liked || !session} className="flex items-center gap-2">
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
              Thích ({post.likes})
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
