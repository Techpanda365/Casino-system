import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/banners';
const UPLOAD_API = 'http://localhost:5000/api/upload';

function BannerManagement({ token }) {
  const [banners, setBanners] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const fetch = useCallback(async () => {
    try { const r = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } }); setBanners(r.data); }
    catch { console.error('Failed to load banners'); }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const body = { imageUrl, linkUrl, title, displayOrder: parseInt(displayOrder) || 0 };
      if (editing) {
        await axios.put(`${API}/${editing}`, body, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(API, body, { headers: { Authorization: `Bearer ${token}` } });
      }
      setImageUrl(''); setLinkUrl(''); setTitle(''); setDisplayOrder(0); setEditing(null);
      fetch();
    } catch (err) { alert(err.response?.data?.msg || 'Failed to save'); }
  };

  const edit = (b) => { setImageUrl(b.imageUrl); setLinkUrl(b.linkUrl || ''); setTitle(b.title || ''); setDisplayOrder(b.displayOrder || 0); setEditing(b._id); };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await axios.post(UPLOAD_API, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(res.data.url);
    } catch (err) {
      alert(err.response?.data?.msg || 'Upload failed. Max size 2MB, images only.');
    } finally {
      setUploading(false);
    }
  };

  const del = async (id) => {
    try { await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetch(); }
    catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15L16 10L5 21" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Image Banners</h2>
          <p className="text-xs text-gray-500">Banner images for the public site slider</p>
        </div>
      </div>

      <form onSubmit={save} className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-5 mb-6 border border-purple-100 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex gap-2">
            <input className="border p-2.5 rounded-lg text-sm flex-1" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required={!imageUrl && !uploading} />
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
            <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
              className="px-3 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition whitespace-nowrap disabled:opacity-50">
              {uploading ? '...' : 'Upload'}
            </button>
          </div>
          <input className="border p-2.5 rounded-lg text-sm" placeholder="Link URL (optional)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          <input className="border p-2.5 rounded-lg text-sm" placeholder="Title (alt text)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="border p-2.5 rounded-lg text-sm" type="number" placeholder="Display Order" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
        </div>
        {imageUrl && <img src={imageUrl} alt="Preview" className="h-24 rounded border object-cover" />}
        <button type="submit" className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {editing ? 'Update' : '+ Add Banner'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b._id} className="bg-white border rounded-xl overflow-hidden">
            <img src={b.imageUrl} alt={b.title || 'Banner'} className="w-full h-40 object-cover" />
            <div className="p-3 flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">{b.title || 'No title'}</span>
                <span className="text-xs text-gray-400 ml-2">Order: {b.displayOrder}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(b)} className="text-blue-500 text-xs hover:underline">Edit</button>
                <button onClick={() => del(b._id)} className="text-red-500 text-xs hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && <div className="col-span-2 text-center py-10 text-gray-400 text-sm">No banners added yet.</div>}
      </div>
    </div>
  );
}

export default BannerManagement;
