const express = require("express");
const SiteSetting = require("../models/SiteSetting");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    let settings = await SiteSetting.findOne({ adminId: req.admin.id });
    console.log(settings,"settings")
    if (!settings) {
      settings = await SiteSetting.create({ adminId: req.admin.id });
    }
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    let settings = await SiteSetting.findOne({ adminId: req.admin.id });
    if (!settings) {
      settings = new SiteSetting({ adminId: req.admin.id });
    }
    Object.keys(req.body).forEach((key) => {
      if (key !== "adminId" && key in settings) {
        settings[key] = req.body[key];
      }
    });
    await settings.save();
    return res.json({ msg: "Settings updated", settings });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
