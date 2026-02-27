import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../config/auth.js';
import { query } from '../config/database.js';

const router = Router();

// Get all articles
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT a.*, u.first_name, u.last_name 
      FROM articles a 
      LEFT JOIN users u ON a.author_id = u.id 
      ORDER BY a.created_at DESC 
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Failed to get articles' });
  }
});

// Get article by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await query(`
      SELECT a.*, u.first_name, u.last_name 
      FROM articles a 
      LEFT JOIN users u ON a.author_id = u.id 
      WHERE a.slug = $1
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Failed to get article' });
  }
});

// Create article
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, slug, excerpt, content, featured_image, category } = req.body;
    const userId = (req as any).user.id;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO articles (title, slug, excerpt, content, featured_image, category, author_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, slug, excerpt, content, featured_image, category, userId, 'published']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, featured_image, category, status } = req.body;
    const userId = (req as any).user.id;

    // Check ownership
    const articleResult = await query('SELECT author_id FROM articles WHERE id = $1', [id]);
    if (articleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (articleResult.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await query(
      `UPDATE articles SET title = $1, content = $2, excerpt = $3, featured_image = $4, category = $5, status = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, content, excerpt, featured_image, category, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Check ownership
    const articleResult = await query('SELECT author_id FROM articles WHERE id = $1', [id]);
    if (articleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (articleResult.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query('DELETE FROM articles WHERE id = $1', [id]);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export default router;
