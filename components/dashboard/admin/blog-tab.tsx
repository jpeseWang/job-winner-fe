"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { IoIosCheckmarkCircle } from "react-icons/io";
import DOMPurify from "dompurify";
import { FaUser, FaClock, FaEye, FaEllipsisV, FaEdit, FaTrash, FaHeart, FaComment, FaTimes } from "react-icons/fa";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Plus, Edit, Trash2, AlertCircle, Image as ImageIcon, Eye, MoreVertical,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";
import { UserRole } from "@/types/enums";

interface Comment {
  user: { _id: string; name: string; email: string };
  content: string;
  createdAt: string;
  isApproved: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: { _id: string; name: string; email: string };
  featuredImage: string;
  categories: string[];
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  views: number;
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    categories: "",
    tags: "",
    status: "draft" as "draft" | "published" | "archived",
  });
  const [error, setError] = useState<string | null>(null);

  const statusOptions = ["all", "draft", "published", "archived"];

  // Kiểm tra quyền admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== UserRole.ADMIN) {
      router.push(`/auth/login?error=${encodeURIComponent("Access denied. Admins only.")}`);
    }
  }, [session, status, router]);

  // Lấy danh sách bài viết
  useEffect(() => {
    if (!session) return;

    async function fetchPosts() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) {
          const text = await res.text();
          try {
            const error = JSON.parse(text);
            throw new Error(error.error || "Failed to fetch blogs");
          } catch {
            throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
          }
        }
        const data = await res.json();
        console.log("Fetched blogs:", data); // Log để debug
        setPosts(data);
      } catch (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [session, toast]);
  // Lọc bài viết
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || post.status === statusFilter)
  );

  // Validate slug
  const validateSlug = (slug: string) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  };

  // Xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "slug" && value && !validateSlug(value)) {
      setError("Slug must be lowercase, alphanumeric, and use hyphens only (e.g., my-blog-post)");
    } else if (name === "slug" && error?.includes("Slug")) {
      setError(null);
    }
  };

  // Xử lý submit form
  // Trong handleSubmit
  const handleSubmit = async (e: React.FormEvent, isEdit: boolean) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!validateSlug(formData.slug)) {
        throw new Error("Invalid slug format. Use lowercase letters, numbers, and hyphens only.");
      }

      if (isEdit && !selectedPost) {
        throw new Error("No blog selected for editing");
      }

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/blogs/${selectedPost!._id}` : "/api/blogs"; // Dùng ! vì đã kiểm tra null
      const categories = formData.categories
        ? formData.categories.split(",").map((cat) => cat.trim()).filter(Boolean)
        : [];
      const tags = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const body = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        featuredImage: formData.featuredImage,
        categories,
        tags,
        status: formData.status,
      };

      console.log("Sending request:", { method, url, body });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        console.log("Response text:", text);
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || (isEdit ? "Failed to update blog" : "Failed to create blog"));
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }

      const newPost = await res.json();
      // Tái fetch blogs để đồng bộ
      const blogsRes = await fetch("/api/blogs");
      if (!blogsRes.ok) {
        const text = await blogsRes.text();
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || "Failed to fetch blogs");
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }
      const updatedBlogs = await blogsRes.json();
      setPosts(updatedBlogs);

      toast({
        title: isEdit ? "Blog Updated" : "Blog Created",
        description: `Blog "${formData.title}" has been ${isEdit ? "updated" : "created"} successfully.`,
      });

      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        categories: "",
        tags: "",
        status: "draft",
      });
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Xử lý chỉnh sửa bài viết
  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content || "",
      excerpt: post.excerpt || "",
      featuredImage: post.featuredImage || "",
      categories: post.categories?.join(", ") || "",
      tags: post.tags?.join(", ") || "",
      status: post.status,
    });
    setIsEditDialogOpen(true);
  };

  // Xử lý xóa bài viết
  const handleDeletePost = async (postId: string) => {
    setIsLoading(true);
    setError(null);
    console.log("Deleting blog with ID:", postId);
    try {
      if (!session) {
        throw new Error("Unauthorized: Please log in");
      }
      if (!/^[0-9a-f]{24}$/.test(postId)) {
        throw new Error("Invalid blog ID format");
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`/api/blogs/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log("DELETE response status:", res.status, "URL:", res.url);
      if (!res.ok) {
        const text = await res.text();
        console.log("DELETE response text:", text.slice(0, 200));
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || `Failed to delete blog (status: ${res.status})`);
        } catch {
          throw new Error(`Invalid response (status: ${res.status}): ${text.slice(0, 100)}...`);
        }
      }
      const { message, blog } = await res.json();
      console.log("Deleted blog:", blog);
      // Tái fetch blogs để đồng bộ
      const blogsRes = await fetch("/api/blogs");
      if (!blogsRes.ok) {
        const text = await blogsRes.text();
        console.log("GET /api/blogs response text:", text.slice(0, 200));
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || "Failed to fetch blogs");
        } catch {
          throw new Error(`Invalid GET response: ${text.slice(0, 100)}...`);
        }
      }
      const updatedBlogs = await blogsRes.json();
      setPosts(updatedBlogs);
      toast({
        title: "Blog Deleted",
        description: `Blog "${blog.title}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error("handleDeletePost error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xem trước bài viết
  const handlePreviewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsPreviewDialogOpen(true);
  };

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== UserRole.ADMIN) {
    return null; // Chờ redirect từ useEffect
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search blogs by title..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
              <Plus className="h-4 w-4" />
              <span>Create Blog</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Write and publish a professional blog article.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter blog title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="Enter blog slug (e.g., my-blog-post)"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Excerpt <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Enter a short summary of the blog (max 500 characters)"
                  className="h-[100px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter blog content (Markdown or plain text)"
                  className="h-[400px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categories" className="text-sm font-medium">
                    Categories (comma-separated)
                  </Label>
                  <Input
                    id="categories"
                    name="categories"
                    placeholder="Tech, News, Tutorial"
                    value={formData.categories}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Tags (comma-separated)
                  </Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="javascript, react, blog"
                    value={formData.tags}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value as "draft" | "published" | "archived" }))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="status"
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["draft", "published", "archived"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredImage" className="text-sm font-medium">
                    Featured Image URL
                  </Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="featuredImage"
                      name="featuredImage"
                      placeholder="https://example.com/image.jpg"
                      className="pl-8 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      value={formData.featuredImage}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                  Create Blog
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card
            key={post._id}
            className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white"
          >
            {/* Image Section with Overlay */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Status Badge */}
              <Badge
                className={`
            absolute top-3 right-3 px-2 py-1 text-xs font-semibold
            ${post.status === "published"
                    ? "bg-green-500 hover:bg-green-600"
                    : post.status === "draft"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }
          `}
              >
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </Badge>
            </div>

            {/* Content Section */}
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-bold line-clamp-2 leading-tight">
                {post.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 line-clamp-3 prose">
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Author:</span>{" "}
                    {post.author?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Categories:</span>{" "}
                    {post.categories?.join(", ") || "None"}
                  </p>
                  <div>
                    <span className="font-medium">Tags:</span>{" "}
                    {post.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="mr-1 text-xs bg-gray-200 hover:bg-gray-300"
                      >
                        {tag}
                      </Badge>
                    )) || "None"}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FaEye className="h-4 w-4 text-gray-500" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart className="h-4 w-4 text-red-500" />
                      {post.likes}
                    </span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>

            {/* Footer Section */}
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePreviewPost(post)}
                className="border-teal-500 text-teal-600 hover:bg-teal-50 transition-colors duration-200"
              >
                <FaEye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    <FaEllipsisV className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-md shadow-lg">
                  <DropdownMenuItem
                    onClick={() => router.push(`/blog/${post.slug}`)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 cursor-pointer"
                  >
                    <FaEye className="h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEditPost(post)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 cursor-pointer"
                  >
                    <FaEdit className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeletePost(post._id)}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <FaTrash className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl p-0 animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200">
            <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight">
              {selectedPost ? selectedPost.title : "Preview"}
            </DialogTitle>
          </DialogHeader>
          {selectedPost ? (
            <div className="p-6 space-y-8">
              {/* Featured Image */}
              {selectedPost.featuredImage && (
                <div className="relative h-72 w-full rounded-xl overflow-hidden group">
                  <Image
                    src={selectedPost.featuredImage || "/placeholder.svg"}
                    alt={selectedPost.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 800px"
                    priority={false}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Status Badge */}
                  <Badge
                    className={`
                absolute top-4 right-4 px-3 py-1 text-sm font-semibold
                ${selectedPost.status === "published"
                        ? "bg-green-500 hover:bg-green-600"
                        : selectedPost.status === "draft"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }
              `}
                  >
                    {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                  </Badge>
                </div>
              )}

              {/* Article Content */}
              <div className="space-y-6">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                  {selectedPost.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-600 border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="h-4 w-4 text-gray-500" />
                    <span>{selectedPost.author?.name || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedPost.publishedAt
                        ? new Date(selectedPost.publishedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye className="h-4 w-4 text-gray-500" />
                    <span>{selectedPost.views} Lượt xem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaHeart className="h-4 w-4 text-red-500" />
                    <span>{selectedPost.likes} Lượt thích</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoIosCheckmarkCircle className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Categories and Tags */}
                <div className="flex flex-col gap-3">
                  {selectedPost.categories?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-700">Danh mục:</span>
                      {selectedPost.categories.map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors duration-200"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {selectedPost.tags?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-700">Thẻ:</span>
                      {selectedPost.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div className="border-l-4 border-teal-200 pl-4 py-2 bg-teal-50/50 rounded-r-md">
                  <p className="text-lg text-gray-700 italic leading-relaxed">
                    {selectedPost.excerpt}
                  </p>
                </div>

                {/* Main Content */}
                <div
                  className="prose prose-teal prose-lg max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
                />
              </div>

              {/* Comments Section */}
              {selectedPost.comments?.length > 0 && (
                <div className="mt-10 border-t pt-8 border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaComment className="h-5 w-5 text-teal-600" />
                    Bình luận ({selectedPost.comments.length})
                  </h3>
                  <div className="mt-6 space-y-6">
                    {selectedPost.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-teal-200 pl-4 py-3 bg-gray-50 rounded-r-md transition-all duration-200 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <FaUser className="h-4 w-4 text-teal-600" />
                          </div>
                          <span className="font-medium">{comment.user.name}</span>
                          <span>•</span>
                          <FaClock className="h-4 w-4 text-gray-500" />
                          <span>{new Date(comment.createdAt).toLocaleString()}</span>
                          <Badge
                            variant={comment.isApproved ? "secondary" : "outline"}
                            className={
                              comment.isApproved
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }
                          >
                            {comment.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-gray-700 text-base">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-600 text-base">Không có bài viết nào được chọn để xem trước.</p>
            </div>
          )}
          <DialogFooter className="p-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
            >
              <FaTimes className="h-4 w-4 mr-2" />
              Đóng
            </Button>
            {selectedPost && (
              <Button
                onClick={() => {
                  setIsPreviewDialogOpen(false);
                  handleEditPost(selectedPost);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 transition-all duration-200"
              >
                <FaEdit className="h-4 w-4 mr-2" />
                Sửa bài viết
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the content and settings for this blog post.
            </DialogDescription>
          </DialogHeader>
          {selectedPost ? (
            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter blog title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="Enter blog slug (e.g., my-blog-post)"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Excerpt <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Enter a short summary of the blog (max 500 characters)"
                  className="h-[100px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter blog content (Markdown or plain text)"
                  className="h-[400px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categories" className="text-sm font-medium">
                    Categories (comma-separated)
                  </Label>
                  <Input
                    id="categories"
                    name="categories"
                    placeholder="Tech, News, Tutorial"
                    value={formData.categories}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Tags (comma-separated)
                  </Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="javascript, react, blog"
                    value={formData.tags}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value as "draft" | "published" | "archived" }))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="status"
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["draft", "published", "archived"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredImage" className="text-sm font-medium">
                    Featured Image URL
                  </Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="featuredImage"
                      name="featuredImage"
                      placeholder="https://example.com/image.jpg"
                      className="pl-8 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      value={formData.featuredImage}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <p>No blog selected for editing.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}