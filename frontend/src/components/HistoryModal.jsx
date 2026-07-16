import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/public';

function HistoryModal({ slug, marketId, marketName, type, onClose, siteName, markets = [] }) {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentResult, setCurrentResult] = useState(null);
  const tableRef = useRef(null);

  const fetchData = useCallback(() => {
    if (!marketId) return;
    setLoading(true);
    axios
      .get(`${API}/history/${slug}/${marketId}?type=${type}`)
      .then((r) => {
        setWeeks(r.data.weeks || []);
        setCurrentResult(r.data.currentResult || null);
      })
      .catch(() => setWeeks([]))
      .finally(() => setLoading(false));
  }, [slug, marketId, type]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const goToBottom = () => {
    if (tableRef.current) {
      const container = tableRef.current.closest('.overflow-y-auto');
      if (container) container.scrollTop = container.scrollHeight;
    }
  };

  const goToTop = () => {
    if (tableRef.current) {
      const container = tableRef.current.closest('.overflow-y-auto');
      if (container) container.scrollTop = 0;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm pt-4 pb-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d1a] border border-white/[0.12] rounded-xl w-full max-w-5xl mx-4 overflow-hidden shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button row */}
        <div className="flex justify-end px-3 pt-2">
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition text-xl leading-none w-7 h-7 flex items-center justify-center rounded border border-white/[0.1] hover:border-white/20"
          >
            ✕
          </button>
        </div>

        {/* === DPBOSS STYLE HEADER === */}
        <div className="px-4 pb-4 text-center">
          <h1 className="text-amber-400 font-bold text-lg uppercase tracking-wider">
            {marketName} {type === 'jodi' ? 'JODI' : 'PANEL'} CHART
          </h1>
          <h2 className="text-white/70 text-xs mt-1 font-semibold uppercase tracking-wider">
            {marketName} {type === 'jodi' ? 'JODI RESULT CHART RECORDS' : 'PANEL RESULT CHART RECORDS'}
          </h2>
          <p className="text-slate-600 text-[10px] mt-2 leading-relaxed max-w-3xl mx-auto">
            {type === 'jodi'
              ? `${marketName} jodi chart, ${marketName} jodi result chart records, old ${marketName} jodi chart, ${marketName} chart, ${marketName} jodi record, ${marketName} jodi chart, matka jodi chart, satta ${marketName} chart jodi, ${marketName} state chart, ${marketName} chart result`
              : `${marketName} panel chart, ${marketName} panel result chart records, old ${marketName} panel chart, ${marketName} chart, ${marketName} penal record, matka panel chart, satta ${marketName} panel chart`
            }
          </p>
        </div>

        {/* Go to Bottom */}
        {!loading && weeks.length > 0 && (
          <div className="flex justify-end px-4 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
            <button onClick={goToBottom} className="text-amber-400/70 hover:text-amber-400 transition text-[11px] font-semibold flex items-center gap-1">
              ⬇ Go to Bottom
            </button>
          </div>
        )}

        {/* Body */}
        <div className="overflow-x-auto overflow-y-auto max-h-[55vh]">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">Loading...</div>
          ) : weeks.length === 0 ? (
            <div className="py-16 text-center text-slate-600 text-sm">
              Koi record nahi mila. Admin se results enter karwayein.
            </div>
          ) : (
            <div ref={tableRef}>
              {type === 'jodi' ? <JodiChart weeks={weeks} /> : <PanelChart weeks={weeks} />}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && weeks.length > 0 && (
          <div className="border-t border-white/[0.08] bg-[#0d0d1a]">
            <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/5 border-b border-amber-500/20 px-4 py-3">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="text-white font-bold text-sm uppercase tracking-wider">{marketName}</span>
                {currentResult ? (
                  <span className="text-amber-400 font-mono font-bold text-base tracking-wider">
                    {currentResult.openPatti}-{currentResult.jodi}-{currentResult.closePatti}
                  </span>
                ) : (
                  <span className="text-slate-600 text-sm">No result yet</span>
                )}
                <button
                  onClick={fetchData}
                  className="text-xs text-amber-400 hover:text-amber-300 transition border border-amber-500/30 px-3 py-1 rounded font-semibold"
                >
                  ↻ Refresh Result
                </button>
              </div>
            </div>
            {/* SEO Description + FAQ Section */}
            {type === 'jodi' ? (
              <div className="px-4 py-4 space-y-4">
                <p className="text-slate-400 text-xs leading-relaxed">
                  {siteName || 'Lucky Bazar'} Services is the best Satta Matka betting platform in the gambling industry, its team is committed to taking great care to serve online betting audiences all over the world. This online gambling site is operated by a fully licensed and reliable international gambling provider, who provides its customers with all the essential state-of-the-art gambling tools as well as resources. Whether you are playing the {marketName} game or any other betting game on {siteName || 'Lucky Bazar'} Services, you can rest assured that you will get the best gambling experience online.
                </p>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Get {marketName} Jodi Chart Records</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {siteName || 'Lucky Bazar'} Services is the only Satta Matka website in the gambling industry that is devoted to enforcing juvenile gambling prevention. It is because this Satta Matka betting platform strictly adheres to gambling policies and principles laid down by the international gambling industry. The site is also acknowledged for offering simple-to-gamble processes, industry-leading customer, and game support, as well as a bounty of deposit and withdrawal options to its online players. This Satta Matka website always strives to ensure that gamblers are matched with the right betting platform to get the right gambling experience they deserve.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Frequently Asked Questions (FAQs):</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-white text-xs font-semibold">Q1. Can I play my {marketName} game efficiently on {siteName || 'Lucky Bazar'} Services?</p>
                      <p className="text-slate-400 text-xs mt-0.5">Yes, you can because you will get all the essential gambling tools and resources to achieve an efficient gambling experience.</p>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Q2. How can I trust that {siteName || 'Lucky Bazar'} Services can offer me a safe gaming experience?</p>
                      <p className="text-slate-400 text-xs mt-0.5">The online Satta Matka website is well-known not only for providing its users with a safe gambling experience but also for a responsible one.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 space-y-4">
                <p className="text-slate-400 text-xs leading-relaxed">
                  The {marketName} Panel Chart remains a valuable reference for readers who prefer organized historical panel records instead of scattered information. Moreover, a structured format supports quick comparison, while historical panel records and number pattern data create a better reading experience for users seeking clarity and consistency.
                </p>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">What is {marketName} Panel Chart?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    The {marketName} Panel Chart is a historical record that displays previously announced panel number combinations in a structured and chronological format. It helps readers review archived number data, compare records, and identify recurring patterns through organized presentation. Moreover, the chart improves accessibility by arranging information clearly, making historical panel records easier to browse, reference, and analyze whenever required.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Why Are Historical {marketName} Panel Charts Important?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Many readers rely on the {marketName} Panel Chart because organized historical records simplify comparisons across different periods. Moreover, well-arranged panel result history allows faster navigation, while number pattern records remain easier to review without unnecessary searching.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">How Does {marketName} Panel Chart Organize Records?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    A properly arranged {marketName} Panel Chart groups information in a logical sequence, making historical panel records more accessible. Consequently, readers can compare previous number combinations without confusion, while structured layouts reduce unnecessary repetition during long reviews.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Why Do Historical Panel Records Complete {marketName} Panel Chart?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Historical panel records complement {marketName} Panel Chart by providing chronological consistency and organized references. Furthermore, systematic number history supports efficient comparison, whereas random collections often create difficulty during detailed observation.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">How Does {marketName} Panel Chart Support Pattern Analysis?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    A structured {marketName} Panel Chart provides readers with an organized foundation for reviewing number sequences and historical combinations. However, consistent analysis depends on careful observation, while historical pattern records improve comparison through logical presentation.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Which Patterns Stand Out in {marketName} Panel Chart?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Several readers use {marketName} Panel Chart to review recurring number groups, repeated combinations, and historical sequences, including:
                  </p>
                  <ul className="text-slate-400 text-xs list-disc list-inside mt-1 space-y-0.5">
                    <li>Repeated panel combinations</li>
                    <li>Chronological number patterns</li>
                    <li>Historical sequence records</li>
                    <li>Frequency comparisons</li>
                    <li>Organized monthly records</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Why Does {marketName} Panel Chart Improve Observation?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Structured observation becomes more effective through {marketName} Panel Chart because readers can compare organized records instead of isolated entries. Consequently, historical panel data supports balanced evaluation, while systematic formatting improves overall readability.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">What Features Simplify {marketName} Panel Chart?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    An effective {marketName} Panel Chart combines readability with logical presentation, making historical number records easier to review. Furthermore, clear formatting enhances navigation, while consistent organization reduces unnecessary effort during comparison.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Which Layout Details Enhance {marketName} Panel Chart?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Several layout features improve {marketName} Panel Chart for readers who value clarity.
                  </p>
                  <ul className="text-slate-400 text-xs list-disc list-inside mt-1 space-y-0.5">
                    <li>Clean chronological order</li>
                    <li>Consistent formatting style</li>
                    <li>Clearly separated sections</li>
                    <li>Readable spacing</li>
                    <li>Simple navigation structure</li>
                    <li>Organized historical data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">How Does Formatting Make {marketName} Panel Chart Better?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Clean formatting strengthens the {marketName} Panel Chart by reducing distractions and improving readability. In contrast, overcrowded layouts create confusion, whereas organized number history remains easier to compare and review over longer periods.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Why Should {marketName} Panel Chart Stay Consistent?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Consistency makes the {marketName} Panel Chart more reliable because organized information supports efficient comparison across historical records. Moreover, stable formatting helps readers locate specific number combinations quickly without scanning unnecessary sections.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">How Does Consistency Enhance {marketName} Panel Chart?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    A consistent {marketName} Panel Chart preserves readability while maintaining logical flow across different timeframes. Consequently, historical number records remain accessible, and structured presentation encourages systematic review instead of random observation.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Which Best Practices Support {marketName} Panel Chart?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Several practices increase the quality of {marketName} Panel Chart and historical result collections.
                  </p>
                  <ul className="text-slate-400 text-xs list-disc list-inside mt-1 space-y-0.5">
                    <li>Maintain chronological order</li>
                    <li>Separate monthly records</li>
                    <li>Use consistent numbering</li>
                    <li>Keep clear headings</li>
                    <li>Verify data accuracy</li>
                    <li>Preserve uniform spacing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">How Does {marketName} Panel Chart Organize Information?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    A properly maintained {marketName} Panel Chart supports better information management by organizing historical number records into accessible sections. Moreover, structured panel history reduces unnecessary duplication, while categorized information remains easier to revisit whenever required.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Why Does Organized Data Strengthen {marketName} Panel Chart?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Organized data strengthens the {marketName} Panel Chart because readers can compare historical combinations with greater efficiency. Consequently, structured number records improve accessibility, whereas scattered information often interrupts logical review.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">How Does {marketName} Panel Chart Support Better Records?</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    An organized {marketName} Panel Chart promotes disciplined record keeping through clear categorization and chronological arrangement. Furthermore, consistent documentation supports easier comparison, while historical result collections remain useful across extended periods.
                  </p>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">FAQs</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-white text-xs font-semibold">Q1: What is the purpose of {marketName} Panel Chart?</p>
                      <p className="text-slate-400 text-xs mt-0.5">The primary purpose of {marketName} Panel Chart is to organize historical panel number combinations into a structured format for easier comparison. Moreover, chronological presentation improves readability while supporting long-term reference.</p>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Q2: Why do readers prefer {marketName} Panel Chart for historical records?</p>
                      <p className="text-slate-400 text-xs mt-0.5">Many readers prefer {marketName} Panel Chart because structured historical records simplify navigation and comparison. Furthermore, organized number history reduces confusion while improving accessibility.</p>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Q3: How does {marketName} Panel Chart improve readability?</p>
                      <p className="text-slate-400 text-xs mt-0.5">A well-structured {marketName} Panel Chart improves readability through clean formatting, organized spacing, and chronological presentation. Consequently, readers can compare historical panel records more comfortably.</p>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Q4: What features make {marketName} Panel Chart more effective?</p>
                      <p className="text-slate-400 text-xs mt-0.5">Several features increase the effectiveness of {marketName} Panel Chart, including chronological arrangement, accurate record organization, readable formatting, and logical sectioning. Moreover, these elements create better accessibility while supporting efficient historical number comparison.</p>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Q5: Why is organized historical data important in {marketName} Panel Chart?</p>
                      <p className="text-slate-400 text-xs mt-0.5">Organized historical data enhances the {marketName} Panel Chart by preserving consistency and improving accessibility. Furthermore, systematic records allow readers to review previous combinations more efficiently, while structured presentation supports clear comparison without unnecessary repetition.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center px-4 py-2 border-t border-white/[0.06]">
              <button onClick={goToTop} className="text-amber-400/60 hover:text-amber-400 transition text-[11px] font-semibold">⬆ Go to Top</button>
            </div>
            {/* Chart Sitemap */}
            {markets.length > 0 && (
              <div className="px-4 py-4 space-y-4 border-t border-white/[0.06]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20 px-3 py-2 text-center">
                      <h3 className="text-amber-400 font-bold text-xs uppercase tracking-widest">SATTA MATKA JODI CHART</h3>
                    </div>
                    <div className="flex flex-col items-center divide-y divide-white/[0.06] max-h-[200px] overflow-y-auto">
                      {markets.map(m => (
                        <Link key={`hm-j-${m._id}`} to={`/site/${slug}/chart/jodi-count/${encodeURIComponent(m.name)}`}
                          className="w-full text-center px-3 py-1.5 text-[11px] text-slate-300 hover:text-amber-400 hover:bg-white/[0.03] transition"
                          onClick={onClose}
                        >
                          {m.name} Chart
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20 px-3 py-2 text-center">
                      <h3 className="text-amber-400 font-bold text-xs uppercase tracking-widest">MATKA PANEL CHART</h3>
                    </div>
                    <div className="flex flex-col items-center divide-y divide-white/[0.06] max-h-[200px] overflow-y-auto">
                      {markets.map(m => (
                        <Link key={`hm-p-${m._id}`} to={`/site/${slug}/chart/penal-count/${encodeURIComponent(m.name)}`}
                          className="w-full text-center px-3 py-1.5 text-[11px] text-slate-300 hover:text-amber-400 hover:bg-white/[0.03] transition"
                          onClick={onClose}
                        >
                          {m.name} Panel Chart
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-1 pt-2 border-t border-white/[0.06]">
                  <p className="text-amber-400 font-bold text-xs tracking-wider uppercase">{siteName || 'LUCKYBAZAR'}</p>
                  <p className="text-slate-500 text-[9px]">All Rights Reserved®</p>
                  <p className="text-slate-500 text-[9px]">(1998-2026)</p>
                  <p className="text-slate-400 text-[11px] font-semibold">Contact (Astrologer-Dpboss)</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   JODI CHART — 6-column grid like reference site
   Each row = one week's 6 jodi numbers
───────────────────────────────────────────── */
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function JodiChart({ weeks }) {
  return (
    <table className="w-full text-center border-collapse min-w-[700px]">
      <thead>
        <tr className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20">
          {DAY_NAMES.map((d) => (
            <th key={d} className="py-2 px-2 text-amber-400/70 text-xs font-bold border-r border-white/[0.07] last:border-r-0 uppercase tracking-wider">
              {d}
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
            {row.map((val, j) => (
              <td
                key={j}
                className="py-2 px-2 font-mono font-bold text-sm border-r border-white/[0.07] last:border-r-0"
              >
                <span className={val === '**' ? 'text-slate-700' : 'text-white'}>
                  {val}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─────────────────────────────────────────────
   PANEL CHART — dpboss style (1 column per day, vertical Open/Jodi/Close)
   Each row: date label + 7 days with Open|Jodi|Close stacked
───────────────────────────────────────────── */
function PanelChart({ weeks }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <table className="w-full text-center border-collapse min-w-[900px]">
      <thead>
        <tr className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20">
          <th className="py-2 px-2 text-amber-400/70 text-xs font-bold border-r border-white/[0.07]">Date</th>
          {days.map((d) => (
            <th key={d} className="py-2 px-2 text-amber-400/70 text-xs font-bold border-r border-white/[0.07] last:border-r-0 uppercase tracking-wider">
              {d}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, i) => {
          const dayMap = {};
          week.days.forEach((day) => {
            const dow = new Date(day.date).getDay();
            dayMap[dow] = day;
          });
          return (
            <tr key={i} className={`border-b border-white/[0.05] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
              <td className="py-2 px-2 text-slate-500 text-[10px] font-mono border-r border-white/[0.07] leading-tight align-middle">
                {week.label}
              </td>
              {[1,2,3,4,5,6,0].map((dow) => {
                const day = dayMap[dow];
                return (
                  <td key={dow} className="py-1.5 px-1 border-r border-white/[0.07] last:border-r-0">
                    {day ? (
                      <div className="font-mono leading-tight">
                        <div className="text-green-400 font-bold tracking-wider text-[11px]">{formatPatti(day.openPatti)}</div>
                        <div className="text-amber-400 font-bold text-sm">{day.jodi}</div>
                        <div className="text-red-400 font-bold tracking-wider text-[11px]">{formatPatti(day.closePatti)}</div>
                      </div>
                    ) : (
                      <div className="text-slate-700 font-mono leading-tight">
                        <div className="text-[11px]">* * *</div>
                        <div className="text-[10px]">**</div>
                        <div className="text-[11px]">* * *</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
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
