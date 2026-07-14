const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gameType: { type: String, default: '' },
  gameName: { type: String, default: '' },
  message: { type: String, default: '' },
  record: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
