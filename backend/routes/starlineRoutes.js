const express = require("express");
const Starline = require("../models/Starline");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    const starlines = await Starline.find({
      adminId: req.admin.id,
      date: { $gte: start, $lte: end }
    }).sort({ name: 1 });
    return res.json(starlines);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, slots } = req.body;
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    let starline = await Starline.findOne({ adminId: req.admin.id, name, date: { $gte: start, $lte: end } });
    if (starline) {
      starline.slots = slots;
      await starline.save();
      return res.json({ msg: "Starline updated", starline });
    }

    starline = new Starline({ adminId: req.admin.id, name, date: new Date(), slots });
    await starline.save();
    return res.json({ msg: "Starline added", starline });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const starline = await Starline.findOne({ _id: req.params.id, adminId: req.admin.id });
    console.log(starline,"starline")
    if (!starline) return res.status(404).json({ msg: "Starline not found" });
    if (req.body.slots) starline.slots = req.body.slots;
    if (req.body.name) starline.name = req.body.name;
    if (req.body.status) starline.status = req.body.status;
    await starline.save();
    return res.json({ msg: "Starline updated", starline });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Starline.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    return res.json({ msg: "Starline deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
