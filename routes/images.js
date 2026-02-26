const express = require('express');
const upload = require('../utils/cloudinary');
const Image = require('../models/Image');

const router = express.Router();


// Create image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, refId } = req.body;
    const image = new Image({
      url: req.file.path || req.file.url,
      type,
      refId,
    });
    await image.save();
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single image
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { type, refId } = req.body;
    const update = {
      type,
      refId,
    };
    if (req.file) update.url = req.file.path;
    const image = await Image.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
