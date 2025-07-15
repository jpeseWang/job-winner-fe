// app/api/blogs/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { UserRole } from "@/types/enums";
import mongoose from "mongoose";

// GET /api/blogs/:id
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: id },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error(`GET /api/blogs/${params.id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

// PUT /api/blogs/:id
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    await dbConnect();
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const data = await request.json();
    const { title, slug, status, excerpt, content, featuredImage, categories, tags } = data;

    if (!title || !slug || !status || !content || !excerpt) {
      return NextResponse.json({ error: "Title, slug, status, content, and excerpt are required" }, { status: 400 });
    }

    const existingBlogWithSlug = await Blog.findOne({ slug, _id: { $ne: id } });
    if (existingBlogWithSlug) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const updateData = {
      title,
      slug,
      status,
      excerpt,
      content,
      featuredImage: featuredImage || "",
      author: session.user.id,
      categories: categories || [],
      tags: tags || [],
      updatedAt: new Date(),
      ...(status === "published" && !existingBlog.publishedAt ? { publishedAt: new Date() } : {}),
    };

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true })
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/blogs/${params.id} error:`, error);
    return NextResponse.json({ error: `Failed to update blog: ${(error as Error).message || "Unknown error"}` }, { status: 500 });
  }
}

// DELETE /api/blogs/:id
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    await dbConnect();
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findByIdAndDelete(id).populate("author", "name email");
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully", blog }, { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/blogs/${params.id} error:`, error);
    return NextResponse.json({ error: `Failed to delete blog: ${(error as Error).message || "Unknown error"}` }, { status: 500 });
  }
}

// PATCH /api/blogs/:id (for liking)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ likes: blog.likes }, { status: 200 });
  } catch (error) {
    console.error(`PATCH /api/blogs/${params.id} error:`, error);
    return NextResponse.json({ error: "Failed to like blog" }, { status: 500 });
  }
}

// POST /api/blogs/:id (for commenting)
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    const comment = {
      user: session.user.id,
      content: content.trim(),
      createdAt: new Date(),
      isApproved: false,
    };

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/blogs/${params.id}/comment error:`, error);
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}