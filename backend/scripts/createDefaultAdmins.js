const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const SiteSetting = require('../models/SiteSetting');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const admins = [
  { name: 'Super Admin', email: 'super@admin.com', password: 'super@123', role: 'superadmin', siteSlug: undefined },
  { name: 'Admin', email: 'admin@demo.com', password: 'admin@123', role: 'admin', siteSlug: 'mysite' },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const a of admins) {
    await Admin.deleteOne({ email: a.email });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(a.password, salt);
    const admin = new Admin({ ...a, password: hashedPassword, subscriptionStatus: true });
    await admin.save();
    console.log(`✅ ${a.role}: ${a.email} / ${a.password}`);
    // Create site settings for regular admin
    if (a.role === 'admin') {
      await SiteSetting.deleteOne({ adminId: admin._id });
      await new SiteSetting({ adminId: admin._id, siteName: 'LUCKY BAZAR' }).save();
    }
  }
  await mongoose.connection.close();
  console.log('Done!');
}
run().catch(e => { console.error(e); process.exit(1); });
