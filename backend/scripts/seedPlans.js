const axios = require('axios');

(async () => {
  try {
    const login = await axios.post('http://localhost:5000/api/admin/login', { email: 'super@admin.com', password: 'super@123' });
    const token = login.data.token;

    const plans = [
      { name: 'Basic', price: 0, duration: 30, features: { maxMarkets: 3, charts: false, starline: false, guesses: false, passHua: false, customDomain: false, apiAccess: false }, popular: false },
      { name: 'Silver', price: 299, duration: 30, features: { maxMarkets: 10, charts: true, starline: true, guesses: false, passHua: false, customDomain: false, apiAccess: false }, popular: false },
      { name: 'Gold', price: 999, duration: 90, features: { maxMarkets: 0, charts: true, starline: true, guesses: true, passHua: true, customDomain: false, apiAccess: false }, popular: true },
      { name: 'Platinum', price: 2999, duration: 365, features: { maxMarkets: 0, charts: true, starline: true, guesses: true, passHua: true, customDomain: true, apiAccess: true }, popular: false },
    ];

    for (const p of plans) {
      try {
        const res = await axios.post('http://localhost:5000/api/plans', p, { headers: { Authorization: 'Bearer ' + token } });
        console.log('Created:', p.name, '-', res.data.msg);
      } catch(e) {
        console.log('Error for', p.name, ':', e.response?.data?.msg || e.message);
      }
    }

    console.log('Done!');
  } catch(e) {
    console.error('Error:', e.response?.data?.msg || e.message);
  }
})();
