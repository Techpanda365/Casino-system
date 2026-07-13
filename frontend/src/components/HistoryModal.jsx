import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/public';

function HistoryModal({ slug, marketId, marketName, type, onClose }) {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marketId) return;
    setLoading(true);
    axios
      .get(`${API}/history/${slug}/${marketId}?type=${type}`)
      .then((r) => setWeeks(r.data.weeks || []))
      .catch(() => setWeeks([]))
      .finally(() => setLoading(false));
  }, [slug, marketId, type]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm pt-4 pb-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d1a] border border-white/[0.12] rounded-xl w-full max-w-4xl mx-4 overflow-hidden shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600/30 to-amber-500/10 border-b border-amber-500/25 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-amber-400 font-bold text-sm uppercase tracking-widest">
              {marketName}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {type === 'jodi'
                ? 'Jodi Chart Record (Historical)'
                : 'Panel Chart Record (Historical)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition text-xl leading-none w-7 h-7 flex items-center justify-center rounded border border-white/[0.1] hover:border-white/20"
          >
            ✕
          </button>
        </div>

        {/* Sub-header label */}
        <div className="bg-amber-500/10 border-b border-amber-500/15 px-4 py-1.5 text-center">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
            {marketName} {type === 'jodi' ? 'Jodi' : 'Panel'} Result Chart Records
          </span>
        </div>

        {/* Body */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">Loading...</div>
          ) : weeks.length === 0 ? (
            <div className="py-16 text-center text-slate-600 text-sm">
              Koi record nahi mila. Admin se results enter karwayein.
            </div>
          ) : type === 'jodi' ? (
            <JodiChart weeks={weeks} />
          ) : (
            <PanelChart weeks={weeks} />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/[0.08] text-center text-slate-600 text-xs bg-[#0d0d1a]">
          {marketName} • {type === 'jodi' ? 'Jodi' : 'Panel'} Chart • Total {weeks.length} weeks
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   JODI CHART — 6-column grid like reference site
   Each row = one week's 6 jodi numbers
───────────────────────────────────────────── */
function JodiChart({ weeks }) {
  return (
    <table className="w-full text-center border-collapse min-w-[500px]">
      <thead>
        <tr className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20">
          {[1, 2, 3, 4, 5, 6].map((d) => (
            <th key={d} className="py-2 px-2 text-amber-400/70 text-xs font-bold border-r border-white/[0.07] last:border-r-0">
              Day {d}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((row, i) => (
          <tr
            key={i}
            className={`border-b border-white/[0.05] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
          >
            {/* Pad row to always have 6 cells */}
            {Array.from({ length: 6 }).map((_, j) => (
              <td
                key={j}
                className="py-2 px-2 font-mono font-bold text-sm border-r border-white/[0.07] last:border-r-0"
              >
                {row[j] ? (
                  <span className={row[j] === '**' ? 'text-slate-700' : 'text-white'}>
                    {row[j]}
                  </span>
                ) : (
                  <span className="text-slate-700">**</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─────────────────────────────────────────────
   PANEL CHART — date-range rows
   Each row: date label + up to 6 days of Open|Jodi|Close
───────────────────────────────────────────── */
function PanelChart({ weeks }) {
  // How many day-columns do we need (max days in any week)
  const maxDays = Math.max(...weeks.map((w) => w.days.length), 1);
  const cols = Math.min(maxDays, 6);

  return (
    <table className="w-full text-center border-collapse text-xs min-w-[500px]">
      <thead>
        <tr className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20">
          <th className="py-2 px-3 text-amber-400/70 font-bold text-left whitespace-nowrap border-r border-white/[0.1]">
            Date Range
          </th>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="py-2 px-1 text-amber-400/70 font-bold border-r border-white/[0.07] last:border-r-0">
              <div className="text-green-400/70">Open</div>
              <div className="text-amber-400/70 text-[10px]">Jodi</div>
              <div className="text-red-400/70">Close</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, i) => (
          <tr
            key={i}
            className={`border-b border-white/[0.05] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
          >
            {/* Date range label */}
            <td className="py-2 px-3 text-slate-500 text-[10px] font-mono whitespace-nowrap text-left border-r border-white/[0.1]">
              {week.label}
            </td>

            {/* Day columns */}
            {Array.from({ length: cols }).map((_, j) => {
              const day = week.days[j];
              const isEmpty = !day;
              return (
                <td
                  key={j}
                  className="py-1 px-1 border-r border-white/[0.07] last:border-r-0"
                >
                  {isEmpty ? (
                    <div className="text-slate-700 font-mono">
                      <div>* * *</div>
                      <div className="text-[10px]">**</div>
                      <div>* * *</div>
                    </div>
                  ) : (
                    <div className="font-mono leading-tight">
                      <div className="text-green-400 font-bold tracking-wider">
                        {formatPatti(day.openPatti)}
                      </div>
                      <div className="text-amber-400 font-bold text-sm">
                        {day.jodi}
                      </div>
                      <div className="text-red-400 font-bold tracking-wider">
                        {formatPatti(day.closePatti)}
                      </div>
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Format patti as "1 2 3" spaced like reference site
function formatPatti(patti) {
  if (!patti || patti === '* * *' || patti === '---') return '* * *';
  return patti.split('').join(' ');
}

export default HistoryModal;
