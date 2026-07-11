const express = require("express");
const Market = require("../models/Market");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const markets = await Market.find({ adminId: req.admin.id }).sort({ displayOrder: 1 });
    return res.json(markets);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, displayOrder, active, openTime, closeTime, category, finalAnk } = req.body;
    console.log(name, displayOrder, active, openTime, closeTime, category, finalAnk,"marketData")
    const market = new Market({
      adminId: req.admin.id, name, displayOrder, active, openTime, closeTime, category, finalAnk
    });
    console.log(market,"market")
    await market.save();
    return res.json({ msg: "Market created", market });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const market = await Market.findOneAndUpdate(
      { _id: req.params.id, adminId: req.admin.id },
      req.body,
      { new: true }
    );
    if (!market) return res.status(404).json({ msg: "Market not found" });
    res.json({ msg: "Market updated", market });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const market = await Market.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    if (!market) return res.status(404).json({ msg: "Market not found" });
    res.json({ msg: "Market deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
