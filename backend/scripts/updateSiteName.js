const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const SiteSetting = require('../models/SiteSetting');

async function updateSiteName() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  let setting = await SiteSetting.findOne();
  if (!setting) {
    setting = new SiteSetting();
  }
  setting.siteName = 'LUCKY BAZAR';
  setting.welcomeText = 'Welcome to Lucky Bazar !! Satta Matka Fast Result';
  await setting.save();
  console.log('Site name updated to: LUCKY BAZAR');

  await mongoose.disconnect();
  console.log('Done');
}

updateSiteName().catch(console.error);
