import React from 'react';

function GuessingZone({ guesses, date }) {
  if (!guesses || guesses.length === 0) return null;

  return (
    <section className="mt-2 bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">

      {/* Combined Header */}
      <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20 px-3 py-2 text-center space-y-0.5">
        <h2 className="text-amber-400 font-bold text-xs uppercase tracking-widest">
          FREE GAME ZONE OPEN-CLOSE
        </h2>
        <div className="text-slate-400 text-[10px]">
          ✔ DATE:↬ <span className="text-white font-semibold">{date}</span> ↫
        </div>
        <div className="text-green-400 text-[10px] font-semibold">
          FREE GUESSING DAILY
        </div>
        <div className="text-amber-400/70 text-[10px] font-bold tracking-wider uppercase">
          OPEN TO CLOSE FIX ANK
        </div>
      </div>

      {/* Market list — 2 columns with divider */}
      <div className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.12]">
          <div className="space-y-2 sm:pr-2">
            {guesses.filter((_, i) => i % 2 === 0).map((g) => (
              <div key={g._id} className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 hover:border-amber-500/20 transition-colors">
                <div className="text-amber-400 font-bold text-xs mb-1">
                  ↪ {g.marketId?.name || 'Unknown'}
                </div>
                <div className="space-y-0.5 pl-2 border-l-2 border-amber-500/20">
                  {g.openClose && <div className="text-white font-mono font-bold text-xs tracking-widest">{g.openClose}</div>}
                  {g.panel && <div className="text-slate-300 font-mono text-xs tracking-wider">{g.panel}</div>}
                  {g.jodi && <div className="text-slate-400 font-mono text-xs tracking-wider">{g.jodi}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 sm:pl-2">
            {guesses.filter((_, i) => i % 2 === 1).map((g) => (
              <div key={g._id} className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 hover:border-amber-500/20 transition-colors">
                <div className="text-amber-400 font-bold text-xs mb-1">
                  ↪ {g.marketId?.name || 'Unknown'}
                </div>
                <div className="space-y-0.5 pl-2 border-l-2 border-amber-500/20">
                  {g.openClose && <div className="text-white font-mono font-bold text-xs tracking-widest">{g.openClose}</div>}
                  {g.panel && <div className="text-slate-300 font-mono text-xs tracking-wider">{g.panel}</div>}
                  {g.jodi && <div className="text-slate-400 font-mono text-xs tracking-wider">{g.jodi}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GuessingZone;
