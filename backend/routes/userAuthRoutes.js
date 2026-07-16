const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, slug } = req.body;
    if (!name || !email || !password || !slug) return res.status(400).json({ msg: "All fields required" });

    const admin = await Admin.findOne({ siteSlug: slug });
    if (!admin) return res.status(404).json({ msg: "Site not found" });

    const existing = await User.findOne({ adminId: admin._id, email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ adminId: admin._id, name, email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id, adminId: admin._id, name: user.name, role: 'user' }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, badge: user.badge, avatar: user.avatar, postCount: user.postCount } });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, slug } = req.body;
    if (!email || !password || !slug) return res.status(400).json({ msg: "All fields required" });

    const admin = await Admin.findOne({ siteSlug: slug });
    if (!admin) return res.status(404).json({ msg: "Site not found" });

    const user = await User.findOne({ adminId: admin._id, email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    if (!user.isActive) return res.status(403).json({ msg: "Account disabled" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, adminId: admin._id, name: user.name, role: 'user' }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, badge: user.badge, avatar: user.avatar, postCount: user.postCount } });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Get user by token
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'user') return res.status(401).json({ msg: "Not a user token" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json({ id: user._id, name: user.name, email: user.email, badge: user.badge, avatar: user.avatar, postCount: user.postCount });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
});

// Update profile
router.put("/profile", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'user') return res.status(401).json({ msg: "Not a user token" });

    const { name, avatar } = req.body;
    const update = {};
    if (name) update.name = name;
    if (avatar !== undefined) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(decoded.id, { $set: update }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json({ id: user._id, name: user.name, badge: user.badge, avatar: user.avatar, postCount: user.postCount });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
