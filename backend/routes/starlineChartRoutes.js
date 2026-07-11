const express = require("express");
const StarlineChart = require("../models/StarlineChart");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const charts = await StarlineChart.find({ adminId: req.admin.id }).sort({ createdAt: -1 });
    return res.json(charts);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { starlineName, title, content, data } = req.body;
    const chart = new StarlineChart({ 
      adminId: req.admin.id, 
      starlineName, 
      title, 
      content, 
      data: data || [],
      status: "active"  // ✅ Add this
    });
    await chart.save();
    return res.json({ msg: "Starline chart saved", chart });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const chart = await StarlineChart.findOneAndUpdate(
      { _id: req.params.id, adminId: req.admin.id },
      { $set: { ...req.body, status: "active" } }, // ✅ Add status
      { new: true }
    );
    if (!chart) return res.status(404).json({ msg: "Chart not found" });
    res.json({ msg: "Starline chart updated", chart });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await StarlineChart.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    return res.json({ msg: "Starline chart deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;