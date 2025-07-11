// types/interfaces/blog.ts
export interface IComment {
  user: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string | { name: string };
  featuredImage?: string;
  categories: string[];
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  views: number;
  likes: number;
  comments: IComment[];
  createdAt: string;
  updatedAt: string;
}
