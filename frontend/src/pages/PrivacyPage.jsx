import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/public';

function PrivacyPage() {
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
        <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
              <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h2 className="text-base font-bold text-white">Privacy & Policy</h2>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <p>At {settings.siteName || 'Lucky Bazar'}, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">1. Information We Collect</h3>
            <p>We may collect personal information such as your name, email address, phone number, and other details you voluntarily provide through our contact forms or communication channels.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">2. How We Use Your Information</h3>
            <p>We use your information to respond to your inquiries, provide customer support, improve our services, and send important updates related to our platform.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">3. Data Protection</h3>
            <p>We implement reasonable security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">4. Third-Party Sharing</h3>
            <p>We do not sell, trade, or share your personal information with third parties except when required by law or with your explicit consent.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">5. Cookies</h3>
            <p>Our website may use cookies to enhance user experience. You can choose to disable cookies in your browser settings, but this may affect some features.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">6. Third-Party Links</h3>
            <p>Our site may contain links to external websites. We are not responsible for the privacy practices or content of these third-party sites.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">7. Changes to This Policy</h3>
            <p>We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with the updated date.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">8. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us via our <Link to={`/site/${slug}/contact`} className="text-amber-400 hover:text-amber-300 transition underline">Contact page</Link>.</p>
          </div>

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

export default PrivacyPage;
