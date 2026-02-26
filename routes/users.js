const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body;
    const user = new User({ username, email, password, profileImage });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('profileImage');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('profileImage');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, password, profileImage },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
