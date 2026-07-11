import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/forums';

const SECTIONS = [
  { value: 'special-game', label: 'Special Game Zone' },
  { value: 'guessing-forum', label: 'Guessing Forum' },
  { value: 'expert-forum', label: 'Expert Forum' },
  { value: 'trick-zone', label: 'Kalyan Trick Forum' },
  { value: 'fix-game', label: 'All Market Free Fix Game' },
  { value: 'ratan-khatri', label: 'Ratan Khatri Fix Panel Chart' },
  { value: 'final-trick', label: 'Final Number Trick Chart' },
  { value: 'evergreen-trick', label: 'EverGreen Trick Zone' }
];

const SECTION_LABELS = {
  'special-game': 'Special Game Zone',
  'guessing-forum': 'Guessing Forum',
  'expert-forum': 'Expert Forum',
  'trick-zone': 'Kalyan Trick Forum',
  'fix-game': 'All Market Free Fix Game',
  'ratan-khatri': 'Ratan Khatri Fix Panel Chart',
  'final-trick': 'Final Number Trick Chart',
  'evergreen-trick': 'EverGreen Trick Zone'
};

function ForumManagement({ token }) {
  const [searchParams] = useSearchParams();
  const [forums, setForums] = useState([]);
  const [section, setSection] = useState(searchParams.get('section') || 'expert-forum');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(null);

  const fetch = useCallback(async () => {
    try { const r = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } }); setForums(r.data); }
    catch { console.error('Failed to load forums'); }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, { section, title, content }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(API, { section, title, content }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setSection('expert-forum'); setTitle(''); setContent(''); setEditing(null);
      fetch();
    } catch (err) { alert(err.response?.data?.msg || 'Failed to save'); }
  };

  const edit = (f) => { setSection(f.section); setTitle(f.title); setContent(f.content); setEditing(f._id); };

  const del = async (id) => {
    try { await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetch(); }
    catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-100 rounded-lg">
          <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Forum / Guessing Zones</h2>
          <p className="text-xs text-gray-500">Manage expert forum, trick zones & special game zones</p>
        </div>
      </div>

      <form onSubmit={save} className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-5 mb-6 border border-rose-100 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="border p-2.5 rounded-lg text-sm" value={section} onChange={(e) => setSection(e.target.value)}>
            {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input className="border p-2.5 rounded-lg text-sm" placeholder="Title (market name, optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <textarea className="w-full border p-2.5 rounded-lg text-sm h-24" placeholder="Content (HTML or text)" value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit" className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {editing ? 'Update' : '+ Add Post'}
        </button>
      </form>

      <div className="space-y-2">
        {forums.map((f) => (
          <div key={f._id} className="flex items-center justify-between p-4 bg-white border rounded-xl">
            <div>
              <span className="text-xs bg-rose-100 px-2 py-0.5 rounded text-rose-600 mr-2">{SECTION_LABELS[f.section] || f.section}</span>
              <span className="font-medium text-sm">{f.title}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(f)} className="text-blue-500 text-xs hover:underline">Edit</button>
              <button onClick={() => del(f._id)} className="text-red-500 text-xs hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {forums.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No forum posts added yet.</div>}
      </div>
    </div>
  );
}

export default ForumManagement;
