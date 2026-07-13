import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken, setRole }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('superadmin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password, role: tab });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.admin.role);
      localStorage.setItem('siteSlug', res.data.admin.siteSlug || '');
      localStorage.setItem('adminName', res.data.admin.name || '');
      setToken(res.data.token);
      setRole(res.data.admin.role);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-5">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/5 -top-[200px] -right-[200px] animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/5 -bottom-[150px] -left-[150px] animate-pulse delay-1000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-indigo-500/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => { setTab('superadmin'); setError(''); }}
            className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
              tab === 'superadmin'
                ? 'text-purple-700'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Super Admin
            </div>
            {tab === 'superadmin' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            )}
          </button>
          <button
            onClick={() => { setTab('admin'); setError(''); }}
            className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
              tab === 'admin'
                ? 'text-purple-700'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"/>
                <path d="M19 7L21 9L23 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin
            </div>
            {tab === 'admin' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            )}
          </button>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
              tab === 'superadmin'
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-500/50'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/50'
            }`}>
              {tab === 'superadmin' ? (
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"/>
                </svg>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {tab === 'superadmin' ? 'Super Admin Login' : 'Admin Login'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {tab === 'superadmin' ? 'Full access to manage everything' : 'Manage your assigned markets'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email Address</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
                  <path d="M22 6L12 13L2 6"/>
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Password</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7C7 5 8 3 12 3C16 3 17 5 17 7V11"/>
                </svg>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                tab === 'superadmin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/40'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/40'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : (
                `Sign in as ${tab === 'superadmin' ? 'Super Admin' : 'Admin'}`
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                <span className="text-gray-400">Demo: </span>
                <span className="text-purple-600 font-semibold">super@admin.com</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-purple-600 font-semibold">super@123</span>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* View Site Link */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <a href="/" className="text-white/50 hover:text-white/80 text-sm transition">
          ← Back to Website
        </a>
      </div>
    </div>
  );
};

export default Login;
