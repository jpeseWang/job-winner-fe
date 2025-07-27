"use client"

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
import { FaUser, FaClock, FaEye, FaEllipsisV, FaEdit, FaTrash, FaHeart, FaComment } from "react-icons/fa";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Plus, AlertCircle, Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
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

// Validate MongoDB ObjectId (24 hexadecimal characters)
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

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
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = ["all", "draft", "published", "archived"];

  // Check admin role
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== UserRole.ADMIN) {
      router.push(`/auth/login?error=${encodeURIComponent("Access denied. Admins only.")}`);
    }
  }, [session, status, router]);

  // Fetch blog posts
  useEffect(() => {
    if (!session) return;

    async function fetchPosts() {
      setIsLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10s
        const res = await fetch("/api/blogs", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          const text = await res.text();
          try {
            const error = JSON.parse(text);
            throw new Error(error.error || "Failed to load blog posts");
          } catch {
            throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
          }
        }
        const data = await res.json();
        setPosts(data.blogs || data);
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
            description: error.message || "Failed to load blog posts",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [session, toast]);

  // Filter posts
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || post.status === statusFilter)
  );

  // Validate slug
  const validateSlug = (slug: string) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "slug" && value && !validateSlug(value)) {
       setError("Slug must be lowercase, contain only letters, numbers, and hyphens (e.g., my-blog-post)");
    } else if (name === "slug" && error?.includes("Slug")) {
      setError(null);
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10MB.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  // Upload image to Cloudinary
  const handleUploadImage = async () => {
    if (!file) {
      setError("Please select an image to upload");
      toast({
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "job-marketplace/blogs");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      console.log("Uploading image to /api/upload/image:", file.name, file.size);
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        console.error("Upload image failed:", text);
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || `Failed to upload image (status: ${res.status})`);
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }

      const data = await res.json();
      if (!data.secure_url) {
        console.error("No secure_url in response:", data);
        throw new Error("No image URL received from Cloudinary");
      }

      console.log("Image uploaded successfully:", data.secure_url);
      setFormData((prev) => ({ ...prev, featuredImage: data.secure_url }));
      setFile(null);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      return data.secure_url;
    } catch (error: any) {
      console.error("Upload image error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, isEdit: boolean) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.content || !formData.excerpt) {
        throw new Error("Please fill in title, content, and excerpt");
      }
      if (!validateSlug(formData.slug)) {
        throw new Error("Invalid slug. Use lowercase letters, numbers, and hyphens.");
      }
      if (isEdit && !selectedPost) {
        throw new Error("No post selected for editing");
      }

      // Upload image if selected
      let imageUrl = formData.featuredImage;
      if (file) {
        imageUrl = await handleUploadImage();
        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }
      }

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/blogs/${selectedPost!._id}` : "/api/blogs";
      const categories = formData.categories
        ? formData.categories.split(",").map((cat) => cat.trim()).filter(Boolean)
        : [];
      const tags = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const body = new FormData();
      body.append("title", formData.title);
      body.append("slug", formData.slug);
      body.append("content", formData.content);
      body.append("excerpt", formData.excerpt);
      body.append("featuredImage", imageUrl);
      body.append("categories", categories.join(","));
      body.append("tags", tags.join(","));
      body.append("status", formData.status);

      console.log("Submitting to", url, "with data:", Object.fromEntries(body));
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        method,
        body,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        console.error("Submit blog failed:", text);
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || (isEdit ? "Failed to update post" : "Failed to create post"));
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }

      const newPost = await res.json();
      const blogsRes = await fetch("/api/blogs");
      if (!blogsRes.ok) {
        const text = await blogsRes.text();
        console.error("Fetch blogs failed:", text);
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || "Failed to load blog posts");
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }
      const updatedBlogs = await blogsRes.json();
      setPosts(updatedBlogs.blogs || updatedBlogs);

      toast({
        title: isEdit ? "Post Updated" : "Post Created",
        description: `The post "${formData.title}" has been ${isEdit ? "updated" : "created"} successfully.`,
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
      setFile(null);
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedPost(null);
    } catch (error: any) {
      console.error("Submit error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || (isEdit ? "Failed to update post" : "Failed to create post"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit post
  const handleEditPost = (post: BlogPost) => {
    if (!isValidObjectId(post._id)) {
      console.error("Invalid post ID:", post._id);
      setError("Invalid post ID");
      toast({
        title: "Error",
        description: "Invalid post ID",
        variant: "destructive",
      });
      return;
    }
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
    setFile(null);
    setIsEditDialogOpen(true);
  };

  // Handle delete post
  const handleDeletePost = async (postId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!session) {
        throw new Error("Not logged in: Please log in");
      }
      if (!isValidObjectId(postId)) {
        throw new Error("Invalid post ID");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      console.log("Deleting blog:", postId);
      const res = await fetch(`/api/blogs/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete blog failed:", text);
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || `Failed to delete post (status: ${res.status})`);
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }

      const { message, blog } = await res.json();
      const blogsRes = await fetch("/api/blogs");
      if (!blogsRes.ok) {
        const text = await blogsRes.text();
        console.error("Fetch blogs failed:", text);
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || "Failed to load blog posts");
        } catch {
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }
      }
      const updatedBlogs = await blogsRes.json();
      setPosts(updatedBlogs.blogs || updatedBlogs);

      toast({
        title: "Post Deleted",
        description: `The post "${blog.title}" has been deleted successfully.`,
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preview post
  const handlePreviewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsPreviewDialogOpen(true);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ImageIcon className="h-8 w-8 animate-spin text-teal-500" aria-label="Loading blog posts" />
      </div>
    );
  }

  if (!session || session.user.role !== UserRole.ADMIN) {
    return null; // Await redirect from useEffect
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
            placeholder="Search posts by title..."
            className="pl-8 border-gray-300 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
            aria-label="Search posts"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] border-gray-300 focus:ring-teal-500">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Write and publish a professional post.
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
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    aria-label="Post title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="Enter post slug (e.g., my-blog-post)"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    aria-label="Post slug"
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
                  placeholder="Enter a short excerpt (max 500 characters)"
                  className="h-[100px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  disabled={isLoading}
                  aria-label="Post excerpt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter post content (Markdown or plain text)"
                  className="h-[400px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  aria-label="Post content"
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
                    aria-label="Post categories"
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
                    aria-label="Post tags"
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
                      aria-label="Post status"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["draft", "published", "archived"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "draft" ? "Draft" : status === "published" ? "Published" : "Archived"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm font-medium">
                    Featured Image
                  </Label>
                  <div className="relative">
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      aria-label="Upload featured image"
                    />
                    {formData.featuredImage && (
                      <div className="mt-2">
                        <Image
                          src={formData.featuredImage}
                          alt="Featured image preview"
                          width={100}
                          height={100}
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isLoading}
                  aria-label="Cancel post creation"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-700"
                  aria-label="Create post"
                >
                  Create Post
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update post information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  aria-label="Post title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="Enter post slug (e.g., my-blog-post)"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  aria-label="Post slug"
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
                placeholder="Enter a short excerpt (max 500 characters)"
                className="h-[100px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                value={formData.excerpt}
                onChange={handleChange}
                required
                maxLength={500}
                disabled={isLoading}
                aria-label="Post excerpt"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter post content (Markdown or plain text)"
                className="h-[400px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                value={formData.content}
                onChange={handleChange}
                required
                disabled={isLoading}
                aria-label="Post content"
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
                  aria-label="Post categories"
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
                  aria-label="Post tags"
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
                    aria-label="Post status"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {["draft", "published", "archived"].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "draft" ? "Draft" : status === "published" ? "Published" : "Archived"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium">
                  Featured Image
                </Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    aria-label="Upload featured image"
                  />
                  {formData.featuredImage && (
                    <div className="mt-2">
                      <Image
                        src={formData.featuredImage}
                        alt="Featured image preview"
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isLoading}
                aria-label="Cancel post editing"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700"
                aria-label="Update post"
              >
                Update Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl p-0 animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200">
            <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight">
              {selectedPost ? selectedPost.title : "Preview"}
            </DialogTitle>
          </DialogHeader>
          {selectedPost ? (
            <div className="p-6 space-y-8">
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
                  <Badge
                    className={`
                      absolute top-4 right-4 px-3 py-1 text-sm font-semibold
                      ${
                        selectedPost.status === "published"
                          ? "bg-green-500 hover:bg-green-600"
                          : selectedPost.status === "draft"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }
                    `}
                  >
                    {selectedPost.status === "draft" ? "Draft" : selectedPost.status === "published" ? "Published" : "Archived"}
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                  {selectedPost.title}
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Author:</span> {selectedPost.author?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Published:</span>{" "}
                    {selectedPost.publishedAt
                      ? new Date(selectedPost.publishedAt).toLocaleDateString("en-US")
                      : "Not published"}
                  </p>
                  <p>
                    <span className="font-medium">Categories:</span>{" "}
                    {selectedPost.categories?.join(", ") || "None"}
                  </p>
                  <div>
                    <span className="font-medium">Tags:</span>{" "}
                    {selectedPost.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="mr-1 text-xs bg-gray-200 hover:bg-gray-300"
                      >
                        {tag}
                      </Badge>
                    )) || "None"}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaEye className="h-4 w-4 text-gray-500" />
                      {selectedPost.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart className="h-4 w-4 text-red-500" />
                      {selectedPost.likes} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <FaComment className="h-4 w-4 text-blue-500" />
                      {selectedPost.comments.length} comments
                    </span>
                  </div>
                </div>
                <div
                  className="prose max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">No post selected for preview.</div>
          )}
          <DialogFooter className="p-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(false)}
              aria-label="Close preview"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card
            key={post._id}
            className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white"
          >
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Badge
                className={`
                  absolute top-3 right-3 px-2 py-1 text-xs font-semibold
                  ${
                    post.status === "published"
                      ? "bg-green-500 hover:bg-green-600"
                      : post.status === "draft"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }
                `}
              >
                {post.status === "draft" ? "Draft" : post.status === "published" ? "Published" : "Archived"}
              </Badge>
            </div>

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
                      {post.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart className="h-4 w-4 text-red-500" />
                      {post.likes} likes
                    </span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePreviewPost(post)}
                className="border-teal-500 text-teal-600 hover:bg-teal-50 transition-colors duration-200"
                aria-label={`Preview ${post.title}`}
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
                    aria-label="More options"
                  >
                    <FaEllipsisV className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-md shadow-lg">
                  <DropdownMenuItem
                    onClick={() => router.push(`/blog/${post._id}`)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 cursor-pointer"
                    aria-label={`View post ${post.title}`}
                  >
                    <FaEye className="h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEditPost(post)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 cursor-pointer"
                    aria-label={`Edit post ${post.title}`}
                  >
                    <FaEdit className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeletePost(post._id)}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                    aria-label={`Delete post ${post.title}`}
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

      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-600 mt-8">
          No posts found matching the criteria.
        </p>
      )}
    </div>
  );
}
