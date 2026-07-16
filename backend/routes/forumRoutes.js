const express = require("express");
const jwt = require("jsonwebtoken");
const Forum = require("../models/Forum");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Helper to extract user from token (optional)
const getUserFromToken = (req) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'user') return null;
    return decoded;
  } catch { return null; }
};

// Admin: get all forums
router.get("/", auth, async (req, res) => {
  try {
    const forums = await Forum.find({ adminId: req.admin.id }).sort({ createdAt: -1 });
    return res.json(forums);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Admin: create forum post
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

// Admin: update
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

// Admin: delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Forum.findOneAndDelete({ _id: req.params.id, adminId: req.admin.id });
    return res.json({ msg: "Forum post deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Public: create post (logged-in user)
router.post("/user-post", async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) return res.status(401).json({ msg: "Please login first" });

    const { section, title, content } = req.body;
    if (!section || !content) return res.status(400).json({ msg: "Section and content required" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!user.isActive) return res.status(403).json({ msg: "Account disabled" });

    const forum = new Forum({
      adminId: decoded.adminId,
      userId: user._id,
      userName: user.name,
      userBadge: user.badge,
      section,
      title: title || `${user.name}'s Post`,
      content
    });
    await forum.save();

    await User.findByIdAndUpdate(user._id, { $inc: { postCount: 1 } });

    return res.json({ msg: "Post created", forum });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Public: like/unlike post
router.post("/like/:id", async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) return res.status(401).json({ msg: "Please login first" });

    const forum = await Forum.findById(req.params.id);
    if (!forum) return res.status(404).json({ msg: "Post not found" });

    const alreadyLiked = forum.likes.some(id => id.toString() === decoded.id);
    if (alreadyLiked) {
      forum.likes.pull(decoded.id);
    } else {
      forum.likes.push(decoded.id);
    }
    await forum.save();

    return res.json({ likes: forum.likes.length, liked: !alreadyLiked });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Public: reply to post
router.post("/reply/:id", async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) return res.status(401).json({ msg: "Please login first" });

    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: "Content required" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const forum = await Forum.findById(req.params.id);
    if (!forum) return res.status(404).json({ msg: "Post not found" });

    forum.replies.push({
      userId: user._id,
      userName: user.name,
      userBadge: user.badge,
      content
    });
    await forum.save();

    const newReply = forum.replies[forum.replies.length - 1];
    return res.json({ msg: "Reply added", reply: newReply });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
