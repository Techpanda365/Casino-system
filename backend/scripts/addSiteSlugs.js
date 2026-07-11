const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const SiteSetting = require('../models/SiteSetting');
require('dotenv').config();

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const admins = await Admin.find({});
  for (const admin of admins) {
    if (admin.role === 'superadmin') {
      console.log(`Skipping super admin ${admin.email}`);
      continue;
    }

    if (!admin.siteSlug) {
      const slug = admin.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Math.random().toString(36).substring(2, 6);
      admin.siteSlug = slug;
      await admin.save();
      console.log(`Added slug "${slug}" to ${admin.email}`);
    }

    const exists = await SiteSetting.findOne({ adminId: admin._id });
    if (!exists) {
      await SiteSetting.create({ adminId: admin._id });
      console.log(`Created settings for ${admin.email}`);
    }
  }

  console.log('Migration complete');
  await mongoose.disconnect();
}

migrate().catch(console.error);
