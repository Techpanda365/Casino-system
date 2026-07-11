import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/public';

const CHART_LABELS = {
  'jodi-count': { en: 'Matka Jodi Count Chart', hi: 'मटका जोड़ी काउंट चार्ट' },
  'jodi-family': { en: 'Matka Jodi Family Chart', hi: 'मटका जोड़ी फैमिली चार्ट' },
  'penal-count': { en: 'Penal Count Chart', hi: 'पेनल काउंट चार्ट' },
  'penal-total': { en: 'Penal Total Chart', hi: 'पेनल टोटल चार्ट' },
  'card-list-220': { en: 'All 220 Card List', hi: 'सभी 220 कार्ड लिस्ट' },
  'cardlist': { en: 'Card Lists', hi: 'कार्ड लिस्ट' },
  'weekly': { en: 'Weekly Chart', hi: 'वीकली चार्ट' },
  'weekly-patti': { en: 'Weekly Patti/Penal Chart', hi: 'वीकली पट्टी/पेनल चार्ट' },
  'weekly-open-close': { en: 'Weekly Open/Close Line', hi: 'वीकली ओपन/क्लोज लाइन' },
  'weekly-jodi': { en: 'Weekly Jodi Chart', hi: 'वीकली जोड़ी चार्ट' }
};

const CHART_ORDER = ['jodi-count', 'jodi-family', 'penal-count', 'penal-total', 'card-list-220', 'cardlist', 'weekly', 'weekly-patti', 'weekly-open-close', 'weekly-jodi'];

function ChartSectionPage() {
  const { slug, chartType } = useParams();
  const [charts, setCharts] = useState([]);
  const [settings, setSettings] = useState({});

  const label = CHART_LABELS[chartType] || { en: chartType, hi: chartType };
  const hrs = charts.filter(c => c.type === chartType);

  useEffect(() => {
    if (!slug) return;
    axios.get(`${API}/settings/${slug}`).then((r) => setSettings(r.data || {})).catch(() => {});
    axios.get(`${API}/charts/${slug}`).then((r) => setCharts(r.data)).catch(() => {});
  }, [slug]);

  const renderHeader = () => (
    <header className="bg-gradient-to-r from-amber-600 to-amber-500 shadow-lg shadow-amber-500/10">
      <div className="px-3 py-1.5 max-w-7xl mx-auto flex items-center gap-2">
        {settings.logo && <img src={settings.logo} alt="" className="h-7 w-auto" />}
        <div>
          <h1 className="text-sm font-bold tracking-wide text-white">{settings.siteName || 'Lucky Bazar'}</h1>
          <p className="text-[8px] font-medium text-white/70">{settings.siteName || 'Lucky Bazar'} • FAST RESULT • FREE GAME</p>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {renderHeader()}

      {/* Nav */}
      <div className="bg-black/30 border-b border-white/[0.08] overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 px-2 py-1.5 text-[11px] whitespace-nowrap">
          <Link to={`/site/${slug}`} className="px-2.5 py-1 rounded-md text-slate-400 hover:text-amber-400 transition font-medium">Home</Link>
          {CHART_ORDER.map(t => (
            <Link key={t} to={`/site/${slug}/chart/${t}`}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                t === chartType ? 'text-amber-400 bg-amber-500/15' : 'text-slate-300 hover:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              {CHART_LABELS[t]?.en?.replace('Matka ', '').replace(' Chart', '') || t}
            </Link>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-3 py-2 flex items-center gap-2 text-[10px] text-slate-500">
        <Link to={`/site/${slug}`} className="hover:text-amber-400 transition">Home</Link>
        <span>/</span>
        <Link to={`/site/${slug}/chart/${chartType}`} className="text-amber-400/80">{label.en}</Link>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3">
        {/* Heading */}
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-lg p-4 mb-3 text-center">
          <h1 className="text-slate-400 text-xs font-medium mb-1">{label.hi}</h1>
          <h2 className="text-amber-400 font-bold text-base uppercase tracking-wider">{label.en}</h2>
        </div>

        {/* Chart Content */}
        {hrs.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">No chart data available.</div>
        )}
        {hrs.map(c => (
          <div key={c._id} className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-4 mb-3">
            {c.marketName && (
              <div className="text-amber-400/60 text-[10px] font-medium mb-1 uppercase tracking-wide">{c.marketName}</div>
            )}
            <div className="text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: c.content }} />
          </div>
        ))}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.12] mt-4 py-2 text-center text-slate-600 text-[9px]"
        dangerouslySetInnerHTML={{ __html: settings.footer || `&copy; ${settings.siteName || 'Lucky Bazar'}. All rights reserved.` }}
      />
    </div>
  );
}

export default ChartSectionPage;
