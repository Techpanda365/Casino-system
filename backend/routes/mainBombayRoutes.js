const express = require('express');
const MainBombay36 = require('../models/MainBombay36');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { adminId: req.admin.id };
    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      filter.date = { $gte: start, $lte: end };
    }
    const records = await MainBombay36.find(filter).sort({ date: -1 });
    return res.json(records);
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

router.get('/dates', auth, async (req, res) => {
  try {
    const records = await MainBombay36.find({ adminId: req.admin.id }).sort({ date: -1 }).select('date');
    return res.json(records.map(r => r.date));
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { date, slots } = req.body;
    const d = new Date(date);
    const start = new Date(d.setHours(0, 0, 0, 0));
    const end = new Date(d.setHours(23, 59, 59, 999));

    let record = await MainBombay36.findOne({
      adminId: req.admin.id,
      date: { $gte: start, $lte: end }
    });

    if (record) {
      record.slots = slots;
      await record.save();
      return res.json({ msg: 'Updated', record });
    }

    record = new MainBombay36({
      adminId: req.admin.id,
      date: start,
      slots
    });
    await record.save();
    return res.json({ msg: 'Saved', record });
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await MainBombay36.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    return res.json({ msg: 'Deleted' });
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;
