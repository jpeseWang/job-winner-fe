import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import mongoose from "mongoose";
import { UserRole } from "@/types/enums";

// GET /api/blogs/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: id, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or not published" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error(`GET /api/blogs/${params} error:`, error);
    return NextResponse.json(
      { error: `Failed to fetch blog: ${(error as Error).message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      console.error(`PUT /api/blogs/${params.id}: Unauthorized - No session or user`);
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      console.error(`PUT /api/blogs/${params.id}: Access denied - Not admin`);
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    if (!mongoose.isValidObjectId(params.id)) {
      console.error(`PUT /api/blogs/${params.id}: Invalid blog ID`);
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    await dbConnect();
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const status = formData.get("status") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const featuredImage = formData.get("featuredImage") as string;
    const categories = formData.get("categories") as string;
    const tags = formData.get("tags") as string;

    console.log(`PUT /api/blogs/${params.id}: Received data`, {
      title,
      slug,
      status,
      excerpt,
      content,
      featuredImage,
      categories,
      tags,
    });

    if (!title || !slug || !status || !content || !excerpt) {
      console.error(`PUT /api/blogs/${params.id}: Missing required fields`);
      return NextResponse.json(
        { error: "Title, slug, status, content, and excerpt are required" },
        { status: 400 }
      );
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      console.error(`PUT /api/blogs/${params.id}: Invalid slug format - ${slug}`);
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    const existingBlog = await Blog.findOne({ slug, _id: { $ne: params.id } });
    if (existingBlog) {
      console.error(`PUT /api/blogs/${params.id}: Slug already exists - ${slug}`);
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const blog = await Blog.findById(params.id);
    if (!blog) {
      console.error(`PUT /api/blogs/${params.id}: Blog not found`);
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    blog.title = title;
    blog.slug = slug;
    blog.status = status;
    blog.excerpt = excerpt;
    blog.content = content;
    blog.featuredImage = featuredImage || blog.featuredImage;
    blog.categories = categories ? categories.split(",").map((cat: string) => cat.trim()) : blog.categories;
    blog.tags = tags ? tags.split(",").map((tag: string) => tag.trim()) : blog.tags;
    blog.publishedAt = status === "published" && !blog.publishedAt ? new Date() : blog.publishedAt;

    await blog.save();
    const populatedBlog = await Blog.findById(blog._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    console.log(`PUT /api/blogs/${params.id}: Blog updated successfully`);
    return NextResponse.json(populatedBlog, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/blogs/${params.id} error:`, error);
    return NextResponse.json(
      { error: `Failed to update blog: ${(error as Error).message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if exists
    if (blog.featuredImage) {
      const publicId = blog.featuredImage.split("/").pop()?.split(".")[0];
      if (publicId) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch("/api/upload/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId }),
            signal: controller.signal,
          });
          if (!response.ok) {
            console.error("Failed to delete Cloudinary image:", await response.text());
          }
        } catch (error) {
          console.error("Cloudinary delete error:", error);
        } finally {
          clearTimeout(timeoutId);
        }
      }
    }

    await Blog.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Blog deleted successfully", blog },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/blogs/${params} error:`, error);
    return NextResponse.json(
      { error: `Failed to delete blog: ${(error as Error).message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

// PATCH /api/blogs/[id] (for liking)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: id, status: "published" },
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or not published" }, { status: 404 });
    }

    return NextResponse.json({ likes: blog.likes }, { status: 200 });
  } catch (error) {
    console.error(`PATCH /api/blogs/${params} error:`, error);
    return NextResponse.json(
      { error: `Failed to like blog: ${(error as Error).message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

// POST /api/blogs/[id] (for commenting)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const user = await User.findById(session.user.id).select("name email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "Comment must be 500 characters or less" },
        { status: 400 }
      );
    }

    const comment = {
      user: {
        _id: user._id,
        name: user.name || "Unknown User",
        email: user.email || "unknown@example.com",
      },
      content: content.trim(),
      createdAt: new Date(),
      isApproved: false,
    };

    const blog = await Blog.findOneAndUpdate(
      { _id: id, status: "published" },
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or not published" }, { status: 404 });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/blogs/${params}/comment error:`, error);
    return NextResponse.json(
      { error: `Failed to submit comment: ${(error as Error).message || "Unknown error"}` },
      { status: 500 }
    );
  }
}