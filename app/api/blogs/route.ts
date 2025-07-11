// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import blogService from "@/services/blogService";

export async function GET() {
  await connectDB();
  const blogs = await blogService.getAllPublishedBlogs();
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const blog = await blogService.createBlog(body);
  return NextResponse.json(blog, { status: 201 });
}
