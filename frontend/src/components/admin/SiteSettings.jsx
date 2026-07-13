import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api/settings';
const API_MARKETS = 'http://localhost:5000/api/markets';
const UPLOAD_API = 'http://localhost:5000/api/upload';

function SiteSettings({ token }) {
  const [markets, setMarkets] = useState([]);
  const [form, setForm] = useState({
    siteName: '', logo: '', favicon: '', header: '', footer: '',
    welcomeText: '', luckyNumber: '', goldenAnk: '',
    whatsappNumber: '', email: '', telegramChannel: '', aboutUs: '', appDownloadUrl: '',
    themeBg: '#0a0a14', themeCardBg: 'rgba(255,255,255,0.03)', themeBorder: 'rgba(255,255,255,0.12)',
    themePrimary: '#f59e0b', themePrimaryDark: '#d97706',
    themeText: '#ffffff', themeTextMuted: '#94a3b8',
    themeHeaderBg: 'linear-gradient(to right, #d97706, #f59e0b)',
    themeSectionBg: 'linear-gradient(to right, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
    themeResultBg: '#f59e0b', themeResultText: '#000000',
    themeSectionText: '#f59e0b', themeCardRadius: '0.5rem',
    themeHoverBg: 'rgba(255,255,255,0.08)', themeShadow: 'rgba(245,158,11,0.2)',
    themeFont: 'inherit',
    addMarketEnabled: false,
    addMarketTitle: 'Add Your Market',
    addMarketContent: '',
    addMarketWhatsapp: '',
    addMarketEmail: ''
  });
  const [uploading, setUploading] = useState({ logo: false, favicon: false });

  const logoRef = useRef();
  const faviconRef = useRef();

  const fetchSettings = useCallback(async () => {
    try {
      const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
      const d = res.data;
      setForm({
        siteName: d.siteName || '',
        logo: d.logo || '',
        favicon: d.favicon || '',
        header: d.header || '',
        footer: d.footer || '',
        welcomeText: d.welcomeText || '',
        luckyNumber: d.luckyNumber || '',
        goldenAnk: d.goldenAnk || '',
        whatsappNumber: d.whatsappNumber || '',
        email: d.email || '',
        telegramChannel: d.telegramChannel || '',
        aboutUs: d.aboutUs || '',
        appDownloadUrl: d.appDownloadUrl || '',
        themeBg: d.themeBg || '#0a0a14',
        themeCardBg: d.themeCardBg || 'rgba(255,255,255,0.03)',
        themeBorder: d.themeBorder || 'rgba(255,255,255,0.12)',
        themePrimary: d.themePrimary || '#f59e0b',
        themePrimaryDark: d.themePrimaryDark || '#d97706',
        themeText: d.themeText || '#ffffff',
        themeTextMuted: d.themeTextMuted || '#94a3b8',
        themeHeaderBg: d.themeHeaderBg || 'linear-gradient(to right, #d97706, #f59e0b)',
        themeSectionBg: d.themeSectionBg || 'linear-gradient(to right, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
        themeResultBg: d.themeResultBg || '#f59e0b',
        themeResultText: d.themeResultText || '#000000',
        themeSectionText: d.themeSectionText || '#f59e0b',
        themeCardRadius: d.themeCardRadius || '0.5rem',
        themeHoverBg: d.themeHoverBg || 'rgba(255,255,255,0.08)',
        themeShadow: d.themeShadow || 'rgba(245,158,11,0.2)',
        themeFont: d.themeFont || 'inherit',
        addMarketEnabled: d.addMarketEnabled || false,
        addMarketTitle: d.addMarketTitle || 'Add Your Market',
        addMarketContent: d.addMarketContent || '',
        addMarketWhatsapp: d.addMarketWhatsapp || '',
        addMarketEmail: d.addMarketEmail || ''
      });
    } catch { toast.error('Failed to load settings'); }
  }, [token]);

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await axios.get(API_MARKETS, { headers: { Authorization: `Bearer ${token}` } });
      setMarkets(res.data);
    } catch {}
  }, [token]);

  useEffect(() => { fetchSettings(); fetchMarkets(); }, [fetchSettings, fetchMarkets]);

  // Upload image file → get URL back
  const handleFileUpload = async (file, field) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await axios.post(UPLOAD_API, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setForm(prev => ({ ...prev, [field]: res.data.url }));
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Upload failed. Max size 2MB, images only.');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loading = toast.loading('Saving...');
    try {
      await axios.put(API, form, { headers: { Authorization: `Bearer ${token}` } });
      toast.dismiss(loading);
      toast.success('Settings saved successfully!');
    } catch { toast.dismiss(loading); toast.error('Failed to save settings'); }
  };

  const textFields = [
    { key: 'siteName', label: 'Site Name' },
    { key: 'welcomeText', label: 'Welcome Text' },
    { key: 'luckyNumber', label: 'Lucky Number' },
    { key: 'goldenAnk', label: 'Golden Ank' },
    { key: 'whatsappNumber', label: 'WhatsApp Number' },
    { key: 'email', label: 'Email' },
    { key: 'telegramChannel', label: 'Telegram Channel' },
    { key: 'appDownloadUrl', label: 'App Download URL' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-amber-400">Site Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">

        {/* ── Logo Upload ── */}
        <div className="border rounded-xl p-4 bg-slate-800/30 border-slate-700 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Logo</label>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Preview */}
            {form.logo ? (
              <img src={form.logo} alt="Logo" className="h-12 w-auto rounded border bg-slate-900 p-1 object-contain border-slate-600" />
            ) : (
              <div className="h-12 w-20 rounded border border-slate-600 bg-slate-900 flex items-center justify-center text-slate-500 text-xs">
                No Logo
              </div>
            )}

            {/* File picker */}
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
            />
            <button
              type="button"
              onClick={() => logoRef.current.click()}
              disabled={uploading.logo}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
            >
              {uploading.logo ? 'Uploading...' : 'Upload Logo'}
            </button>

            {/* OR manual URL */}
            <span className="text-slate-400 text-xs">or paste URL:</span>
            <input
              type="text"
              className="border border-slate-600 bg-slate-900 p-1.5 rounded text-xs flex-1 min-w-0 text-white"
              placeholder="https://..."
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
            />
            {form.logo && (
              <button
                type="button"
                onClick={() => setForm({ ...form, logo: '' })}
                className="text-red-400 text-xs hover:text-red-300"
              >
                ✕ Remove
              </button>
            )}
          </div>
        </div>

        {/* ── Favicon Upload ── */}
        <div className="border rounded-xl p-4 bg-slate-800/30 border-slate-700 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Favicon</label>
          <div className="flex items-center gap-3 flex-wrap">
            {form.favicon ? (
              <img src={form.favicon} alt="Favicon" className="h-8 w-8 rounded border bg-slate-900 p-0.5 object-contain border-slate-600" />
            ) : (
              <div className="h-8 w-8 rounded border border-slate-600 bg-slate-900 flex items-center justify-center text-slate-500 text-[10px]">
                ico
              </div>
            )}

            <input
              ref={faviconRef}
              type="file"
              accept="image/*,.ico"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files[0], 'favicon')}
            />
            <button
              type="button"
              onClick={() => faviconRef.current.click()}
              disabled={uploading.favicon}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
            >
              {uploading.favicon ? 'Uploading...' : 'Upload Favicon'}
            </button>

            <span className="text-slate-400 text-xs">or paste URL:</span>
            <input
              type="text"
              className="border border-slate-600 bg-slate-900 p-1.5 rounded text-xs flex-1 min-w-0 text-white"
              placeholder="https://..."
              value={form.favicon}
              onChange={(e) => setForm({ ...form, favicon: e.target.value })}
            />
            {form.favicon && (
              <button
                type="button"
                onClick={() => setForm({ ...form, favicon: '' })}
                className="text-red-400 text-xs hover:text-red-300"
              >
                ✕ Remove
              </button>
            )}
          </div>
        </div>

        {/* ── Other Text Fields ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textFields.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-slate-300 block mb-1">{f.label}</label>
              <input
                type="text"
                className="w-full border border-slate-600 bg-slate-900 p-2 rounded text-sm text-white"
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* ── HTML Fields ── */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Header HTML</label>
          <textarea className="w-full border border-slate-600 bg-slate-900 p-2 rounded text-sm h-20 text-white" value={form.header}
            onChange={(e) => setForm({ ...form, header: e.target.value })} />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Footer HTML</label>
          <textarea className="w-full border border-slate-600 bg-slate-900 p-2 rounded text-sm h-20 text-white" value={form.footer}
            onChange={(e) => setForm({ ...form, footer: e.target.value })} />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">About Us (HTML)</label>
          <textarea className="w-full border border-slate-600 bg-slate-900 p-2 rounded text-sm h-32 text-white" value={form.aboutUs}
            onChange={(e) => setForm({ ...form, aboutUs: e.target.value })} />
        </div>

        {/* ── Add Market Section ── */}
        <div className="border rounded-xl p-4 bg-slate-800/30 border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-400">Add Your Market Section</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-slate-400">Enable</span>
              <input type="checkbox" checked={form.addMarketEnabled}
                onChange={(e) => setForm({ ...form, addMarketEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-500" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Title</label>
              <input type="text" className="w-full border border-slate-600 bg-slate-900 p-2 rounded text-sm text-white"
                value={form.addMarketTitle} onChange={(e) => setForm({ ...form, addMarketTitle: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp Number</label>
              <input type="text" className="w-full border border-slate-600 bg-slate-900 p-2 rounded text-sm text-white"
                value={form.addMarketWhatsapp} onChange={(e) => setForm({ ...form, addMarketWhatsapp: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
              <input type="text" className="w-full border border-slate-600 bg-slate-900 p-2 rounded text-sm text-white"
                value={form.addMarketEmail} onChange={(e) => setForm({ ...form, addMarketEmail: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Content (HTML)</label>
            <textarea className="w-full border border-slate-600 bg-slate-900 p-2 rounded text-sm h-20 text-white"
              value={form.addMarketContent} onChange={(e) => setForm({ ...form, addMarketContent: e.target.value })} />
          </div>
          {markets.length > 0 && (
            <div className="border-t border-slate-700 pt-3 mt-3">
              <label className="text-xs font-semibold text-slate-300 block mb-2">Your Markets</label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {markets.map(m => (
                  <div key={m._id} className="flex items-center justify-between bg-slate-900 rounded px-3 py-1.5">
                    <span className="text-xs text-slate-300">{m.name}</span>
                    <button onClick={async () => {
                      if (!window.confirm(`Delete "${m.name}"?`)) return;
                      try {
                        await axios.delete(`${API_MARKETS}/${m._id}`, { headers: { Authorization: `Bearer ${token}` } });
                        fetchMarkets();
                        toast.success(`"${m.name}" deleted`);
                      } catch { toast.error('Failed to delete'); }
                    }} className="text-red-500 hover:text-red-400 text-xs font-medium">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Theme Settings ── */}
        <div className="border rounded-xl p-4 bg-slate-800/30 border-slate-700">
          <h3 className="text-sm font-bold text-amber-400 mb-3">Theme Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'themeBg', label: 'Background' },
              { key: 'themeCardBg', label: 'Card BG' },
              { key: 'themeBorder', label: 'Border' },
              { key: 'themePrimary', label: 'Primary / Accent' },
              { key: 'themePrimaryDark', label: 'Primary Dark' },
              { key: 'themeText', label: 'Text Color' },
              { key: 'themeTextMuted', label: 'Muted Text' },
              { key: 'themeResultBg', label: 'Result Card BG' },
              { key: 'themeResultText', label: 'Result Card Text' },
              { key: 'themeSectionText', label: 'Section Header Text' },
              { key: 'themeShadow', label: 'Shadow Color' },
              { key: 'themeHoverBg', label: 'Hover BG' },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{f.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-8 h-8 rounded cursor-pointer border border-slate-600"
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                  <input
                    type="text"
                    className="flex-1 border border-slate-600 bg-slate-900 p-1.5 rounded text-xs font-mono text-white"
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Header BG Gradient</label>
              <input
                type="text"
                className="w-full border border-slate-600 bg-slate-900 p-1.5 rounded text-xs font-mono text-white"
                value={form.themeHeaderBg}
                onChange={(e) => setForm({ ...form, themeHeaderBg: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Section Header BG</label>
              <input
                type="text"
                className="w-full border border-slate-600 bg-slate-900 p-1.5 rounded text-xs font-mono text-white"
                value={form.themeSectionBg}
                onChange={(e) => setForm({ ...form, themeSectionBg: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition font-medium"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default SiteSettings;
