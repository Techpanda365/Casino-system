import React from 'react';

function ApiDocs({ slug }) {
  const baseUrl = `http://localhost:5000/api/v1/${slug}`;

  const endpoints = [
    {
      method: 'GET',
      path: `/api/v1/${slug}/today`,
      desc: 'Get today\'s results for all active markets',
      response: '{ success, count, data: [{ market, openPatti, jodi, closePatti, status, date }] }'
    },
    {
      method: 'GET',
      path: `/api/v1/${slug}/markets`,
      desc: 'Get list of all active markets',
      response: '{ success, count, data: [{ name, openTime, closeTime, finalAnk, displayOrder }] }'
    },
    {
      method: 'GET',
      path: `/api/v1/${slug}/starline`,
      desc: 'Get today\'s starline results',
      response: '{ success, count, data: [{ name, slots: [{ time, result }] }] }'
    },
    {
      method: 'GET',
      path: `/api/v1/${slug}/guesses`,
      desc: 'Get today\'s free guesses',
      response: '{ success, count, data: [{ marketId, openClose, panel, jodi }] }'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 mt-1.5">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-1 h-3 bg-amber-500 rounded-full"></div>
        <span className="text-slate-600 text-[8px] uppercase tracking-widest font-medium">API Access</span>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/5 border-b border-white/[0.12] px-2 py-1 text-center">
          <h2 className="text-amber-400/90 font-bold text-[10px]">🔌 DEVELOPER API</h2>
          <p className="text-slate-600 text-[8px]">Free JSON API — No Auth Required</p>
        </div>
        <div className="p-2 space-y-1.5">
          {endpoints.map((ep, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/[0.08] rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-white/[0.02] border-b border-white/[0.06]">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">{ep.method}</span>
                <code className="text-[8px] text-slate-300 font-mono truncate">{ep.path}</code>
              </div>
              <div className="p-2">
                <p className="text-slate-500 text-[8px] mb-1">{ep.desc}</p>
                <div className="bg-black/30 rounded p-1.5">
                  <code className="text-[7px] text-slate-400 font-mono block leading-relaxed break-all">{ep.response}</code>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center pt-1">
            <p className="text-slate-600 text-[7px]">Base URL: <code className="text-amber-400/60 font-mono">{baseUrl}</code></p>
            <p className="text-slate-600 text-[7px] mt-0.5">All endpoints return JSON. No API key required for read-only access.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApiDocs;
