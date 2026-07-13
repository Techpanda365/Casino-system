import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api/admin';
const UPLOAD_API = 'http://localhost:5000/api/upload';

function Profile({ token }) {
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        setProfile(r.data);
        setName(r.data.name || '');
        setEmail(r.data.email || '');
        setAvatar(r.data.avatar || '');
        localStorage.setItem('adminAvatar', r.data.avatar || '');
      })
      .catch(() => toast.error('Failed to load profile'));
  }, [token]);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await axios.post(UPLOAD_API, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setAvatar(res.data.url);
      localStorage.setItem('adminAvatar', res.data.url);
      toast.success('Photo uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    const loading = toast.loading('Saving...');
    try {
      const res = await axios.put(`${API}/profile`, { name, email, avatar }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.admin);
      localStorage.setItem('adminName', res.data.admin.name);
      localStorage.setItem('adminAvatar', res.data.admin.avatar || '');
      toast.dismiss(loading);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.dismiss(loading);
      toast.error(err.response?.data?.msg || 'Failed to update');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">My Profile</h2>
          <p className="text-xs text-gray-500">Update your personal information</p>
        </div>
      </div>

      <form onSubmit={save} className="bg-white rounded-xl p-6 border space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400 font-bold">
                {(profile.name || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => fileRef.current.click()}
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              {uploading ? 'Uploading...' : 'Change Photo'}
            </button>
            {avatar && (
              <button type="button" onClick={() => setAvatar('')}
                className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition"
              >
                Remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
          <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
          <input type="email" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {/* Role */}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Role</label>
          <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-500" value={profile.role || ''} disabled />
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2.5 rounded-lg text-sm font-bold hover:from-purple-500 hover:to-purple-400 transition shadow-lg shadow-purple-500/20">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;