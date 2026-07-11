import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function ResultManagement({ token }) {
  const [markets, setMarkets] = useState([]);
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({ market: '', openPatti: '', jodi: '', closePatti: '', date: new Date().toISOString().split('T')[0], status: 'closed' });
  const [editing, setEditing] = useState(null);

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/markets`, { headers: { Authorization: `Bearer ${token}` } });
      setMarkets(res.data);
    } catch { alert('Failed to load markets'); }
  }, [token]);

  const fetchResults = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/results`, { headers: { Authorization: `Bearer ${token}` } });
      setResults(res.data);
    } catch { alert('Failed to load results'); }
  }, [token]);

  useEffect(() => { fetchMarkets(); fetchResults(); }, [fetchMarkets, fetchResults]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/results/${editing}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API}/results`, form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ market: '', openPatti: '', jodi: '', closePatti: '', date: new Date().toISOString().split('T')[0], status: 'closed' });
      setEditing(null);
      fetchResults();
    } catch { alert('Failed to save result'); }
  };

  const edit = (r) => {
    setForm({
      market: r.market?._id || r.market,
      openPatti: r.openPatti,
      jodi: r.jodi,
      closePatti: r.closePatti,
      date: new Date(r.date).toISOString().split('T')[0],
      status: r.status
    });
    setEditing(r._id);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await axios.delete(`${API}/results/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchResults();
    } catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Result Management</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <select className="border p-2 rounded text-sm" value={form.market}
          onChange={(e) => setForm({ ...form, market: e.target.value })} required>
          <option value="">Select Market</option>
          {markets.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <input className="border p-2 rounded text-sm" type="date" value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input className="border p-2 rounded text-sm" placeholder="Open Patti (e.g. 179)" value={form.openPatti}
          onChange={(e) => setForm({ ...form, openPatti: e.target.value })} />
        <input className="border p-2 rounded text-sm" placeholder="Jodi (e.g. 75)" value={form.jodi}
          onChange={(e) => setForm({ ...form, jodi: e.target.value })} />
        <input className="border p-2 rounded text-sm" placeholder="Close Patti (e.g. 177)" value={form.closePatti}
          onChange={(e) => setForm({ ...form, closePatti: e.target.value })} />
        <select className="border p-2 rounded text-sm" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="closed">Closed</option>
          <option value="open">Open</option>
        </select>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
          {editing ? 'Update' : 'Add Result'}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setForm({ market: '', openPatti: '', jodi: '', closePatti: '', date: new Date().toISOString().split('T')[0], status: 'closed' }); }}
            className="bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500 transition">
            Cancel
          </button>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Market</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Open</th>
              <th className="p-2 text-left">Jodi</th>
              <th className="p-2 text-left">Close</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{r.market?.name || 'Unknown'}</td>
                <td className="p-2 text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-2 font-mono">{r.openPatti}</td>
                <td className="p-2 font-mono font-bold">{r.jodi}</td>
                <td className="p-2 font-mono">{r.closePatti}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => edit(r)} className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                  <button onClick={() => remove(r._id)} className="text-red-600 hover:text-red-800 text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center text-gray-400">No results added yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultManagement;
