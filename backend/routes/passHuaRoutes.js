const express = require('express');
const PassHua = require('../models/PassHua');
const Market = require('../models/Market');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    let record = await PassHua.findOne({
      adminId: req.admin.id,
      date: { $gte: start, $lte: end }
    });
    console.log(record,"passHuaRecord")

    if (!record) return res.json({ entries: [] });
   return res.json(record);
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { entries } = req.body; // [{ marketName, description }]

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    let record = await PassHua.findOne({
      adminId: req.admin.id,
      date: { $gte: start, $lte: end }
    });
console.log(record,"passHuaRecord")
    if (record) {
      record.entries = entries;
      await record.save();
      return res.json({ msg: 'Updated', record });
    }

    record = new PassHua({
      adminId: req.admin.id,
      date: new Date(),
      entries
    });
    await record.save();
   return res.json({ msg: 'Saved', record });
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


router.delete('/entry/:index', auth, async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const record = await PassHua.findOne({
      adminId: req.admin.id,
      date: { $gte: start, $lte: end }
    });
console.log(record,"passHuaRecord")
    if (!record) return res.status(404).json({ msg: 'No record found' });

    const idx = parseInt(req.params.index);
    record.entries.splice(idx, 1);
    await record.save();
    return res.json({ msg: 'Entry deleted', record });
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;
