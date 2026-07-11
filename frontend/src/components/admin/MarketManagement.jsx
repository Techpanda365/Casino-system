import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/markets';

function MarketManagement({ token }) {
  const [markets, setMarkets] = useState([]);
  const [form, setForm] = useState({ name: '', openTime: '', closeTime: '', displayOrder: 0, category: 'day', finalAnk: '' });
  const [editing, setEditing] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
      setMarkets(res.data);
    } catch { alert('Failed to fetch markets'); }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(API, form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ name: '', openTime: '', closeTime: '', displayOrder: 0, category: 'day', finalAnk: '' });
      setEditing(null);
      fetch();
    } catch { alert('Failed to save market'); }
  };

  const edit = (m) => {
    setForm({ name: m.name, openTime: m.openTime, closeTime: m.closeTime, displayOrder: m.displayOrder, category: m.category, finalAnk: m.finalAnk || '' });
    setEditing(m._id);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this market?')) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetch();
    } catch { alert('Failed to delete'); }
  };

  const toggleActive = async (m) => {
    try {
      await axios.put(`${API}/${m._id}`, { active: !m.active }, { headers: { Authorization: `Bearer ${token}` } });
      fetch();
    } catch { alert('Failed to toggle'); }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Market Management</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input className="border p-2 rounded text-sm" placeholder="Market Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border p-2 rounded text-sm" placeholder="Open Time (e.g. 11:40 AM)" value={form.openTime}
          onChange={(e) => setForm({ ...form, openTime: e.target.value })} />
        <input className="border p-2 rounded text-sm" placeholder="Close Time (e.g. 12:40 PM)" value={form.closeTime}
          onChange={(e) => setForm({ ...form, closeTime: e.target.value })} />
        <input className="border p-2 rounded text-sm" placeholder="Final Ank (e.g. 4)" value={form.finalAnk}
          onChange={(e) => setForm({ ...form, finalAnk: e.target.value })} />
        <input className="border p-2 rounded text-sm" placeholder="Display Order" type="number" value={form.displayOrder}
          onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
        <select className="border p-2 rounded text-sm" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="day">Day</option>
          <option value="night">Night</option>
          <option value="morning">Morning</option>
        </select>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
          {editing ? 'Update' : 'Add Market'}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setForm({ name: '', openTime: '', closeTime: '', displayOrder: 0, category: 'day', finalAnk: '' }); }}
            className="bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500 transition">
            Cancel
          </button>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Timings</th>
              <th className="p-2 text-left">Final Ank</th>
              <th className="p-2 text-left">Order</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m) => (
              <tr key={m._id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{m.name}</td>
                <td className="p-2 text-gray-500">{m.openTime} — {m.closeTime}</td>
                <td className="p-2">{m.finalAnk || '-'}</td>
                <td className="p-2">{m.displayOrder}</td>
                <td className="p-2">
                  <button onClick={() => toggleActive(m)}
                    className={`px-2 py-1 rounded text-xs ${m.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {m.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => edit(m)} className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                  <button onClick={() => remove(m._id)} className="text-red-600 hover:text-red-800 text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {markets.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-gray-400">No markets added yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MarketManagement;
