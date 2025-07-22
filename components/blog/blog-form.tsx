"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { blogService } from "@/services/blog.service";

export default function BlogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await blogService.createBlog(form);
      router.refresh();
      setForm({ title: "", slug: "", content: "", excerpt: "", author: "" });
    } catch (err) {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {error && <p className="text-red-500">{error}</p>}
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
      <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug (unique)" className="w-full border p-2 rounded" required />
      <input name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border p-2 rounded" required />
      <input name="author" value={form.author} onChange={handleChange} placeholder="Author ID" className="w-full border p-2 rounded" required />
      <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" className="w-full border p-2 rounded" rows={6} required />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        {loading ? "Posting..." : "Post Blog"}
      </button>
    </form>
  );
}
