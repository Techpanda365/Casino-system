const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  subscriptionStatus: { type: Boolean, default: false },
  siteSlug: { type: String, unique: true, sparse: true },
  avatar: { type: String, default: '' }
});

module.exports = mongoose.model('Admin', AdminSchema);
