const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const SiteSetting = require('../models/SiteSetting');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete old admin + settings
    const oldAdmin = await Admin.findOne({ email: 'super@admin.com' });
    if (oldAdmin) {
      await SiteSetting.deleteOne({ adminId: oldAdmin._id });
      await Admin.deleteOne({ email: 'super@admin.com' });
      console.log('✅ Old admin deleted');
    }

    // Generate hash for 'super@123'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('super@123', salt);
    console.log('🔑 Generated hash:', hashedPassword);

    // Create new super admin
    const admin = new Admin({
      name: 'Super Admin',
      email: 'super@admin.com',
      password: hashedPassword,
      role: 'superadmin',
      subscriptionStatus: true,
    });

    await admin.save();
    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email: super@admin.com');
    console.log('🔑 Password: super@123');
    console.log('🆔 ID:', admin._id);
    console.log('ℹ️  Super admin does not have a public site URL');

    await mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
};

createSuperAdmin();