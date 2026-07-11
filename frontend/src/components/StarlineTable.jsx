import React from 'react';

function StarlineTable({ starlines }) {
  if (starlines.length === 0) return null;

  return (
    <section className="mt-2 max-w-7xl mx-auto px-4 space-y-2">
      {starlines.map((s) => (
        <div key={s._id} className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/5 border-b border-white/[0.12] px-3 py-1.5 text-center">
            <h3 className="text-amber-400/90 font-bold text-sm">{s.name}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="p-2 text-slate-500 text-xs uppercase tracking-widest font-medium text-left">Time</th>
                  <th className="p-2 text-slate-500 text-xs uppercase tracking-widest font-medium text-left">Result</th>
                  <th className="p-2 text-slate-500 text-xs uppercase tracking-widest font-medium text-left hidden sm:table-cell">Time</th>
                  <th className="p-2 text-slate-500 text-xs uppercase tracking-widest font-medium text-left hidden sm:table-cell">Result</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(s.slots.length / 2) }).map((_, rowIdx) => {
                  const left = s.slots[rowIdx * 2];
                  const right = s.slots[rowIdx * 2 + 1];
                  return (
                    <tr key={rowIdx} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="p-2 text-slate-400 text-xs">{left?.time || ''}</td>
                      <td className="p-2 text-white font-mono font-bold text-sm">{left?.result || '-'}</td>
                      <td className="p-2 text-slate-400 text-xs hidden sm:table-cell">{right?.time || ''}</td>
                      <td className="p-2 text-white font-mono font-bold text-sm hidden sm:table-cell">{right?.result || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}

export default StarlineTable;
