const mongoose = require('mongoose');

const StarlineChartSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  starlineName: { type: String, required: true },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  data: [{ label: String, value: String, sub: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('StarlineChart', StarlineChartSchema);
