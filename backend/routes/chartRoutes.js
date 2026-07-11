const express = require("express");
const Chart = require("../models/Chart");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const charts = await Chart.find({ adminId: req.admin.id }).sort({ createdAt: -1 });
   return res.json(charts);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { type, title, marketName, content, data } = req.body;
    console.log(type, title, marketName, content, data,"chartData")
    const chart = new Chart({ adminId: req.admin.id, type, title, marketName: marketName || '', content, data: data || [] });
    await chart.save();
    return res.json({ msg: "Chart saved", chart });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const chart = await Chart.findOneAndUpdate(
      { _id: req.params.id, adminId: req.admin.id },
      { $set: req.body },
      { new: true }
    );
    console.log(chart,"chart")
    if (!chart) 
      return res.status(404).json({ msg: "Chart not found" });
    res.json({ msg: "Chart updated", chart });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Chart.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    console.log(req.params.id,"chartId")
   return res.json({ msg: "Chart deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
