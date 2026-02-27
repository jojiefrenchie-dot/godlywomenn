import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Prayers endpoint' });
});

export default router;
