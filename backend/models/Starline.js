const mongoose = require('mongoose');

const StarlineSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  slots: [{
    time: String,
    result: { type: String, default: '' }
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

StarlineSchema.index({ adminId: 1, name: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Starline', StarlineSchema);
