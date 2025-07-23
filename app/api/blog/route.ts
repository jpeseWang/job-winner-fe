
import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    const blogPosts = await Blog.find({ status: 'published' }).sort({ publishedAt: -1 });
    return NextResponse.json(blogPosts);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching blog posts' }, { status: 500 });
  }
}

