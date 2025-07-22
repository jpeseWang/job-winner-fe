import axios from "@/lib/axios";
import BlogForm from "@/components/blog/blog-form";
import { IBlog } from "@/types/interfaces/blog";

async function getBlogs(): Promise<IBlog[]> {
  const res = await axios.get("/api/blog");
  return res.data;
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Blog / Review Job</h1>
      <BlogForm />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <a key={blog._id} href={`/blog/${blog.slug}`} className="border p-4 rounded hover:shadow transition">
            <h2 className="font-semibold text-xl">{blog.title}</h2>
            <p className="text-gray-500 text-sm">{blog.excerpt}</p>
            <p className="text-gray-400 text-xs">Views: {blog.views} | Likes: {blog.likes}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
