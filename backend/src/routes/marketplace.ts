import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../config/auth.js';
import { query } from '../config/database.js';

const router = Router();

// Get all marketplace items
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT m.*, u.first_name, u.last_name 
      FROM marketplace m 
      LEFT JOIN users u ON m.user_id = u.id 
      ORDER BY m.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get marketplace error:', error);
    res.status(500).json({ error: 'Failed to get marketplace items' });
  }
});

// Create marketplace item
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description, price, image } = req.body;
    const userId = (req as any).user.id;

    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price required' });
    }

    const result = await query(
      'INSERT INTO marketplace (title, description, price, image, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, price, image, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create marketplace item error:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

export default router;
