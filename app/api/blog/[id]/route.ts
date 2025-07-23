
import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');  

  try {
    const blogPost = await Blog.findOne({ _id: id });
    if (!blogPost) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json(blogPost);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching blog post' }, { status: 500 });
  }
}

