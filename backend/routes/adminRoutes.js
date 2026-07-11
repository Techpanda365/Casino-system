const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const SiteSetting = require("../models/SiteSetting");
const { auth, isSuperAdmin } = require("../middleware/auth");

const router = express.Router();

function generateSlug(name) {
  const base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email)
    const admin = await Admin.findOne({ email });
    console.log(admin);
    if (!admin) return res.status(400).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(isMatch,"isMatch")
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (role && admin.role !== role) {
      return res.status(403).json({ msg: `Access denied. This account is not a ${role}.` });
    }

    if (role === "admin" && !admin.subscriptionStatus) {
      return res.status(403).json({ msg: "Your subscription is deactivated. Contact Super Admin." });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log(token,"token")

   return res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        role: admin.role,
        email: admin.email,
        subscriptionStatus: admin.subscriptionStatus,
        siteSlug: admin.siteSlug,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/add", auth, isSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, siteSlug } = req.body;
    console.log(name,email)

    const existingAdmin = await Admin.findOne({ email });
    console.log(existingAdmin,"existingAdmin");
    if (existingAdmin) {
      return res.status(400).json({ msg: "Admin already exists with this email" });
    }

    if (siteSlug) {
      const slugExists = await Admin.findOne({ siteSlug });
      console.log(slugExists,"slugExists");
      if (slugExists) {
        return res.status(400).json({ msg: "Site URL already taken. Choose another." });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log(hashed,"hashed")
    const slug = siteSlug || generateSlug(name);
    console.log(slug,"slug")
    const newAdmin = new Admin({
      name,
      email,
      password: hashed,
      role: "admin",
      subscriptionStatus: true,
      siteSlug: slug,
    });
    await newAdmin.save();

    let a = await SiteSetting.create({ adminId: newAdmin._id });

    console.log(newAdmin,"newAdmin")
    console.log(a,"siteSetting")
    return res.json({
      msg: "Admin added successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        subscriptionStatus: newAdmin.subscriptionStatus,
        siteSlug: newAdmin.siteSlug,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/all", auth, isSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({ role: "admin" }).select("-password");
    console.log(admins,"admins")
    return res.json(admins);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/subscription/:id", auth, isSuperAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status,"status")
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { subscriptionStatus: status },
      { new: true }
    ).select("-password");

    console.log(admin,"admin")
    if (!admin) 
      return res.status(404).json({ msg: "Admin not found" });

    return res.json({
      msg: `Subscription ${status ? "activated" : "deactivated"}`,
      admin,
    });
  } catch (error) {
   return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/site-slug/:id", auth, isSuperAdmin, async (req, res) => {
  try {
    const { siteSlug } = req.body;
    console.log(siteSlug,"siteSlug")
    const existing = await Admin.findOne({ siteSlug, _id: { $ne: req.params.id } });
    console.log(existing,"existing")
    if (existing)
       return res.status(400).json({ msg: "Site URL already taken" });

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { siteSlug },
      { new: true }
    ).select("-password");
    console.log(admin,"admin")

    if (!admin) 
      return res.status(404).json({ msg: "Admin not found" });
    // return res.json({ msg: "Site URL updated", admin });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
