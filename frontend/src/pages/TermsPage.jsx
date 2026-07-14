import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/public';

function TermsPage() {
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
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h2 className="text-base font-bold text-white">Terms & Conditions</h2>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <p>Welcome to {settings.siteName || 'Lucky Bazar'}. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">1. Acceptance of Terms</h3>
            <p>By using our website, you agree to these Terms & Conditions. If you do not agree, please do not use our services.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">2. Eligibility</h3>
            <p>You must be at least 18 years old to use our services. By using this site, you confirm that you are of legal age to participate in gambling activities in your jurisdiction.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">3. Accuracy of Information</h3>
            <p>All results and information provided on this website are for informational and entertainment purposes only. While we strive for accuracy, we do not guarantee the completeness or accuracy of any information displayed.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">4. User Responsibilities</h3>
            <p>You agree not to use our website for any unlawful purpose. You are responsible for ensuring that your use of the site complies with applicable laws in your region.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">5. Intellectual Property</h3>
            <p>All content, logos, and materials on this site are the property of {settings.siteName || 'Lucky Bazar'} unless otherwise stated. Unauthorized use or reproduction is prohibited.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">6. Limitation of Liability</h3>
            <p>{settings.siteName || 'Lucky Bazar'} shall not be held liable for any loss or damage arising from the use of this website or reliance on any information provided herein.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">7. Changes to Terms</h3>
            <p>We reserve the right to update or modify these terms at any time without prior notice. It is your responsibility to review this page periodically.</p>

            <h3 className="text-amber-400 font-semibold text-sm mt-4">8. Contact Us</h3>
            <p>If you have any questions regarding these terms, please contact us via our <Link to={`/site/${slug}/contact`} className="text-amber-400 hover:text-amber-300 transition underline">Contact page</Link>.</p>
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

export default TermsPage;
