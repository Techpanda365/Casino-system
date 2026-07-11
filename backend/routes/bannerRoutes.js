const express = require("express");
const Banner = require("../models/Banner");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const banners = await Banner.find({ adminId: req.admin.id }).sort({ displayOrder: 1 });
    return res.json(banners);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { imageUrl, linkUrl, title, displayOrder } = req.body;
    const banner = new Banner({ adminId: req.admin.id, imageUrl, linkUrl, title, displayOrder });
    await banner.save();
    return res.json({ msg: "Banner saved", banner });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const banner = await Banner.findOneAndUpdate(
      { _id: req.params.id, adminId: req.admin.id },
      { $set: req.body },
      { new: true }
    );
    if (!banner) return res.status(404).json({ msg: "Banner not found" });
    res.json({ msg: "Banner updated", banner });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Banner.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    return res.json({ msg: "Banner deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
