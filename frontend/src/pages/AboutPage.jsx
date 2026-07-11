import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/public';

function AboutPage() {
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
        <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
              <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16V12M12 8H12.01"/>
              </svg>
            </div>
            <h2 className="text-base font-bold text-white">About Us</h2>
          </div>
          <div className="text-gray-300 leading-relaxed text-xs"
            dangerouslySetInnerHTML={{ __html: settings.aboutUs || '<p class="text-gray-500">No content added yet.</p>' }}
          />
          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <Link to={`/site/${slug}`} className="text-amber-400 hover:text-amber-300 text-xs font-medium transition inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.12] mt-2 py-2 text-center text-slate-600 text-[9px]"
        dangerouslySetInnerHTML={{ __html: settings.footer || `&copy; ${settings.siteName || 'Lucky Bazar'}. All rights reserved.` }}
      />
    </div>
  );
}

export default AboutPage;
