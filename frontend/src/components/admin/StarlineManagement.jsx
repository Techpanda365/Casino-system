import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/starline';

const DEFAULT_SLOTS = [
  '09:05 AM', '10:05 AM', '11:05 AM', '12:05 PM',
  '01:05 PM', '02:05 PM', '03:05 PM', '04:05 PM',
  '05:05 PM', '06:05 PM', '07:05 PM', '08:05 PM'
];

function StarlineManagement({ token }) {
  const [starlines, setStarlines] = useState([]);
  const [name, setName] = useState('');
  const [slots, setSlots] = useState(DEFAULT_SLOTS.map(t => ({ time: t, result: '' })));
  const [editingId, setEditingId] = useState(null);
  const [editSlots, setEditSlots] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const r = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
      setStarlines(r.data);
    } catch { console.error('Failed to load'); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Add new starline
  const save = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, { name, slots }, { headers: { Authorization: `Bearer ${token}` } });
      setName('');
      setSlots(DEFAULT_SLOTS.map(t => ({ time: t, result: '' })));
      fetchData();
    } catch (err) { alert(err.response?.data?.msg || 'Failed to save'); }
  };

  const updateSlot = (idx, val) => {
    const c = [...slots];
    c[idx] = { ...c[idx], result: val };
    setSlots(c);
  };

  // Start editing a starline's slots
  const startEdit = (s) => {
    // Merge saved slots with DEFAULT_SLOTS so all times are present
    const merged = DEFAULT_SLOTS.map(t => {
      const found = s.slots.find(sl => sl.time === t);
      return { time: t, result: found ? found.result : '' };
    });
    setEditSlots(merged);
    setEditingId(s._id);
  };

  const updateEditSlot = (idx, val) => {
    const c = [...editSlots];
    c[idx] = { ...c[idx], result: val };
    setEditSlots(c);
  };

  // Save edited slots (PUT request)
  const saveEdit = async (id) => {
    try {
      await axios.put(`${API}/${id}`, { slots: editSlots }, { headers: { Authorization: `Bearer ${token}` } });
      setEditingId(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.msg || 'Failed to update'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this starline?')) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-100 rounded-lg">
          <svg className="w-5 h-5 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Starline Results</h2>
          <p className="text-xs text-gray-500">Time-based result tables for starline markets</p>
        </div>
      </div>

      {/* Add New Starline */}
      <form onSubmit={save} className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 mb-6 border border-cyan-100 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Add New Starline</h3>
        <input
          className="border p-2.5 rounded-lg text-sm w-full"
          placeholder="Starline Name (e.g. MAIN STARLINE)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {slots.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs text-gray-500 w-16">{s.time}</span>
              <input
                className="border p-1.5 rounded text-xs w-20 text-center font-mono"
                placeholder="Result"
                value={s.result}
                onChange={(e) => updateSlot(i, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Add Starline
        </button>
      </form>

      {/* Existing Starlines */}
      <div className="space-y-3">
        {starlines.map((s) => (
          <div key={s._id} className="p-4 bg-white border rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-800">{s.name}</h3>
              <div className="flex gap-2">
                {editingId === s._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(s._id)}
                      className="text-green-600 text-xs font-semibold hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 text-xs hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(s)}
                      className="text-blue-500 text-xs hover:underline"
                    >
                      Edit Slots
                    </button>
                    <button
                      onClick={() => del(s._id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Edit mode */}
            {editingId === s._id ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {editSlots.map((sl, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 w-16">{sl.time}</span>
                    <input
                      className="border p-1.5 rounded text-xs w-20 text-center font-mono"
                      placeholder="Result"
                      value={sl.result}
                      onChange={(e) => updateEditSlot(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* View mode */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                {DEFAULT_SLOTS.map((t) => {
                  const sl = s.slots.find(x => x.time === t);
                  return (
                    <div key={t} className="flex items-center gap-1 text-xs bg-gray-50 rounded px-2 py-1">
                      <span className="text-gray-500">{t}</span>
                      <span className={`font-mono font-bold ${sl?.result ? 'text-gray-800' : 'text-gray-300'}`}>
                        {sl?.result || '---'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {starlines.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No starline results today.</div>
        )}
      </div>
    </div>
  );
}

export default StarlineManagement;
