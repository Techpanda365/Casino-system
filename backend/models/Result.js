const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  market: { type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true },
  date: { type: Date, required: true },
  openPatti: { type: String, default: '' },
  jodi: { type: String, default: '' },
  closePatti: { type: String, default: '' },
  status: { type: String, enum: ['open', 'closed'], default: 'closed' }
});

ResultSchema.index({ market: 1, date: -1 }, { unique: true });

module.exports = mongoose.model('Result', ResultSchema);
