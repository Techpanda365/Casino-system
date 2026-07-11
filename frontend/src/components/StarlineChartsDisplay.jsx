import React from 'react';

function StarlineChartsDisplay({ charts }) {
  return (
    <section className="mt-2 max-w-7xl mx-auto px-4 space-y-2">
      <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
        <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">Starline Charts</span>
      </div>
      {Array.isArray(charts) && charts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {charts.map((c) => (
            <div key={c._id} className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/5 border-b border-white/[0.12] px-3 py-1.5 text-center">
                <span className="text-amber-400/80 font-semibold text-sm">{c.title || c.starlineName}</span>
              </div>
              <div className="p-3">
                {c.data && c.data.length > 0 ? (
                  <table className="w-full text-xs text-center">
                    <thead>
                      <tr className="text-slate-500 border-b border-white/[0.08]">
                        <th className="py-1.5 font-medium">Time</th>
                        <th className="py-1.5 font-medium">Result</th>
                        <th className="py-1.5 font-medium">Time</th>
                        <th className="py-1.5 font-medium">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const rows = [];
                        for (let i = 0; i < c.data.length; i += 2) {
                          const left = c.data[i];
                          const right = c.data[i + 1];
                          rows.push(
                            <tr key={i} className="border-b border-white/[0.04] text-slate-300">
                              <td className="py-1.5">{left?.label || '-'}</td>
                              <td className="py-1.5 text-amber-400 font-bold">{left?.value || '-'}</td>
                              <td className="py-1.5">{right?.label || '-'}</td>
                              <td className="py-1.5 text-amber-400 font-bold">{right?.value || '-'}</td>
                            </tr>
                          );
                        }
                        return rows;
                      })()}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-slate-400 text-xs font-mono leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: c.content }} />
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default StarlineChartsDisplay;
