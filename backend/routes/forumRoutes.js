const express = require("express");
const Forum = require("../models/Forum");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const forums = await Forum.find({ adminId: req.admin.id }).sort({ createdAt: -1 });
    return res.json(forums);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { section, title, content } = req.body;
    const forum = new Forum({ adminId: req.admin.id, section, title, content });
    await forum.save();
    return res.json({ msg: "Forum post saved", forum });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const forum = await Forum.findOneAndUpdate(
      { _id: req.params.id, adminId: req.admin.id },
      { $set: req.body },
      { new: true }
    );
    if (!forum) return res.status(404).json({ msg: "Forum post not found" });
    res.json({ msg: "Forum post updated", forum });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Forum.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    return res.json({ msg: "Forum post deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
