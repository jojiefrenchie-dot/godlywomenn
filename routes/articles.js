const express = require('express');
const Article = require('../models/Article');

const router = express.Router();

// Create article
router.post('/', async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const article = new Article({ title, content, images });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().populate('images');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('images');
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update article
router.put('/:id', async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, images },
      { new: true }
    );
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete article
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
