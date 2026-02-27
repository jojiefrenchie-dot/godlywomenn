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
export declare const Article: any;
export declare const Comment: any;
export declare const ArticleLike: any;
export declare const ArticleView: any;
export declare const CommentLike: any;
//# sourceMappingURL=Article.d.ts.map