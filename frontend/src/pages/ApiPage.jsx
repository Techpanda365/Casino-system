import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ApiDocs from '../components/ApiDocs';

const API = 'http://localhost:5000/api/public';

function ApiPage() {
  const { slug } = useParams();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (slug) {
      axios.get(`${API}/settings/${slug}`).then((r) => setSettings(r.data || {})).catch(() => {});
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <header className="bg-gradient-to-r from-amber-600 to-amber-500 shadow-lg shadow-amber-500/10">
        <div className="px-3 py-1.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            {settings.logo && <img src={settings.logo} alt="Logo" className="h-7 w-auto" />}
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">{settings.siteName || 'Lucky Bazar'}</h1>
              <p className="text-[8px] font-medium text-white/70">{settings.siteName || 'Lucky Bazar'} • FAST RESULT • FREE GAME</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-3">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/site/${slug}`} className="text-amber-400 hover:text-amber-300 text-[9px] font-medium transition inline-flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Link>
        </div>
        <ApiDocs slug={slug} />
      </main>

      <footer className="border-t border-white/[0.12] mt-2 py-2 text-center text-slate-600 text-[9px]"
        dangerouslySetInnerHTML={{ __html: settings.footer || `&copy; ${settings.siteName || 'Lucky Bazar'}. All rights reserved.` }}
      />
    </div>
  );
}

export default ApiPage;
