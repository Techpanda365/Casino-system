import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/starline-charts';

const STARLINE_NAMES = ['MAIN STARLINE', 'Mumbai Rajshree Star Line', 'MAIN BOMBAY 36 BAZAR'];

function StarlineChartManagement({ token }) {
  const [charts, setCharts] = useState([]);
  const [starlineName, setStarlineName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [data, setData] = useState([{ label: '', value: '', sub: '' }]);
  const [editing, setEditing] = useState(null);

  const fetch = useCallback(async () => {
    try { const r = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } }); setCharts(r.data); }
    catch { console.error('Failed to load starline charts'); }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const body = { starlineName, title, content, data: data.filter(d => d.label) };
      if (editing) {
        await axios.put(`${API}/${editing}`, body, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(API, body, { headers: { Authorization: `Bearer ${token}` } });
      }
      setStarlineName(''); setTitle(''); setContent(''); setData([{ label: '', value: '', sub: '' }]); setEditing(null);
      fetch();
    } catch (err) { alert(err.response?.data?.msg || 'Failed to save'); }
  };

  const edit = (c) => {
    setStarlineName(c.starlineName); setTitle(c.title); setContent(c.content);
    setData(c.data && c.data.length ? c.data.map(d => ({ ...d })) : [{ label: '', value: '', sub: '' }]);
    setEditing(c._id);
  };

  const del = async (id) => {
    try { await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetch(); }
    catch { alert('Failed to delete'); }
  };

  const addRow = () => setData(prev => [...prev, { label: '', value: '', sub: '' }]);
  const removeRow = (i) => { setData(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev); };
  const updateRow = (i, field, val) => {
    setData(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: val } : row));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-sky-100 rounded-lg">
          <svg className="w-5 h-5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Starline Charts</h2>
          <p className="text-xs text-gray-500">Add charts for starline groups</p>
        </div>
      </div>

      <form onSubmit={save} className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-5 mb-6 border border-sky-100 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="border p-2.5 rounded-lg text-sm" value={starlineName} onChange={(e) => setStarlineName(e.target.value)} required>
            <option value="">Select Starline</option>
            {STARLINE_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <input className="border p-2.5 rounded-lg text-sm" placeholder="Chart Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <textarea className="w-full border p-2.5 rounded-lg text-sm h-24" placeholder="Content (HTML or text)" value={content} onChange={(e) => setContent(e.target.value)} />
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-600">Time-Result Table Rows</span>
            <button type="button" onClick={addRow} className="text-xs text-sky-600 hover:underline">+ Add Row</button>
          </div>
          <div className="space-y-1">
            {data.map((d, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className="border p-2 rounded-lg text-sm w-28" placeholder="Time (e.g. 09:30 AM)" value={d.label} onChange={(e) => updateRow(i, 'label', e.target.value)} />
                <input className="border p-2 rounded-lg text-sm w-20" placeholder="Result" value={d.value} onChange={(e) => updateRow(i, 'value', e.target.value)} />
                <input className="border p-2 rounded-lg text-sm w-20" placeholder="Sub" value={d.sub} onChange={(e) => updateRow(i, 'sub', e.target.value)} />
                {data.length > 1 && <button type="button" onClick={() => removeRow(i)} className="text-red-400 text-lg leading-none">&times;</button>}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {editing ? 'Update' : '+ Add Starline Chart'}
        </button>
      </form>

      {STARLINE_NAMES.map(group => {
        const groupCharts = charts.filter(c => c.starlineName === group);
        if (groupCharts.length === 0) return null;
        return (
          <div key={group} className="mb-4">
            <h3 className="text-md font-bold text-gray-800 mb-2">{group}</h3>
            <div className="space-y-2">
              {groupCharts.map((c) => (
                <div key={c._id} className="flex items-center justify-between p-4 bg-white border rounded-xl">
                  <div>
                    <span className="font-medium text-sm">{c.title}</span>
                    {c.data && c.data.length > 0 && <span className="text-xs text-gray-400 ml-2">({c.data.length} rows)</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => edit(c)} className="text-blue-500 text-xs hover:underline">Edit</button>
                    <button onClick={() => del(c._id)} className="text-red-500 text-xs hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {charts.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No starline charts added yet.</div>}
    </div>
  );
}

export default StarlineChartManagement;
