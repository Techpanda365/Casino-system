const mongoose = require('mongoose');

const MainBombay36Schema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  date: { type: Date, required: true },
  slots: [{
    time: { type: String, required: true },
    value: { type: String, default: '' }
  }]
}, { timestamps: true });

MainBombay36Schema.index({ adminId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MainBombay36', MainBombay36Schema);
