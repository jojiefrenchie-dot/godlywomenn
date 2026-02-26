"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeComment = exports.deleteComment = exports.updateComment = exports.createComment = exports.getComments = exports.likeArticle = exports.deleteArticle = exports.updateArticle = exports.getArticle = exports.createArticle = exports.listArticles = void 0;
const Article_1 = require("../models/Article");
const validation_1 = require("../utils/validation");
const listArticles = async (req, res) => {
    try {
        const { page, limit, skip } = (0, validation_1.parseQuery)(req.query);
        const { status = 'published', category, search } = req.query;
        let query = {};
        if (status)
            query.status = status;
        if (category)
            query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
        const total = await Article_1.Article.countDocuments(query);
        const articles = await Article_1.Article.find(query)
            .populate('author', 'email name image')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
        res.json({
            results: articles,
            count: total,
            page,
            limit
        });
    }
    catch (error) {
        console.error('List articles error:', error);
        res.status(500).json({ error: 'Failed to list articles' });
    }
};
exports.listArticles = listArticles;
const createArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const { title, content, excerpt, category, status } = req.body;
        if (!title || !content) {
            res.status(400).json({ error: 'Title and content are required' });
            return;
        }
        const slug = (0, validation_1.generateSlug)(title) + '-' + Date.now();
        const article = new Article_1.Article({
            title,
            slug,
            content,
            excerpt: excerpt || '',
            category: category || 'Other',
            status: status || 'draft',
            author: req.user.id
        });
        if (req.file) {
            article.featured_image = `/media/articles/${req.file.filename}`;
        }
        await article.save();
        await article.populate('author', 'email name image');
        res.status(201).json({
            message: 'Article created successfully',
            ...article.toObject()
        });
    }
    catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
};
exports.createArticle = createArticle;
const getArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article_1.Article.findById(id).populate('author', 'email name image');
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        // Record view if user is authenticated
        if (req.user) {
            await Article_1.ArticleView.updateOne({ user: req.user.id, article: id }, { $set: { user: req.user.id, article: id } }, { upsert: true });
        }
        // Increment view count
        article.view_count += 1;
        await article.save();
        // Get likes and comments count
        const likes = await Article_1.ArticleLike.countDocuments({ article: id });
        const comments = await Article_1.Comment.countDocuments({ article: id, parent: null });
        res.json({
            ...article.toObject(),
            likes_count: likes,
            comments_count: comments
        });
    }
    catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({ error: 'Failed to get article' });
    }
};
exports.getArticle = getArticle;
const updateArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        const { title, content, excerpt, category, status } = req.body;
        const article = await Article_1.Article.findById(id);
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        if (article.author.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        if (title) {
            article.title = title;
            article.slug = (0, validation_1.generateSlug)(title) + '-' + Date.now();
        }
        if (content)
            article.content = content;
        if (excerpt !== undefined)
            article.excerpt = excerpt;
        if (category)
            article.category = category;
        if (status)
            article.status = status;
        if (req.file) {
            article.featured_image = `/media/articles/${req.file.filename}`;
        }
        await article.save();
        await article.populate('author', 'email name image');
        res.json({
            message: 'Article updated successfully',
            ...article.toObject()
        });
    }
    catch (error) {
        console.error('Update article error:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
};
exports.updateArticle = updateArticle;
const deleteArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        const article = await Article_1.Article.findById(id);
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        if (article.author.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        await Article_1.Article.deleteOne({ _id: id });
        await Article_1.Comment.deleteMany({ article: id });
        await Article_1.ArticleLike.deleteMany({ article: id });
        await Article_1.ArticleView.deleteMany({ article: id });
        res.json({ message: 'Article deleted successfully' });
    }
    catch (error) {
        console.error('Delete article error:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
};
exports.deleteArticle = deleteArticle;
const likeArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        const article = await Article_1.Article.findById(id);
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        const existing = await Article_1.ArticleLike.findOne({ user: req.user.id, article: id });
        if (existing) {
            await Article_1.ArticleLike.deleteOne({ _id: existing._id });
            res.json({ message: 'Like removed', liked: false });
        }
        else {
            await Article_1.ArticleLike.create({ user: req.user.id, article: id });
            res.json({ message: 'Like added', liked: true });
        }
    }
    catch (error) {
        console.error('Like article error:', error);
        res.status(500).json({ error: 'Failed to like article' });
    }
};
exports.likeArticle = likeArticle;
const getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const { page, limit, skip } = (0, validation_1.parseQuery)(req.query);
        const total = await Article_1.Comment.countDocuments({ article: id, parent: null });
        const comments = await Article_1.Comment.find({ article: id, parent: null })
            .populate('author', 'email name image')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        // Get replies for each comment
        const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
            const replies = await Article_1.Comment.find({ parent: comment._id })
                .populate('author', 'email name image')
                .sort({ created_at: 1 })
                .lean();
            return {
                ...comment,
                replies
            };
        }));
        res.json({
            results: commentsWithReplies,
            count: total,
            page,
            limit
        });
    }
    catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ error: 'Failed to get comments' });
    }
};
exports.getComments = getComments;
const createComment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        const { content, parent } = req.body;
        if (!content) {
            res.status(400).json({ error: 'Content is required' });
            return;
        }
        const article = await Article_1.Article.findById(id);
        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }
        const comment = new Article_1.Comment({
            article: id,
            author: req.user.id,
            content,
            parent: parent || null
        });
        await comment.save();
        await comment.populate('author', 'email name image');
        res.status(201).json({
            message: 'Comment created successfully',
            ...comment.toObject()
        });
    }
    catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
};
exports.createComment = createComment;
const updateComment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const { id, commentId } = req.params;
        const { content } = req.body;
        const comment = await Article_1.Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        if (comment.author.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        comment.content = content || comment.content;
        await comment.save();
        await comment.populate('author', 'email name image');
        res.json({
            message: 'Comment updated successfully',
            ...comment.toObject()
        });
    }
    catch (error) {
        console.error('Update comment error:', error);
        res.status(500).json({ error: 'Failed to update comment' });
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const { commentId } = req.params;
        const comment = await Article_1.Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        if (comment.author.toString() !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        await Article_1.Comment.deleteOne({ _id: commentId });
        await Article_1.CommentLike.deleteMany({ comment: commentId });
        res.json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};
exports.deleteComment = deleteComment;
const likeComment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const { commentId } = req.params;
        const comment = await Article_1.Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        const existing = await Article_1.CommentLike.findOne({ user: req.user.id, comment: commentId });
        if (existing) {
            await Article_1.CommentLike.deleteOne({ _id: existing._id });
            res.json({ message: 'Like removed', liked: false });
        }
        else {
            await Article_1.CommentLike.create({ user: req.user.id, comment: commentId });
            res.json({ message: 'Like added', liked: true });
        }
    }
    catch (error) {
        console.error('Like comment error:', error);
        res.status(500).json({ error: 'Failed to like comment' });
    }
};
exports.likeComment = likeComment;
//# sourceMappingURL=articleController.js.map