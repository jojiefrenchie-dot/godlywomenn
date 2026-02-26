import mongoose, { Document } from 'mongoose';
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
export interface IComment extends Document {
    article: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    parent?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}
export interface IArticleLike extends Document {
    user: mongoose.Types.ObjectId;
    article: mongoose.Types.ObjectId;
    created_at: Date;
}
export interface IArticleView extends Document {
    user: mongoose.Types.ObjectId;
    article: mongoose.Types.ObjectId;
    created_at: Date;
}
export interface ICommentLike extends Document {
    user: mongoose.Types.ObjectId;
    comment: mongoose.Types.ObjectId;
    created_at: Date;
}
export declare const Article: mongoose.Model<IArticle, {}, {}, {}, mongoose.Document<unknown, {}, IArticle> & IArticle & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const Comment: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment> & IComment & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const ArticleLike: mongoose.Model<IArticleLike, {}, {}, {}, mongoose.Document<unknown, {}, IArticleLike> & IArticleLike & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const ArticleView: mongoose.Model<IArticleView, {}, {}, {}, mongoose.Document<unknown, {}, IArticleView> & IArticleView & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const CommentLike: mongoose.Model<ICommentLike, {}, {}, {}, mongoose.Document<unknown, {}, ICommentLike> & ICommentLike & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Article.d.ts.map