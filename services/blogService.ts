import Blog from "@/models/Blog";
import { IBlog } from "@/types/interfaces/blog";

const blogService = {
  async getAllPublishedBlogs() {
    try {
      return await Blog.find({ status: "published" }).sort({ publishedAt: -1 });
    } catch (error) {
      throw new Error("Error fetching published blogs: " + error.message);
    }
  },

  async getBlogById(id: string): Promise<IBlog | null> {
    try {
      // Populating thêm các thông tin về author (như email, role)
      return await Blog.findById(id).populate("author", "name email role");
    } catch (error) {
      throw new Error("Error fetching blog by ID: " + error.message);
    }
  },

  async getBlogBySlug(slug: string): Promise<IBlog | null> {
    try {
      return await Blog.findOne({ slug, status: "published" }).populate("author", "name email role");
    } catch (error) {
      throw new Error("Error fetching blog by slug: " + error.message);
    }
  },

  async createBlog(data: Omit<IBlog, "createdAt" | "updatedAt" | "views" | "likes" | "comments" | "publishedAt">) {
    try {
      const blog = new Blog({
        ...data,
        status: "draft",  // Mặc định khi tạo là draft
      });
      await blog.save();
      return blog;
    } catch (error) {
      throw new Error("Error creating blog: " + error.message);
    }
  },

  async addCommentToBlog(id: string, comment: { user: string; content: string; isApproved?: boolean }) {
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        throw new Error("Blog not found");
      }

      // Thêm kiểm tra nếu cần chỉ lưu bình luận đã được duyệt
      if (comment.isApproved !== undefined && comment.isApproved === false) {
        throw new Error("Comment is not approved");
      }

      blog.comments.push({
        ...comment,
        createdAt: new Date(),
        isApproved: comment.isApproved || false,
      });

      await blog.save();
      return blog.comments;
    } catch (error) {
      throw new Error("Error adding comment: " + error.message);
    }
  },

  async updateBlogLikes(id: string) {
    try {
      const blog = await Blog.findOneAndUpdate(
        { _id: id },
        { $inc: { likes: 1 } },
        { new: true }
      );
      if (!blog) {
        throw new Error("Blog not found");
      }
      return blog.likes;
    } catch (error) {
      throw new Error("Error updating likes: " + error.message);
    }
  },

  async updateBlogViews(id: string) {
    try {
      const blog = await Blog.findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } },
        { new: true }
      );
      if (!blog) {
        throw new Error("Blog not found");
      }
      return blog.views;
    } catch (error) {
      throw new Error("Error updating views: " + error.message);
    }
  },
};

export default blogService;

