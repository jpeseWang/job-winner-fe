// File: /components/blog/BlogCard.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  id: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  date,
  category,
  image,
  id,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
          {category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{excerpt}</p>
        <div className="text-sm text-gray-500">
          <span>{date}</span>
        </div>

        <Link href={`/blog/${id}`}>
          <a className="mt-4 block text-teal-500 hover:text-teal-700">Đọc thêm...</a>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;

