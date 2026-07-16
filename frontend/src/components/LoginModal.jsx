import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginModal({ onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Name required'); setBusy(false); return; }
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#111118] border border-white/[0.12] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-amber-400">{tab === 'login' ? 'Login' : 'Register'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none">&times;</button>
        </div>

        <div className="flex gap-1 bg-white/[0.04] rounded-lg p-1 mb-4">
          <button onClick={() => setTab('login')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${tab === 'login' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}>Login</button>
          <button onClick={() => setTab('register')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${tab === 'register' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={4}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={busy}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-2.5 rounded-lg text-sm hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50">
            {busy ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
