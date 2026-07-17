const axios = require('axios');

(async () => {
  try {
    const login = await axios.post('http://localhost:5000/api/admin/login', { email: 'demo@admin.com', password: 'demo123' });
    const token = login.data.token;

    const settings = {
      siteName: 'LUCKY BAZAR',
      welcomeText: 'Welcome to Lucky Bazar !! Satta Matka Fast Result',
      luckyNumber: '56',
      goldenAnk: '9',
      whatsappNumber: '919999999999',
      email: 'support@luckybazar.com',
      telegramChannel: 'https://t.me/luckybazar',
      appDownloadUrl: 'https://luckybazar.com/app',
      aboutUs: '<div class="space-y-4 text-xs leading-relaxed"><p><strong class="text-amber-400">LUCKY BAZAR</strong> is India\'s fastest and most trusted Satta Matka result platform. We provide live Satta Matka results, free guessing, daily Jodi/Panel charts, and expert number analysis for Matka players across India.</p><p>Our platform is designed to give you the fastest Satta Matka results with accurate updates. We cover all major markets including Kalyan Matka, Milan Day/Night, Rajdhani Day/Night, Main Bazar, Time Bazar, and many more.</p><h3 class="text-amber-400 font-bold text-sm mt-4 mb-2">What We Offer</h3><ul class="list-disc list-inside space-y-1 text-gray-300"><li><strong>Live Results</strong> — Fastest Satta Matka results updated in real-time.</li><li><strong>Jodi Chart</strong> — Complete historical Jodi records organized week-wise.</li><li><strong>Panel Chart</strong> — Day-wise Panel chart with Open Patti, Jodi, Close Patti.</li><li><strong>Free Guessing</strong> — Expert number guessing and game tips daily.</li><li><strong>Aaj Kya Pass Hua</strong> — Daily passing number updates.</li><li><strong>Forum Section</strong> — Community forum for discussing Matka numbers.</li></ul><h3 class="text-amber-400 font-bold text-sm mt-4 mb-2">Our Mission</h3><p>Our mission is to provide the most accurate and fastest Satta Matka results to our users. We are committed to maintaining the highest standards of accuracy and transparency.</p><h3 class="text-amber-400 font-bold text-sm mt-4 mb-2">Disclaimer</h3><p class="text-red-400">Satta Matka is a game of chance and skill. Please play responsibly and at your own risk. LUCKY BAZAR is not responsible for any financial loss incurred while playing Matka. We do not promote illegal gambling.</p></div>',
      header: '<marquee style="color:#fff;background:#dc2626;padding:4px">Play responsibly. This is a game of skill and chance.</marquee>',
      footer: '&copy; Lucky Bazar. All rights reserved.',
    };

    await axios.put('http://localhost:5000/api/settings', settings, { headers: { Authorization: 'Bearer ' + token } });
    console.log('Settings saved');

    // Create some demo markets
    const markets = [
      { name: 'MILAN DAY', openTime: '10:00 AM', closeTime: '4:00 PM', displayOrder: 1 },
      { name: 'MILAN NIGHT', openTime: '8:00 PM', closeTime: '12:00 AM', displayOrder: 2 },
      { name: 'RAJDHANI DAY', openTime: '10:00 AM', closeTime: '4:00 PM', displayOrder: 3 },
      { name: 'RAJDHANI NIGHT', openTime: '9:00 PM', closeTime: '12:00 AM', displayOrder: 4 },
      { name: 'KALYAN', openTime: '11:00 AM', closeTime: '5:00 PM', displayOrder: 5 },
      { name: 'MAIN BAZAR', openTime: '8:00 PM', closeTime: '11:00 PM', displayOrder: 6 },
    ];

    for (const m of markets) {
      try {
        const res = await axios.post('http://localhost:5000/api/markets', m, { headers: { Authorization: 'Bearer ' + token } });
        console.log('Market:', m.name, '-', res.data.msg);
      } catch(e) {
        const msg = e.response?.data?.msg || e.message;
        if (msg.includes('duplicate') || msg.includes('E11000')) {
          console.log('Already exists:', m.name);
        } else {
          console.log('Error for', m.name, ':', msg);
        }
      }
    }

    console.log('Done!');
  } catch(e) {
    console.error('Error:', e.response?.data?.msg || e.message);
  }
})();
