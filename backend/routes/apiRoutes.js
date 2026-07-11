const express = require("express");
const Admin = require("../models/Admin");
const Market = require("../models/Market");
const Result = require("../models/Result");
const Guess = require("../models/Guess");
const Starline = require("../models/Starline");

const router = express.Router();

router.get("/:slug/today", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) 
      return res.status(404).json({ error: "Site not found" });

    const today = new Date();
    console.log(today,"today")
    const start = new Date(today.setHours(0, 0, 0, 0));
    console.log(start,"start")
    const end = new Date(today.setHours(23, 59, 59, 999));
    console.log(end,"end")

    const markets = await Market.find({ adminId: admin._id, active: true }).sort({ displayOrder: 1 });
    const results = await Result.find({
      market: { $in: markets.map(m => m._id) },
      date: { $gte: start, $lte: end }
    }).populate("market");

    const data = results.map(r => ({
      market: r.market.name,
      openPatti: r.openPatti,
      jodi: r.jodi,
      closePatti: r.closePatti,
      status: r.status,
      date: r.date
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:slug/markets", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ error: "Site not found" });
    const markets = await Market.find({ adminId: admin._id, active: true }).select("name openTime closeTime finalAnk displayOrder");
    res.json({ success: true, count: markets.length, data: markets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:slug/starline", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ error: "Site not found" });

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const starlines = await Starline.find({
      adminId: admin._id,
      date: { $gte: start, $lte: end },
      status: "active"
    }).sort({ name: 1 });

    res.json({ success: true, count: starlines.length, data: starlines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:slug/guesses", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ error: "Site not found" });

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const guesses = await Guess.find({
      adminId: admin._id,
      date: { $gte: start, $lte: end },
      status: "active"
    }).populate("marketId", "name").sort({ "marketId.name": 1 });

    res.json({ success: true, count: guesses.length, data: guesses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
