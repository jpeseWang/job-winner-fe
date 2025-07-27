import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { UserRole } from "@/types/enums";

// GET /api/blogs
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({})
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Blog.countDocuments();

    return NextResponse.json({ blogs, total, page, limit }, { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json(
      { error: `Failed to fetch blogs: ${(error as Error).message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

// POST /api/blogs
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      console.error("POST /api/blogs: Unauthorized - No session or user");
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      console.error("POST /api/blogs: Access denied - Not admin");
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    await dbConnect();
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const status = formData.get("status") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const categories = formData.get("categories") as string;
    const tags = formData.get("tags") as string;
    const featuredImage = formData.get("featuredImage") as string;

    if (!title || !slug || !status || !content || !excerpt) {
      console.error("POST /api/blogs: Missing required fields");
      return NextResponse.json(
        { error: "Title, slug, status, content, and excerpt are required" },
        { status: 400 }
      );
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      console.error(`POST /api/blogs: Invalid slug format - ${slug}`);
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      console.error(`POST /api/blogs: Slug already exists - ${slug}`);
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const blog = new Blog({
      title,
      slug,
      status,
      excerpt,
      content,
      featuredImage,
      author: session.user.id,
      categories: categories ? categories.split(",").map((cat: string) => cat.trim()) : [],
      tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
      publishedAt: status === "published" ? new Date() : null,
      views: 0,
      likes: 0,
      comments: [],
    });

    await blog.save();
    const populatedBlog = await Blog.findById(blog._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    console.log("POST /api/blogs: Blog created successfully:", blog._id);
    return NextResponse.json(populatedBlog, { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json(
      { error: `Failed to create blog: ${(error as Error).message || "Unknown error"}` },
      { status: 500 }
    );
  }
}