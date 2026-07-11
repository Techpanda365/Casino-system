const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  openTime: { type: String, default: '' },
  closeTime: { type: String, default: '' },
  category: { type: String, default: 'day' },
  finalAnk: { type: String, default: '' }
});

MarketSchema.index({ adminId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Market', MarketSchema);
