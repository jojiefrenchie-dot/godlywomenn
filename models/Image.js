const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['profile', 'article', 'marketplace'], required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to user, article, or marketplace item
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', ImageSchema);
