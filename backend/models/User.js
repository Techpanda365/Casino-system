const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  badge: { type: String, enum: ['bronze', 'silver', 'gold', 'diamond', 'platinum'], default: 'bronze' },
  postCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.index({ adminId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
