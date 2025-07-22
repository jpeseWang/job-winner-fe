// components/blog/blog-card.tsx
import Link from "next/link";
import { IBlog } from "@/types/interfaces/blog";

interface BlogCardProps {
  blog: IBlog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <div className="rounded-lg border border-gray-200 p-4 shadow hover:shadow-lg transition duration-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
        <span className="text-sm text-blue-600">Read more →</span>
      </div>
    </Link>
  );
}
