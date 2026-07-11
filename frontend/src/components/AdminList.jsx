import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AdminList = ({ token }) => {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [siteSlug, setSiteSlug] = useState('');

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data);
    } catch (err) {
      console.error('Error fetching admins:', err);
      alert('Failed to fetch admins');
    }
  }, [token]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const addAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/admin/add',
        { name, email, password, siteSlug: siteSlug || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName(''); setEmail(''); setPassword(''); setSiteSlug('');
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to add admin');
    }
  };

  const toggleSubscription = async (id, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/subscription/${id}`,
        { status: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins();
    } catch (err) {
      alert('Failed to update subscription');
    }
  };

  const copyUrl = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/site/${slug}`);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Admin Management</h2>
          <p className="text-xs text-gray-500">Add and manage admin accounts — each gets their own site URL</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 mb-6 border border-purple-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Admin</h3>
        <form onSubmit={addAdmin} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white"
            placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white"
            placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white"
            placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white"
            placeholder="Site URL (slug)" value={siteSlug} onChange={(e) => setSiteSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
          <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all">
            + Add Admin
          </button>
        </form>
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        All Admins
        <span className="ml-2 text-xs text-gray-400 font-normal">({admins.length} total)</span>
      </h3>

      {admins.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"/>
          </svg>
          <p className="text-sm">No admins found. Add your first admin above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => (
            <div key={admin._id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{admin.name}</div>
                  <div className="text-xs text-gray-500">{admin.email}</div>
                  {admin.siteSlug && (
                    <a href={`/site/${admin.siteSlug}`} target="_blank" rel="noreferrer"
                      className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13V19C18 20.1 17.1 21 16 21H6C4.9 21 4 20.1 4 19V8C4 6.9 4.9 6 6 6H12"/>
                        <path d="M15 3H21V9"/>
                        <path d="M10 14L21 3"/>
                      </svg>
                      /site/{admin.siteSlug}
                    </a>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  admin.subscriptionStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                }`}>
                  {admin.subscriptionStatus ? 'Active' : 'Deactive'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {admin.siteSlug && (
                  <button onClick={() => copyUrl(admin.siteSlug)}
                    className="px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50 border border-gray-200 transition-all">
                    Copy URL
                  </button>
                )}
                <button
                  onClick={() => toggleSubscription(admin._id, admin.subscriptionStatus)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    admin.subscriptionStatus
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {admin.subscriptionStatus ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminList;
