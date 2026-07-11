import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/guesses';
const MARKETS_API = 'http://localhost:5000/api/markets';

function GuessManagement({ token }) {
  const [guesses, setGuesses] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [marketId, setMarketId] = useState('');
  const [openClose, setOpenClose] = useState('');
  const [panel, setPanel] = useState('');
  const [jodi, setJodi] = useState('');

  // Edit form state
  const [editOpenClose, setEditOpenClose] = useState('');
  const [editPanel, setEditPanel] = useState('');
  const [editJodi, setEditJodi] = useState('');

  const fetchGuesses = useCallback(async () => {
    try {
      const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
      setGuesses(res.data);
    } catch { console.error('Failed to load guesses'); }
  }, [token]);

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await axios.get(MARKETS_API, { headers: { Authorization: `Bearer ${token}` } });
      setMarkets(res.data);
    } catch { console.error('Failed to load markets'); }
  }, [token]);

  useEffect(() => { fetchMarkets(); fetchGuesses(); }, [fetchMarkets, fetchGuesses]);

  // Add new guess
  const addGuess = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, { marketId, openClose, panel, jodi }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMarketId(''); setOpenClose(''); setPanel(''); setJodi('');
      fetchGuesses();
    } catch (err) { alert(err.response?.data?.msg || 'Failed to save'); }
  };

  // Start editing
  const startEdit = (g) => {
    setEditingId(g._id);
    setEditOpenClose(g.openClose || '');
    setEditPanel(g.panel || '');
    setEditJodi(g.jodi || '');
  };

  // Save edit (POST with same marketId updates existing record)
  const saveEdit = async (g) => {
    try {
      await axios.post(API, {
        marketId: g.marketId._id,
        openClose: editOpenClose,
        panel: editPanel,
        jodi: editJodi
      }, { headers: { Authorization: `Bearer ${token}` } });
      setEditingId(null);
      fetchGuesses();
    } catch (err) { alert(err.response?.data?.msg || 'Failed to update'); }
  };

  const deleteGuess = async (id) => {
    if (!window.confirm('Delete this guess?')) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchGuesses();
    } catch { alert('Failed to delete'); }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-100 rounded-lg">
          <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Free Fix Game Zone</h2>
          <p className="text-xs text-gray-500">
            Aaj ka date: <span className="font-semibold text-amber-600">{today}</span> — Daily Open-Close Fix Ank for public site
          </p>
        </div>
      </div>

      {/* Format Guide */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-xs text-gray-600 space-y-1">
        <p className="font-bold text-amber-700 mb-2">📋 Format Guide (Reference site jaisa)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-2 border border-amber-100">
            <p className="font-semibold text-gray-700">Open-Close Ank</p>
            <p className="font-mono text-amber-600 mt-0.5">5-0-3-8</p>
            <p className="text-gray-400 text-[10px]">Single digits dash se separate</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-amber-100">
            <p className="font-semibold text-gray-700">Panel (Patti)</p>
            <p className="font-mono text-amber-600 mt-0.5">140-190-238-288</p>
            <p className="text-gray-400 text-[10px]">3-digit numbers dash se separate</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-amber-100">
            <p className="font-semibold text-gray-700">Jodi</p>
            <p className="font-mono text-amber-600 mt-0.5">58-08-30-80</p>
            <p className="text-gray-400 text-[10px]">2-digit jodiyan dash se separate</p>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={addGuess} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 mb-6 border border-amber-200">
        <h3 className="text-sm font-bold text-gray-700 mb-3">+ Naya Market Add Karo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            className="border p-2.5 rounded-lg text-sm bg-white"
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            required
          >
            <option value="">Market Select Karo</option>
            {markets.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          <input
            className="border p-2.5 rounded-lg text-sm font-mono"
            placeholder="Open-Close: 5-0-3-8"
            value={openClose}
            onChange={(e) => setOpenClose(e.target.value)}
          />
          <input
            className="border p-2.5 rounded-lg text-sm font-mono"
            placeholder="Panel: 140-190-238"
            value={panel}
            onChange={(e) => setPanel(e.target.value)}
          />
          <input
            className="border p-2.5 rounded-lg text-sm font-mono"
            placeholder="Jodi: 58-08-30-80"
            value={jodi}
            onChange={(e) => setJodi(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg transition-all"
          >
            + Add
          </button>
        </div>
      </form>

      {/* Guess List */}
      {guesses.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-2xl mb-2">🎯</p>
          <p>Aaj koi guess nahi hai. Upar se add karo.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Preview header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700">
              Aaj ke Guesses ({guesses.length} markets)
            </h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              ✅ DATE: {today}
            </span>
          </div>

          {guesses.map((g) => (
            <div key={g._id} className="border rounded-xl overflow-hidden bg-white">
              {editingId === g._id ? (
                /* ── Edit Mode ── */
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-amber-700">
                      ↪ {g.marketId?.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(g)}
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">OPEN-CLOSE ANK</label>
                      <input
                        className="border p-2 rounded-lg text-sm font-mono w-full"
                        placeholder="5-0-3-8"
                        value={editOpenClose}
                        onChange={(e) => setEditOpenClose(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">PANEL</label>
                      <input
                        className="border p-2 rounded-lg text-sm font-mono w-full"
                        placeholder="140-190-238"
                        value={editPanel}
                        onChange={(e) => setEditPanel(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">JODI</label>
                      <input
                        className="border p-2 rounded-lg text-sm font-mono w-full"
                        placeholder="58-08-30-80"
                        value={editJodi}
                        onChange={(e) => setEditJodi(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ── View Mode ── */
                <div className="flex items-start justify-between p-4">
                  <div className="flex-1">
                    <div className="font-bold text-sm text-amber-700 mb-2">
                      ↪ {g.marketId?.name || 'Unknown'}
                    </div>
                    <div className="space-y-1">
                      {g.openClose && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-24 font-semibold">OPEN-CLOSE:</span>
                          <span className="font-mono font-bold text-gray-800 tracking-wider">{g.openClose}</span>
                        </div>
                      )}
                      {g.panel && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-24 font-semibold">PANEL:</span>
                          <span className="font-mono text-gray-700 tracking-wider">{g.panel}</span>
                        </div>
                      )}
                      {g.jodi && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-24 font-semibold">JODI:</span>
                          <span className="font-mono text-gray-700 tracking-wider">{g.jodi}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEdit(g)}
                      className="text-xs text-blue-500 hover:text-blue-700 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGuess(g._id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Public Preview */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-700 mb-2">
              👁️ Public Site Preview
            </h3>
            <div className="bg-[#0d0d1a] rounded-xl p-3 space-y-2">
              <div className="text-center py-1">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">
                  FREE GAME ZONE OPEN-CLOSE
                </span>
                <div className="text-green-400 text-[10px] mt-0.5">✔ DATE: {today}</div>
              </div>
              {guesses.map((g) => (
                <div key={g._id} className="bg-white/[0.03] border border-white/[0.1] rounded-lg p-2.5">
                  <div className="text-amber-400 font-bold text-xs mb-1">↪ {g.marketId?.name}</div>
                  {g.openClose && <div className="text-white font-mono text-xs font-bold tracking-wider">{g.openClose}</div>}
                  {g.panel && <div className="text-slate-300 font-mono text-xs tracking-wider">{g.panel}</div>}
                  {g.jodi && <div className="text-slate-400 font-mono text-xs tracking-wider">{g.jodi}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuessManagement;
