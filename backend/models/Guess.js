const mongoose = require('mongoose');

const GuessSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  marketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true },
  date: { type: Date, required: true },
  openClose: { type: String, default: '' },
  panel: { type: String, default: '' },
  jodi: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

GuessSchema.index({ adminId: 1, marketId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Guess', GuessSchema);
