const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userBadge: { type: String, default: 'bronze' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ForumSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userName: { type: String, default: 'Admin' },
  userBadge: { type: String, default: 'gold' },
  section: { type: String, enum: ['special-game', 'guessing-forum', 'expert-forum', 'trick-zone', 'fix-game', 'ratan-khatri', 'final-trick', 'evergreen-trick'], required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [ReplySchema],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Forum', ForumSchema);
