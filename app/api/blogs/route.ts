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
    const blogs = await Blog.find({})
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST /api/blogs
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("POST /api/blogs session:", JSON.stringify(session, null, 2));

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    await dbConnect();
    const data = await request.json();
    console.log("POST /api/blogs data:", JSON.stringify(data, null, 2));

    const { title, slug, status, excerpt, content, featuredImage, categories, tags } = data;

    if (!title || !slug || !status || !content || !excerpt) {
      return NextResponse.json({ error: "Title, slug, status, content, and excerpt are required" }, { status: 400 });
    }

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const blog = new Blog({
      title,
      slug,
      status,
      excerpt,
      content,
      featuredImage: featuredImage || "",
      author: session?.user?.id || "Unknown",
      categories: categories || [],
      tags: tags || [],
      publishedAt: status === "published" ? new Date() : null,
      views: 0,
      likes: 0,
      comments: [],
    });

    await blog.save();
    const populatedBlog = await Blog.findById(blog._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    return NextResponse.json(populatedBlog, { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json({ error: `Failed to create blog: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}