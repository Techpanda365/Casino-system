const express = require("express");
const Result = require("../models/Result");
const Market = require("../models/Market");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const myMarkets = await Market.find({ adminId: req.admin.id }).select("_id");
    console.log(myMarkets,"myMarkets")
    const marketIds = myMarkets.map((m) => m._id);

    const { marketId, date } = req.query;
    console.log(marketId,date,"queryParams")
    const filter = { market: { $in: marketIds } };
    if (marketId) filter.market = marketId;
    console.log(filter,"filter")
    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      filter.date = { $gte: start, $lte: end };
    }
    const results = await Result.find(filter).populate("market").sort({ date: -1 });
    console.log(results,"results")
   return res.json(results);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { market, date, openPatti, jodi, closePatti, status } = req.body;
    console.log(market,date,openPatti,jodi,closePatti,status,"resultData")
    const marketDoc = await Market.findOne({ _id: market, adminId: req.admin.id });
    if (!marketDoc) return res.status(403).json({ msg: "Market not found or not yours" });

    const result = new Result({ market, date, openPatti, jodi, closePatti, status });
    await result.save();
    return res.json({ msg: "Result created", result });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("market");
    console.log(result,"result")
    if (!result || result.market.adminId.toString() !== req.admin.id) {
      return res.status(404).json({ msg: "Result not found" });
    }
    Object.assign(result, req.body);
    await result.save();
    return res.json({ msg: "Result updated", result });
  } catch (error) {
   return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("market");
    console.log(result,"result")
    if (!result || result.market.adminId.toString() !== req.admin.id) {
      return res.status(404).json({ msg: "Result not found" });
    }
    await Result.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Result deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
