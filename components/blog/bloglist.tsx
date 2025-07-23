// File: /components/blog/BlogList.tsx
import React from "react";
import BlogCard from "./blogcard";

interface BlogListProps {
  posts: {
    _id: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    category: string;
    featuredImage: string;
  }[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard
          key={post._id}
          title={post.title}
          excerpt={post.excerpt}
          date={new Date(post.publishedAt).toLocaleDateString("vi-VN")}
          category={post.category || "General"}
          image={post.featuredImage || "/placeholder.svg"}
          id={post._id}
        />
      ))}
    </div>
  );
};

export default BlogList;

