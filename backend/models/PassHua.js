const mongoose = require('mongoose');

const PassHuaSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  date: { type: Date, required: true },
  entries: [
    {
      marketName: { type: String, required: true },
      description: { type: String, required: true }
      // e.g. "Open Ank 2 Pass" or "Close Ank 9 Pass, Jodi 29 Pass"
    }
  ],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

PassHuaSchema.index({ adminId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('PassHua', PassHuaSchema);
