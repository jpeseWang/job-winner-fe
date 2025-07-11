
import { NextRequest, NextResponse } from "next/server";
import blogService from "@/services/blogService";
import connectDB from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  const blog = await blogService.getBlogBySlug(params.slug);
  if (!blog) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(blog);
}
