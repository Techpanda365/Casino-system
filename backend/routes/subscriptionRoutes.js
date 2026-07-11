const express = require('express');
const Subscription = require('../models/Subscription');
const Admin = require('../models/Admin');
const { auth, isSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// Get subscription status of logged-in admin
router.get('/my-status', auth, async (req, res) => {
  const admin = await Admin.findById(req.admin.id);
  res.json({ subscriptionStatus: admin.subscriptionStatus });
});

// Toggle subscription (superadmin)
router.put('/toggle/:id', auth, isSuperAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });
    const newStatus = !admin.subscriptionStatus;
    admin.subscriptionStatus = newStatus;
    await admin.save();
    res.json({ msg: `Subscription ${newStatus ? 'activated' : 'deactivated'}`, subscriptionStatus: newStatus });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;
