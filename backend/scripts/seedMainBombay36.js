const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const MainBombay36 = require('../models/MainBombay36');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const TIME_SLOTS = [];
for (let h = 11; h <= 19; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 19 && m > 45) break;
    const hour = h % 12 || 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    TIME_SLOTS.push(`${hour}:${String(m).padStart(2, '0')} ${ampm}`);
  }
}

const random3 = () => String(Math.floor(100 + Math.random() * 900));
const random1 = () => String(Math.floor(Math.random() * 10));

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const admins = await Admin.find({ role: { $ne: 'superadmin' } });
    if (admins.length === 0) {
      console.log('No regular admins found');
      await mongoose.connection.close();
      return;
    }

    for (const admin of admins) {
      console.log(`Seeding Main Bombay 36 for ${admin.email} (${admin.siteSlug})`);
      await MainBombay36.deleteMany({ adminId: admin._id });

      for (let day = 0; day < 7; day++) {
        const d = new Date();
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);

        const slots = TIME_SLOTS.map((time, i) => {
          const filled = i < 20 - day * 2;
          return {
            time,
            value: filled ? `${random3()}-${random1()}` : ''
          };
        });

        await MainBombay36.create({ adminId: admin._id, date: d, slots });
        console.log(`  ${d.toLocaleDateString('en-IN')} — ${slots.filter(s => s.value).length} slots filled`);
      }
    }

    await mongoose.connection.close();
    console.log('Done! Main Bombay 36 chart data seeded.');
  } catch (err) {
    console.error('Error:', err.message);
    await mongoose.connection.close();
  }
};

seed();
