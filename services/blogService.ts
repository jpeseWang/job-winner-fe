
import Blog from "@/models/Blog";

const blogService = {
  async getAllPublishedBlogs() {
    return await Blog.find({ status: "published" }).sort({ publishedAt: -1 });
  },

  async getBlogBySlug(slug: string) {
    return await Blog.findOne({ slug, status: "published" }).populate("author", "name");
  },

  async createBlog(data: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    author: string;
    categories?: string[];
    tags?: string[];
    featuredImage?: string;
  }) {
    const blog = new Blog({
      ...data,
      status: "published",
    });
    await blog.save();
    return blog;
  },
};

export default blogService;
