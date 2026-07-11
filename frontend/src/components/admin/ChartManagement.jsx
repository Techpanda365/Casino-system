import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/charts';

function ChartManagement({ token }) {
  const [charts, setCharts] = useState([]);
  const [type, setType] = useState('weekly');
  const [title, setTitle] = useState('');
  const [marketName, setMarketName] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(null);

  const fetch = useCallback(async () => {
    try { const r = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } }); setCharts(r.data); }
    catch { console.error('Failed to load charts'); }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, { type, title, marketName, content }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(API, { type, title, marketName, content }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setType('weekly'); setTitle(''); setMarketName(''); setContent(''); setEditing(null);
      fetch();
    } catch (err) { alert(err.response?.data?.msg || 'Failed to save'); }
  };

  const edit = (c) => { setType(c.type); setTitle(c.title); setMarketName(c.marketName || ''); setContent(c.content); setEditing(c._id); };

  const del = async (id) => {
    try { await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetch(); }
    catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Charts & Card Lists</h2>
          <p className="text-xs text-gray-500">Weekly charts, jodi charts, card lists</p>
        </div>
      </div>

      <form onSubmit={save} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-100 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="border p-2.5 rounded-lg text-sm" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="weekly">Weekly Chart</option>
            <option value="cardlist">Card List</option>
            <option value="jodi-count">Jodi Count Chart</option>
            <option value="jodi-family">Jodi Family Chart</option>
            <option value="penal-count">Penal Count Chart</option>
            <option value="penal-total">Penal Total Chart</option>
            <option value="card-list-220">All 220 Card List</option>
            <option value="weekly-patti">Weekly Patti/Penal Chart</option>
            <option value="weekly-open-close">Weekly Open/Close Line</option>
            <option value="weekly-jodi">Weekly Jodi Chart</option>
          </select>
          <input className="border p-2.5 rounded-lg text-sm" placeholder="Market Name (optional)" value={marketName} onChange={(e) => setMarketName(e.target.value)} />
          <input className="border p-2.5 rounded-lg text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <textarea className="w-full border p-2.5 rounded-lg text-sm h-24" placeholder="Content (HTML or text)" value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {editing ? 'Update' : '+ Add Chart'}
        </button>
      </form>

      <div className="space-y-2">
        {charts.map((c) => (
          <div key={c._id} className="flex items-center justify-between p-4 bg-white border rounded-xl">
            <div>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 mr-2">{c.type}</span>
              {c.marketName && <span className="text-xs bg-amber-100 px-2 py-0.5 rounded text-amber-600 mr-2">{c.marketName}</span>}
              <span className="font-medium text-sm">{c.title}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(c)} className="text-blue-500 text-xs hover:underline">Edit</button>
              <button onClick={() => del(c._id)} className="text-red-500 text-xs hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {charts.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No charts added yet.</div>}
      </div>
    </div>
  );
}

export default ChartManagement;
