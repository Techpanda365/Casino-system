import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api/forums';

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

function PostCreateModal({ slug, onClose, onCreated }) {
  const { token } = useAuth();
  const [section, setSection] = useState('guessing-forum');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) { setError('Content required'); return; }
    setBusy(true);
    setError('');
    try {
      await axios.post(`${API}/user-post`, { section, title, content }, { headers: { Authorization: `Bearer ${token}` } });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create post');
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#111118] border border-white/[0.12] rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-amber-400">Create Post</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={section} onChange={e => setSection(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50">
            {Object.entries(SECTION_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-[#111118]">{v}</option>)}
          </select>

          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />

          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your post..." required rows={5}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none" />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={busy}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-2.5 rounded-lg text-sm hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50">
            {busy ? 'Posting...' : '📝 Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostCreateModal;
