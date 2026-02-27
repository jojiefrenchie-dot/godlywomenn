import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Articles endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create article' });
});

export default router;
