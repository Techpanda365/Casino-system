const express = require("express");
const Guess = require("../models/Guess");
const Market = require("../models/Market");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const today = new Date();
    console.log(today,"today")
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    console.log(start,"start")
    console.log(end,"end")

    const guesses = await Guess.find({
      adminId: req.admin.id,
      date: { $gte: start, $lte: end }
    }).populate("marketId", "name").sort({ "marketId.name": 1 });

    console.log(guesses,"guesses")
   return res.json(guesses);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { marketId, openClose, panel, jodi } = req.body;
    console.log(marketId, openClose, panel, jodi,"guessData")

    const market = await Market.findOne({ _id: marketId, adminId: req.admin.id });
    if (!market) return res.status(404).json({ msg: "Market not found" });

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    console.log(start,"start")
    console.log(end,"end")

    const existing = await Guess.findOne({
      adminId: req.admin.id,
      marketId,
      date: { $gte: start, $lte: end }
    });

    if (existing) {
      existing.openClose = openClose || '';
      existing.panel = panel || '';
      existing.jodi = jodi || '';
      await existing.save();
      return res.json({ msg: "Guess updated", guess: existing });
    }

    const guess = new Guess({
      adminId: req.admin.id,
      marketId,
      date: new Date(),
      openClose: openClose || '',
      panel: panel || '',
      jodi: jodi || ''
    });

    let a = await guess.save();
    console.log(a,"guess")
    res.json({ msg: "Guess added", guess });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const guess = await Guess.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    if (!guess) return res.status(404).json({ msg: "Guess not found" });
    res.json({ msg: "Guess deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
