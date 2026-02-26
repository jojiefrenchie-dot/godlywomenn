const express = require('express');
const Marketplace = require('../models/Marketplace');

const router = express.Router();

// Create marketplace item
router.post('/', async (req, res) => {
  try {
    const { name, description, price, images } = req.body;
    const item = new Marketplace({ name, description, price, images });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all items
router.get('/', async (req, res) => {
  try {
    const items = await Marketplace.find().populate('images');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Marketplace.findById(req.params.id).populate('images');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, images } = req.body;
    const item = await Marketplace.findByIdAndUpdate(
      req.params.id,
      { name, description, price, images },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Marketplace.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
