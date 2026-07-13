import React from 'react';

function LiveTicker({ results, onRefresh, refreshing }) {
  if (results.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-2">
      <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/5 border-b border-white/[0.12] px-3 py-1.5 text-center">
          <h2 className="text-amber-400/90 font-bold text-sm">☔ LIVE RESULT</h2>
          <p className="text-slate-600 text-xs">Sabse Tezz Live Result Yahi Milega</p>
        </div>
        <div className="flex flex-col items-center gap-2 p-3">
          {results.map((r) => (
            <div key={r.marketId} className="w-full max-w-md bg-white/[0.02] border border-white/[0.12] rounded-lg p-2 text-center flex flex-col items-center hover:border-amber-500/15 transition-colors">
              <div className="text-slate-400 font-semibold text-xs uppercase tracking-wider">{r.name}</div>
              {r.hasResult ? (
                <div className="text-white font-mono font-bold text-lg tracking-wider mt-1">
                  {r.openPatti}{r.jodi ? `-${r.jodi}` : ''}{r.closePatti ? `-${r.closePatti}` : ''}
                </div>
              ) : (
                <div className="text-slate-700 font-mono text-sm py-1">Loading...</div>
              )}
              <button onClick={onRefresh} disabled={refreshing}
                className="mt-1 bg-white/[0.05] text-slate-500 px-2 py-1 rounded text-[10px] hover:bg-amber-500/10 hover:text-amber-400 transition border border-white/[0.12] inline-flex items-center gap-1">
                <svg className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4V10H17M1 20V14H7M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
                Refresh
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LiveTicker;
