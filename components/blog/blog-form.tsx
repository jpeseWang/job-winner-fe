"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BlogForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: "", // cần lấy ID người dùng nếu có đăng nhập
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/blogs", form);
    router.refresh();
    setForm({ title: "", slug: "", content: "", excerpt: "", author: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
      <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug (unique)" className="w-full border p-2 rounded" required />
      <input name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border p-2 rounded" required />
      <input name="author" value={form.author} onChange={handleChange} placeholder="Author ID" className="w-full border p-2 rounded" required />
      <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" className="w-full border p-2 rounded" rows={6} required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post Blog</button>
    </form>
  );
}
