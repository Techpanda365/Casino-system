const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: '' },
  title: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);
