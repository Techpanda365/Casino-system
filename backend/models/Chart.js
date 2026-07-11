const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  type: { type: String, enum: ['weekly', 'cardlist', 'jodi-count', 'jodi-family', 'penal-count', 'penal-total', 'card-list-220', 'weekly-patti', 'weekly-open-close', 'weekly-jodi'], required: true },
  title: { type: String, required: true },
  marketName: { type: String, default: '' },
  content: { type: String, default: '' },
  data: [{
    label: String,
    value: String,
    sub: String
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Chart', ChartSchema);
