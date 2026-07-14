import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api/public';

const GAME_TYPES = ['Mumbai Side Game', 'Kalyan Game', 'Starline Game', 'Main Bombay 36', 'Other'];

function ContactPage() {
  const { slug } = useParams();
  const [settings, setSettings] = useState({});
  const [charts, setCharts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', gameType: '', gameName: '', message: '', record: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    axios.get(`${API}/settings/${slug}`).then((r) => setSettings(r.data || {})).catch(() => {});
    axios.get(`${API}/charts/${slug}`).then((r) => setCharts(r.data)).catch(() => {});
  }, [slug]);

  const handleChange = (e) => {
    const { name: field, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [field]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.gameType || !form.gameName) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact/${slug}`, form);
      toast.success('Form submitted successfully!');
      setForm({ name: '', email: '', phone: '', gameType: '', gameName: '', message: '', record: false });
    } catch {
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const chartTypes = ['time-chart', 'sridevi-chart', 'kalyan-morning-chart', 'madhuri-chart', 'kalyan-chart', 'sridevi-night-chart', 'kalyan-night-chart', 'old-main-mumbai-chart', 'main-bazar-chart', 'milan-morning-chart', 'milan-day-chart', 'milan-night-chart', 'madhuri-night-chart', 'madhur-morning-chart', 'madhur-day-chart', 'madhur-night-chart', 'rajdhani-night-chart'];
  const chartLabels = {
    'time-chart': 'Time Chart', 'sridevi-chart': 'Sridevi Chart', 'kalyan-morning-chart': 'Kalyan Morning Chart',
    'madhuri-chart': 'Madhuri Chart', 'kalyan-chart': 'Kalyan Chart', 'sridevi-night-chart': 'Sridevi Night Chart',
    'kalyan-night-chart': 'Kalyan Night Chart', 'old-main-mumbai-chart': 'Old Main Mumbai Chart',
    'main-bazar-chart': 'Main Bazar Chart', 'milan-morning-chart': 'Milan Morning Chart',
    'milan-day-chart': 'Milan Day Chart', 'milan-night-chart': 'Milan Night Chart',
    'madhuri-night-chart': 'Madhuri Night Chart', 'madhur-morning-chart': 'Madhur Morning Chart',
    'madhur-day-chart': 'Madhur Day Chart', 'madhur-night-chart': 'Madhur Night Chart',
    'rajdhani-night-chart': 'Rajdhani Night Chart'
  };
  const penalTypes = ['time-panel', 'sridevi-panel', 'kalyan-morning-panel', 'madhuri-penal', 'padmavathi-penal', 'kalyan-penal', 'sridevi-night-penal', 'kalyan-night-penal', 'old-main-mumbai-panel', 'main-bazar-penal', 'milan-morning-panel', 'milan-day-penal', 'milan-night-penal', 'madhuri-night-panel', 'rajdhani-night-panel', 'madhur-morning-day', 'madhur-day-panel'];
  const penalLabels = {
    'time-panel': 'Time Panel Chart', 'sridevi-panel': 'Sridevi Panel Chart', 'kalyan-morning-panel': 'Kalyan Morning Panel Chart',
    'madhuri-penal': 'Madhuri Penal Chart', 'padmavathi-penal': 'Padmavathi Penal Chart', 'kalyan-penal': 'Kalyan Penal Chart',
    'sridevi-night-penal': 'Sridevi Night Penal Chart', 'kalyan-night-penal': 'Kalyan Night Penal Chart',
    'old-main-mumbai-panel': 'Old Main Mumbai Panel Chart', 'main-bazar-penal': 'Main Bazar Penal Chart',
    'milan-morning-panel': 'Milan Morning Panel Chart', 'milan-day-penal': 'Milan Day Penal Chart',
    'milan-night-penal': 'Milan Night Penal Chart', 'madhuri-night-panel': 'Madhuri Night Panel Chart',
    'rajdhani-night-panel': 'Rajdhani Night Panel Chart', 'madhur-morning-day': 'Madhur Morning Day Chart',
    'madhur-day-panel': 'Madhur Day Panel Chart'
  };

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <header className="bg-gradient-to-r from-amber-600 to-amber-500 shadow-lg shadow-amber-500/10">
        <div className="px-3 py-1.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            {settings.logo && <img src={settings.logo} alt="Logo" className="h-7 w-auto" />}
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">{settings.siteName || 'Lucky Bazar'}</h1>
              <p className="text-[8px] font-medium text-white/70">{settings.siteName || 'Lucky Bazar'} • FAST RESULT • FREE GAME</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 py-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.12] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
              </div>
              <h2 className="text-base font-bold text-white">Contact Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Customer Name <span className="text-red-400">*</span></label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Please enter your name" required
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Game Type <span className="text-red-400">*</span></label>
                <select name="gameType" value={form.gameType} onChange={handleChange} required
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 transition">
                  <option value="" className="bg-slate-800">Select game type</option>
                  {GAME_TYPES.map(t => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Game Name <span className="text-red-400">*</span></label>
                <input type="text" name="gameName" value={form.gameName} onChange={handleChange} placeholder="Please enter game you want" required
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Email <span className="text-red-400">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Please enter your email" required
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Contact No. <span className="text-red-400">*</span></label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Please enter your phone" required
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Message (Optional)</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Your message..."
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition" />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input type="checkbox" name="record" checked={form.record} onChange={handleChange} className="accent-amber-500" />
                Do saal se adhik ka record
              </label>

              <p className="text-[10px] text-slate-500">* These fields are required.</p>

              <button type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-sm py-2.5 rounded-lg hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-3">
            <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-4">
              <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">Contact Number</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider mb-0.5">Address</p>
                  <p className="text-slate-300">Matka HeadOffice, Kalyan, Mumbai, Maharashtra 421301</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider mb-0.5">Email</p>
                  <a href={`mailto:${settings.email || 'support@luckybazar.com'}`} className="text-amber-400 hover:text-amber-300 transition">{settings.email || 'support@luckybazar.com'}</a>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider mb-0.5">WhatsApp</p>
                  <a href={settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g,'')}` : '#'} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition">{settings.whatsappNumber || 'N/A'}</a>
                </div>
              </div>
            </div>

            {charts.length > 0 && (
              <>
                {/* Jodi Charts */}
                <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-3">
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">SATTA MATKA JODI CHART</h3>
                  <div className="flex flex-col divide-y divide-white/[0.06]">
                    {chartTypes.map(type => (
                      <Link key={type} to={`/site/${slug}/chart/${type}`}
                        className="py-1.5 text-xs text-slate-400 hover:text-amber-400 transition"
                      >
                        {chartLabels[type] || type}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Panel Charts */}
                <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-3">
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">MATKA PANEL CHART</h3>
                  <div className="flex flex-col divide-y divide-white/[0.06]">
                    {penalTypes.map(type => (
                      <Link key={type} to={`/site/${slug}/chart/${type}`}
                        className="py-1.5 text-xs text-slate-400 hover:text-amber-400 transition"
                      >
                        {penalLabels[type] || type}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-4 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>Hello, all the Satta Matka Enthusiasts! Welcome to the contact details of our website {settings.siteName || 'Lucky Bazar'} Services. If you are a customer and you have any queries, then you can fill out the below form here and then contact us.</p>
          <p>We will respond as soon as we check your email. So here you need to fill your name in the customer name field. Then you need to enter the game name you want to play specifically. Then you have to add your contact details here. It should be your phone number, and then you need to select the game type, and then your email, after that you can send us a message.</p>
          <p>If you want to know our address, here is our physical address written on the right side, and here is our official email where you can send us an email for any important query. Here, you can see our pinpoint location on the Google map, and you can reach out if you want to see our office.</p>
          <p>Okay, so this is our contact page, and here is our contact number, you can contact us by filling out the form and dont forget to enter all the details we asked for, otherwise your form will not be submitted.</p>
          <p>That's all from this page. I hope you will contact us when you need anything from us. Don't hesitate to contact us. Our experts are available 24/7 to help you with your queries. Just don't forget to add proper details when you submit the form, and carefully fill it out.</p>
          <p>All the entries are mandatory. You cannot skip any of the entry blanks. Make sure you fill out the form correctly, and we will respond to you as soon as we get your email. Thank you so much. We wish you very good luck with your next Satta Matka Games. May you always win!</p>
        </div>
      </main>

      <footer className="border-t border-white/[0.12] mt-2 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="text-amber-400 font-bold text-sm tracking-wider">LUCKYBAZAR</p>
          <p className="text-[10px] text-slate-500">All Rights Reserved&reg; (1998-2026)</p>
          <p className="text-[10px] text-slate-500">Contact (Astrologer)</p>
          <div className="pt-1">
            <Link to={`/site/${slug}`} className="text-amber-400 hover:text-amber-300 text-xs font-medium transition inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactPage;
