const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const SiteSetting = require('../models/SiteSetting');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const seedSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admins = await Admin.find({ role: { $ne: 'superadmin' } });
    if (admins.length === 0) {
      console.log('❌ No regular admins found. Create an admin first.');
      await mongoose.connection.close();
      return;
    }

    for (const admin of admins) {
      let settings = await SiteSetting.findOne({ adminId: admin._id });
      if (!settings) {
        settings = new SiteSetting({ adminId: admin._id });
      }

      settings.whatsappNumber = settings.whatsappNumber || '919876543210';
      settings.telegramChannel = settings.telegramChannel || 'https://t.me/luckybazar';
      settings.email = settings.email || 'support@luckybazar.com';
      settings.appDownloadUrl = settings.appDownloadUrl || 'https://example.com/app.apk';
      settings.siteName = settings.siteName || 'LUCKY BAZAR';
      settings.welcomeText = settings.welcomeText || 'Welcome to Lucky Bazar !! Satta Matka Fast Result';

      await settings.save();
      console.log(`✅ Settings seeded for admin: ${admin.email} (${admin.siteSlug})`);
    }

    await mongoose.connection.close();
    console.log('✅ Done! Visit your public site to see the App/WhatsApp section.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
};

seedSettings();
