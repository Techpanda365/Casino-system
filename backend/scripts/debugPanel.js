const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Admin = require('../models/Admin');
const Market = require('../models/Market');
const Result = require('../models/Result');

const getWeekStart = (d) => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(new Date(d).getTime() + istOffset);
  const day = ist.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(ist.getTime() + diff * 86400000);
  const y = mon.getUTCFullYear();
  const m = String(mon.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(mon.getUTCDate()).padStart(2, '0');
  return y + '-' + m + '-' + dd;
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await Admin.findOne({ siteSlug: 'rahul-w9x0' });
  const markets = await Market.find({ adminId: admin._id, name: 'KARNATAKA DAY' });

  if (markets.length === 0) { console.log('Market not found'); process.exit(0); }

  const market = markets[0];
  const results = await Result.find({ market: market._id })
    .sort({ date: -1 }).limit(2000)
    .select('date openPatti jodi closePatti').lean();
  results.reverse();

  console.log('Market:', market.name);
  console.log('Results count:', results.length);
  console.log('');

  const weekMap = {};
  results.forEach((r) => {
    const wKey = getWeekStart(r.date);
    if (!weekMap[wKey]) weekMap[wKey] = [];
    weekMap[wKey].push({
      date: r.date,
      openPatti: r.openPatti || '* * *',
      jodi: r.jodi || '**',
      closePatti: r.closePatti || '* * *',
    });
  });

  const weekKeys = Object.keys(weekMap).sort();
  const panelWeeks = weekKeys.map((wKey) => {
    const days = weekMap[wKey];
    return { label: wKey, days };
  });

  console.log('API response:');
  console.log(JSON.stringify(panelWeeks, null, 2));

  await mongoose.connection.close();
})();
