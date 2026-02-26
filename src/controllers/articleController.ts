import { Response } from 'express';
import { Article, Comment, ArticleLike, ArticleView, CommentLike } from '../models/Article';
import { AuthRequest } from '../config/auth';
import { parseQuery, generateSlug } from '../utils/validation';

export const listArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = parseQuery(req.query);
    const { status = 'published', category, search } = req.query;

    let query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
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
  } catch (error) {
    console.error('List articles error:', error);
    res.status(500).json({ error: 'Failed to list articles' });
  }
};

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const slug = generateSlug(title) + '-' + Date.now();

    const article = new Article({
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
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
};

export const getArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).populate('author', 'email name image');
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    // Record view if user is authenticated
    if (req.user) {
      await ArticleView.updateOne(
        { user: req.user.id, article: id },
        { $set: { user: req.user.id, article: id } },
        { upsert: true }
      );
    }

    // Increment view count
    article.view_count += 1;
    await article.save();

    // Get likes and comments count
    const likes = await ArticleLike.countDocuments({ article: id });
    const comments = await Comment.countDocuments({ article: id, parent: null });

    res.json({
      ...article.toObject(),
      likes_count: likes,
      comments_count: comments
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Failed to get article' });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { title, content, excerpt, category, status } = req.body;

    const article = await Article.findById(id);
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
      article.slug = generateSlug(title) + '-' + Date.now();
    }
    if (content) article.content = content;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (category) article.category = category;
    if (status) article.status = status;

    if (req.file) {
      article.featured_image = `/media/articles/${req.file.filename}`;
    }

    await article.save();
    await article.populate('author', 'email name image');

    res.json({
      message: 'Article updated successfully',
      ...article.toObject()
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    if (article.author.toString() !== req.user.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await Article.deleteOne({ _id: id });
    await Comment.deleteMany({ article: id });
    await ArticleLike.deleteMany({ article: id });
    await ArticleView.deleteMany({ article: id });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

export const likeArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const existing = await ArticleLike.findOne({ user: req.user.id, article: id });

    if (existing) {
      await ArticleLike.deleteOne({ _id: existing._id });
      res.json({ message: 'Like removed', liked: false });
    } else {
      await ArticleLike.create({ user: req.user.id, article: id });
      res.json({ message: 'Like added', liked: true });
    }
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({ error: 'Failed to like article' });
  }
};

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { page, limit, skip } = parseQuery(req.query);

    const total = await Comment.countDocuments({ article: id, parent: null });
    const comments = await Comment.find({ article: id, parent: null })
      .populate('author', 'email name image')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parent: comment._id })
          .populate('author', 'email name image')
          .sort({ created_at: 1 })
          .lean();

        return {
          ...comment,
          replies
        };
      })
    );

    res.json({
      results: commentsWithReplies,
      count: total,
      page,
      limit
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const comment = new Comment({
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
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id, commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
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
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (comment.author.toString() !== req.user.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await Comment.deleteOne({ _id: commentId });
    await CommentLike.deleteMany({ comment: commentId });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

export const likeComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const existing = await CommentLike.findOne({ user: req.user.id, comment: commentId });

    if (existing) {
      await CommentLike.deleteOne({ _id: existing._id });
      res.json({ message: 'Like removed', liked: false });
    } else {
      await CommentLike.create({ user: req.user.id, comment: commentId });
      res.json({ message: 'Like added', liked: true });
    }
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Failed to like comment' });
  }
};
