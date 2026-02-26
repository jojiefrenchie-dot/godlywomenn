const mongoose = require('mongoose');

const MarketplaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Marketplace', MarketplaceSchema);
