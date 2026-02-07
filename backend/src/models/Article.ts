import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author: mongoose.Types.ObjectId;
  category: string;
  status: 'draft' | 'published';
  view_count: number;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

const articleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
    maxlength: 1024
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 1024
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    default: ''
  },
  featured_image: {
    type: String,
    default: null
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  view_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  published_at: {
    type: Date,
    default: null
  }
});

articleSchema.pre('save', function(next) {
  this.updated_at = new Date();
  if (this.status === 'published' && !this.published_at) {
    this.published_at = new Date();
  }
  next();
});

export interface IComment extends Document {
  article: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  parent?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const commentSchema = new Schema<IComment>({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

export interface IArticleLike extends Document {
  user: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId;
  created_at: Date;
}

const articleLikeSchema = new Schema<IArticleLike>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

articleLikeSchema.index({ user: 1, article: 1 }, { unique: true });

export interface IArticleView extends Document {
  user: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId;
  created_at: Date;
}

const articleViewSchema = new Schema<IArticleView>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

articleViewSchema.index({ user: 1, article: 1 }, { unique: true });

export interface ICommentLike extends Document {
  user: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
  created_at: Date;
}

const commentLikeSchema = new Schema<ICommentLike>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

commentLikeSchema.index({ user: 1, comment: 1 }, { unique: true });

export const Article = mongoose.model<IArticle>('Article', articleSchema);
export const Comment = mongoose.model<IComment>('Comment', commentSchema);
export const ArticleLike = mongoose.model<IArticleLike>('ArticleLike', articleLikeSchema);
export const ArticleView = mongoose.model<IArticleView>('ArticleView', articleViewSchema);
export const CommentLike = mongoose.model<ICommentLike>('CommentLike', commentLikeSchema);
