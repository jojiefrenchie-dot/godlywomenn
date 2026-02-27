import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../config/auth.js';
import { query } from '../config/database.js';

const router = Router();

// Get all prayers
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT p.*, u.first_name, u.last_name 
      FROM prayers p 
      LEFT JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get prayers error:', error);
    res.status(500).json({ error: 'Failed to get prayers' });
  }
});

// Create prayer
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = (req as any).user.id;

    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    const result = await query(
      'INSERT INTO prayers (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create prayer error:', error);
    res.status(500).json({ error: 'Failed to create prayer' });
  }
});

export default router;
