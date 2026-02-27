import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../config/auth.js';
import { query } from '../config/database.js';

const router = Router();

// Get user messages
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await query(`
      SELECT m.*, 
             s.email as sender_email, s.first_name as sender_name,
             r.email as receiver_email, r.first_name as receiver_name
      FROM messages m 
      LEFT JOIN users s ON m.sender_id = s.id 
      LEFT JOIN users r ON m.receiver_id = r.id 
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY m.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send message
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { receiver_id, content } = req.body;
    const senderId = (req as any).user.id;

    if (!receiver_id || !content) {
      return res.status(400).json({ error: 'Receiver and content required' });
    }

    const result = await query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [senderId, receiver_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
