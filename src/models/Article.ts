// MongoDB/Mongoose models removed - use HTTP API or custom database implementation instead

export interface IArticle {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author: string;
  category: string;
  status: 'draft' | 'published';
  view_count: number;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

export interface IComment {
  _id?: string;
  article: string;
  author: string;
  content: string;
  parent?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IArticleLike {
  _id?: string;
  user: string;
  article: string;
  created_at: Date;
}

export interface IArticleView {
  _id?: string;
  user: string;
  article: string;
  created_at: Date;
}

export interface ICommentLike {
  _id?: string;
  user: string;
  comment: string;
  created_at: Date;
}

// Schema and models removed
export const Article = null;
export const Comment = null;
export const ArticleLike = null;
export const ArticleView = null;
export const CommentLike = null;
