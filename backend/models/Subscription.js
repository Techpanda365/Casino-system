const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  planName: { type: String, default: 'Basic' },
  status: { type: Boolean, default: false }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
