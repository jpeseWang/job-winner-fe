"use client";
import Link from "next/link";
import { IBlog } from "@/types/interfaces/blog";
import { formatDate } from "@/utils/formatDate";

export default function BlogCard({ blog }: { blog: IBlog }) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="p-4 border rounded hover:shadow-md transition cursor-pointer">
        <h2 className="text-xl font-bold">{blog.title}</h2>
        <p className="text-sm text-gray-500">
          {typeof blog.author === "string" ? blog.author : blog.author.name} • {formatDate(blog.publishedAt!)}
        </p>
        <p className="text-gray-700 line-clamp-2 mt-2">{blog.excerpt}</p>
      </div>
    </Link>
  );
}
