const mongoose = require('mongoose');

const ForumSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  section: { type: String, enum: ['special-game', 'guessing-forum', 'expert-forum', 'trick-zone', 'fix-game', 'ratan-khatri', 'final-trick', 'evergreen-trick'], required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Forum', ForumSchema);
