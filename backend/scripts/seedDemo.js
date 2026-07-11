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
      aboutUs: '<p>Lucky Bazar is India fastest Satta Matka result platform. We provide live results, free guessing, and daily charts.</p>',
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
