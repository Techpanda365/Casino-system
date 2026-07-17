const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const SiteSetting = require('../models/SiteSetting');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const aboutUsContent = (siteName) => `
<div class="space-y-4 text-xs leading-relaxed">
  <p><strong class="text-amber-400">${siteName}</strong> is India's fastest and most trusted Satta Matka result platform. We provide live Satta Matka results, free guessing, daily Jodi/Panel charts, and expert number analysis for Matka players across India.</p>

  <p>Our platform is designed to give you the fastest Satta Matka results with accurate updates. We cover all major markets including Kalyan Matka, Milan Day/Night, Rajdhani Day/Night, Main Bazar, Time Bazar, and many more. Whether you are looking for the latest Satta result, old chart records, or free game tips — <strong class="text-amber-400">${siteName}</strong> is your one-stop destination.</p>

  <h3 class="text-amber-400 font-bold text-sm mt-4 mb-2">What We Offer</h3>
  <ul class="list-disc list-inside space-y-1 text-gray-300">
    <li><strong>Live Results</strong> — Fastest Satta Matka results updated in real-time for all markets.</li>
    <li><strong>Jodi Chart</strong> — Complete historical Jodi records organized week-wise, just like dpboss.</li>
    <li><strong>Panel Chart</strong> — Day-wise Panel chart with Open Patti, Jodi, and Close Patti data.</li>
    <li><strong>Free Guessing</strong> — Expert number guessing and game tips shared daily by our Matka experts.</li>
    <li><strong>Aaj Kya Pass Hua</strong> — Daily passing number updates for all markets.</li>
    <li><strong>Forum Section</strong> — Community forum where users share their guessing and discuss Matka numbers.</li>
    <li><strong>Starline Results</strong> — Starline game results with charts and records.</li>
    <li><strong>Main Bombay 36</strong> — Special Main Bombay 36 game results and records.</li>
  </ul>

  <h3 class="text-amber-400 font-bold text-sm mt-4 mb-2">Our Mission</h3>
  <p>Our mission is to provide the most accurate and fastest Satta Matka results to our users. We understand that Matka players need reliable and timely information to make informed decisions. That's why we have built a platform that updates results instantly as soon as they are declared.</p>

  <p>We are committed to maintaining the highest standards of accuracy and transparency. Our team works 24/7 to ensure that every result, chart, and record on our platform is correct and up-to-date.</p>

  <h3 class="text-amber-400 font-bold text-sm mt-4 mb-2">Why Choose Us?</h3>
  <ul class="list-disc list-inside space-y-1 text-gray-300">
    <li><strong>Fastest Results</strong> — We update results within seconds of declaration.</li>
    <li><strong>Complete Records</strong> — Full historical data with Jodi and Panel charts going back years.</li>
    <li><strong>Free Service</strong> — All our results, charts, and guessing are completely free.</li>
    <li><strong>User-Friendly</strong> — Easy to navigate website designed for mobile and desktop.</li>
    <li><strong>24/7 Support</strong> — Our team is always available to help you via WhatsApp and Telegram.</li>
    <li><strong>Privacy Focused</strong> — We respect your privacy and never share your personal information.</li>
  </ul>

  <h3 class="text-amber-400 font-bold text-sm mt-4 mb-2">Our History</h3>
  <p><strong class="text-amber-400">${siteName}</strong> has been serving the Satta Matka community since 2011. Over the years, we have grown from a small result website to one of the most trusted Matka platforms in India. Thousands of users visit our site daily to check results, view charts, and participate in our forum discussions.</p>

  <p>We have consistently evolved our platform to meet the changing needs of our users. From adding new markets to improving our chart displays, we always listen to our community and implement features that matter to them.</p>

  <h3 class="text-amber-400 font-bold text-sm mt-4 mb-2">Disclaimer</h3>
  <p class="text-red-400">Satta Matka is a game of chance and skill. Please play responsibly and at your own risk. <strong class="text-amber-400">${siteName}</strong> is not responsible for any financial loss incurred while playing Matka. We do not promote illegal gambling. Our platform is purely for informational and entertainment purposes based on astrology and number calculations. Users must ensure they comply with their local laws before using this website.</p>

  <p class="mt-4 text-gray-400">For any queries or support, contact us on WhatsApp or Telegram. Thank you for choosing <strong class="text-amber-400">${siteName}</strong> — Your trusted Satta Matka partner.</p>
</div>
`;

async function seedAboutUs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const admins = await Admin.find({ role: { $ne: 'superadmin' } });
    if (admins.length === 0) {
      console.log('No admins found.');
      await mongoose.connection.close();
      return;
    }

    for (const admin of admins) {
      let settings = await SiteSetting.findOne({ adminId: admin._id });
      if (!settings) {
        settings = new SiteSetting({ adminId: admin._id });
      }
      settings.aboutUs = aboutUsContent(settings.siteName || 'LUCKY BAZAR');
      await settings.save();
      console.log(`About Us updated for admin: ${admin.email} (${admin.siteSlug})`);
    }

    await mongoose.connection.close();
    console.log('Done! About Us content has been updated.');
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
  }
}

seedAboutUs();
