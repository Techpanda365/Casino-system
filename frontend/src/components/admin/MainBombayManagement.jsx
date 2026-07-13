import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api/main-bombay';

const TIME_SLOTS = [];
for (let h = 11; h <= 19; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 19 && m > 45) break;
    const hour = h % 12 || 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    TIME_SLOTS.push(`${hour}:${String(m).padStart(2, '0')} ${ampm}`);
  }
}

function MainBombayManagement({ token }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState(TIME_SLOTS.map(t => ({ time: t, value: '' })));
  const [savedDates, setSavedDates] = useState([]);

  const fetchDates = async () => {
    try {
      const res = await axios.get(`${API}/dates`, { headers: { Authorization: `Bearer ${token}` } });
      setSavedDates(res.data);
    } catch { }
  };

  const fetchData = async (d) => {
    try {
      const res = await axios.get(`${API}?date=${d}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.length > 0) {
        const record = res.data[0];
        const merged = TIME_SLOTS.map(ts => {
          const found = record.slots.find(s => s.time === ts);
          return { time: ts, value: found ? found.value : '' };
        });
        setSlots(merged);
      } else {
        setSlots(TIME_SLOTS.map(t => ({ time: t, value: '' })));
      }
    } catch {
      setSlots(TIME_SLOTS.map(t => ({ time: t, value: '' })));
    }
  };

  useEffect(() => { fetchDates(); }, []);
  useEffect(() => { fetchData(date); }, [date]);

  const handleChange = (idx, val) => {
    const copy = [...slots];
    copy[idx] = { ...copy[idx], value: val };
    setSlots(copy);
  };

  const handleSave = async () => {
    const toastId = toast.loading('Saving...');
    try {
      await axios.post(`${API}`, { date, slots }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Saved!', { id: toastId });
      fetchDates();
    } catch {
      toast.error('Failed to save', { id: toastId });
    }
  };

  const handleLoadDate = (d) => {
    setDate(new Date(d).toISOString().split('T')[0]);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-200 mb-4">Main Bombay 36 — Time Slot Management</h2>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
        <button onClick={handleSave}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition">
          Save Slots
        </button>
      </div>
      {savedDates.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1">Saved Dates:</p>
          <div className="flex flex-wrap gap-1">
            {savedDates.map((d, i) => (
              <button key={i} onClick={() => handleLoadDate(d)}
                className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition">
                {new Date(d).toLocaleDateString('en-IN')}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {slots.map((s, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-center">
            <div className="text-[11px] text-slate-400 font-medium mb-1">{s.time}</div>
            <input value={s.value} onChange={e => handleChange(idx, e.target.value)}
              placeholder="XXX-Y"
              className="w-full px-1.5 py-1 text-xs text-center bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainBombayManagement;
