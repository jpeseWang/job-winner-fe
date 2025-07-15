// components/about/blog-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  id: string; // Thay slug bằng id
  target?: string;
}

export default function BlogCard({
  title,
  excerpt,
  date,
  category,
  image,
  id,
  target,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${id}`} target={target}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group animate-in fade-in-50">
        <div className="relative h-48">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <Badge className="absolute top-3 right-3 bg-teal-500 text-white hover:bg-teal-600">
            {category}
          </Badge>
        </div>
        <div className="p-6">
          <div className="text-gray-500 text-sm mb-2">{date}</div>
          <h3 className="text-xl font-semibold mb-3 line-clamp-2">{title}</h3>
          <p className="text-gray-600 line-clamp-3">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}