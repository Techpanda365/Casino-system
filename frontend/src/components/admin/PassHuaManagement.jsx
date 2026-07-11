import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/passhua';
const MARKETS_API = 'http://localhost:5000/api/markets';

function PassHuaManagement({ token }) {
  const [entries, setEntries] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [marketName, setMarketName] = useState('');
  const [customMarket, setCustomMarket] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const fetchData = useCallback(async () => {
    try {
      const [passRes, mktRes] = await Promise.all([
        axios.get(API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(MARKETS_API, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setEntries(passRes.data.entries || []);
      setMarkets(mktRes.data || []);
    } catch { console.error('Failed to load'); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Save all entries to backend
  const saveEntries = async (updatedEntries) => {
    setSaving(true);
    try {
      await axios.post(API, { entries: updatedEntries }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Add new entry
  const addEntry = async (e) => {
    e.preventDefault();
    const name = marketName === '__custom__' ? customMarket.trim() : marketName;
    if (!name || !description.trim()) return;

    const newEntry = { marketName: name, description: description.trim() };
    const updated = [...entries, newEntry];
    setEntries(updated);
    await saveEntries(updated);
    setMarketName('');
    setCustomMarket('');
    setDescription('');
  };

  // Delete entry by index
  const deleteEntry = async (idx) => {
    const updated = entries.filter((_, i) => i !== idx);
    setEntries(updated);
    await saveEntries(updated);
  };

  // Quick description templates
  const templates = [
    'Open Ank Pass',
    'Close Ank Pass',
    'Open Ank & Close Ank Pass',
    'Jodi Pass',
    'Single Patti Pass',
    'Double Patti Pass',
    'Open Patti Pass',
    'Close Patti Pass',
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11L12 14L22 4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Aaj Kya Pass Hua</h2>
          <p className="text-xs text-gray-500">
            Date: <span className="font-semibold text-green-600">{today}</span> — Daily announcement for public site
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-xs text-gray-600">
        <p className="font-bold text-green-700 mb-1">📢 Yeh kya hai?</p>
        <p>Jis market ka aapka diya hua tip (Open Ank, Close Ank, Jodi) sahi nikla — woh yahan announce karo. Public site pe "Aaj Kya Pass Hua" section mein dikhega. Users ka trust badhta hai.</p>
        <p className="mt-1 text-green-600 font-semibold">Example: KALYAN MORNING → Open Ank 2 Pass</p>
      </div>

      {/* Add Form */}
      <form onSubmit={addEntry} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-200">
        <h3 className="text-sm font-bold text-gray-700 mb-3">+ Naya Entry Add Karo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Market select */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Market</label>
            <select
              className="border p-2.5 rounded-lg text-sm w-full bg-white"
              value={marketName}
              onChange={(e) => setMarketName(e.target.value)}
              required
            >
              <option value="">Market Select Karo</option>
              {markets.map((m) => (
                <option key={m._id} value={m.name}>{m.name}</option>
              ))}
              <option value="__custom__">-- Custom Name --</option>
            </select>
            {marketName === '__custom__' && (
              <input
                className="border p-2 rounded-lg text-sm w-full mt-1"
                placeholder="Market name likho"
                value={customMarket}
                onChange={(e) => setCustomMarket(e.target.value)}
              />
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Kya Pass Hua</label>
            <input
              className="border p-2.5 rounded-lg text-sm w-full"
              placeholder="e.g. Open Ank 2 Pass, Close Ank 9 Pass"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {/* Quick templates */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {templates.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDescription(description ? `${description}, ${t}` : t)}
                  className="text-[10px] px-2 py-0.5 bg-white border border-green-200 text-green-700 rounded-full hover:bg-green-100 transition"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : '+ Add Entry'}
        </button>
      </form>

      {/* Today's entries */}
      {entries.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-3xl mb-2">📢</p>
          <p>Aaj abhi koi announcement nahi hai.</p>
          <p className="text-xs mt-1">Upar se add karo jab koi tip pass ho jaye.</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700">
              Aaj Ki Announcements ({entries.length})
            </h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
              📅 {today}
            </span>
          </div>

          <div className="space-y-2 mb-6">
            {entries.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white border border-green-100 rounded-xl">
                <div>
                  <span className="font-bold text-sm text-green-700">{e.marketName}</span>
                  <span className="text-gray-400 mx-2">⇒</span>
                  <span className="text-sm text-gray-700">{e.description}</span>
                </div>
                <button
                  onClick={() => deleteEntry(i)}
                  className="text-xs text-red-400 hover:text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition ml-3"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Public Preview */}
          <h3 className="text-sm font-bold text-gray-700 mb-2">👁️ Public Site Preview</h3>
          <div className="bg-[#0d0d1a] rounded-xl p-3">
            <div className="text-center border-b border-white/[0.1] pb-2 mb-2">
              <span className="text-white font-bold text-xs uppercase tracking-widest">AAJ KYA PASS HUA</span>
            </div>
            <div className="text-center mb-2">
              <span className="text-slate-400 text-xs">Date :- {today}</span>
            </div>
            <div className="space-y-1">
              {entries.map((e, i) => (
                <div key={i} className="text-xs text-center">
                  <span className="text-amber-400 font-bold">{e.marketName}</span>
                  <span className="text-slate-400 mx-1">=&gt;</span>
                  <span className="text-white">{e.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PassHuaManagement;
