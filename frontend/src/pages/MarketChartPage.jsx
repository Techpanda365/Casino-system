import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/public';

function MarketChartPage() {
  const { slug, chartType, marketName } = useParams();
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dynamicData, setDynamicData] = useState(null);
  const decodedName = decodeURIComponent(marketName);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const dynamicTypes = ['jodi-count', 'jodi-family', 'penal-count', 'penal-total'];

    if (dynamicTypes.includes(chartType)) {
      const historyType = chartType.startsWith('jodi') ? 'jodi' : 'panel';
      // Fetch markets to get market ID, then fetch history
      axios.get(`${API}/markets/${slug}`)
        .then((res) => {
          const market = res.data.find(m => m.name.toLowerCase() === decodedName.toLowerCase());
          if (!market) {
            setDynamicData(null);
            setLoading(false);
            return;
          }
          return axios.get(`${API}/history/${slug}/${market._id}?type=${historyType}`)
            .then((hRes) => {
              setDynamicData(hRes.data);
              setLoading(false);
            });
        })
        .catch(() => { setDynamicData(null); setLoading(false); });
    } else {
      axios.get(`${API}/charts/${slug}`)
        .then((r) => {
          const found = r.data.find(c =>
            c.type === chartType && c.marketName?.toLowerCase() === decodedName.toLowerCase()
          );
          setChart(found || null);
        })
        .catch(() => setChart(null))
        .finally(() => setLoading(false));
    }
  }, [slug, chartType, decodedName]);

  const renderPanelChart = (data) => {
    if (!data || !data.weeks) return <div className="text-slate-500 text-sm py-4">No results found.</div>;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-white/[0.04]">
              <th className="px-2 py-1.5 text-left text-slate-400 font-semibold border border-white/[0.08]">Week</th>
              <th className="px-2 py-1.5 text-left text-slate-400 font-semibold border border-white/[0.08]">Mon</th>
              <th className="px-2 py-1.5 text-left text-slate-400 font-semibold border border-white/[0.08]">Tue</th>
              <th className="px-2 py-1.5 text-left text-slate-400 font-semibold border border-white/[0.08]">Wed</th>
              <th className="px-2 py-1.5 text-left text-slate-400 font-semibold border border-white/[0.08]">Thu</th>
              <th className="px-2 py-1.5 text-left text-slate-400 font-semibold border border-white/[0.08]">Fri</th>
              <th className="px-2 py-1.5 text-left text-slate-400 font-semibold border border-white/[0.08]">Sat</th>
            </tr>
          </thead>
          <tbody>
            {data.weeks.map((week, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                <td className="px-2 py-1.5 text-slate-500 border border-white/[0.08] whitespace-nowrap">{week.label}</td>
                {week.days.map((day, j) => (
                  <td key={j} className="px-2 py-1.5 text-slate-300 border border-white/[0.08] whitespace-nowrap">
                    <div>{day.openPatti}</div>
                    <div className="text-amber-400/70 text-[10px]">{day.jodi}</div>
                    <div className="text-slate-500 text-[10px]">{day.closePatti}</div>
                  </td>
                ))}
                {week.days.length < 6 && Array.from({ length: 6 - week.days.length }).map((_, j) => (
                  <td key={`e${j}`} className="px-2 py-1.5 text-slate-600 border border-white/[0.08]">-</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderJodiChart = (data) => {
    if (!data || !data.weeks) return <div className="text-slate-500 text-sm py-4">No results found.</div>;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-white/[0.04]">
              <th className="px-2 py-1.5 text-center text-slate-400 font-semibold border border-white/[0.08]">#</th>
              <th className="px-2 py-1.5 text-center text-slate-400 font-semibold border border-white/[0.08]">Mon</th>
              <th className="px-2 py-1.5 text-center text-slate-400 font-semibold border border-white/[0.08]">Tue</th>
              <th className="px-2 py-1.5 text-center text-slate-400 font-semibold border border-white/[0.08]">Wed</th>
              <th className="px-2 py-1.5 text-center text-slate-400 font-semibold border border-white/[0.08]">Thu</th>
              <th className="px-2 py-1.5 text-center text-slate-400 font-semibold border border-white/[0.08]">Fri</th>
              <th className="px-2 py-1.5 text-center text-slate-400 font-semibold border border-white/[0.08]">Sat</th>
            </tr>
          </thead>
          <tbody>
            {data.weeks.map((week, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                <td className="px-2 py-1.5 text-slate-500 border border-white/[0.08] text-center">{i + 1}</td>
                {week.map((jodi, j) => (
                  <td key={j} className="px-2 py-1.5 text-slate-300 border border-white/[0.08] text-center">{jodi}</td>
                ))}
                {week.length < 6 && Array.from({ length: 6 - week.length }).map((_, j) => (
                  <td key={`e${j}`} className="px-2 py-1.5 text-slate-600 border border-white/[0.08] text-center">-</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-lg p-4">
          <div className="text-amber-500/50 text-[10px] uppercase tracking-wider mb-1">CHARTS</div>
          <h1 className="text-amber-400 font-bold text-lg uppercase tracking-wider mb-1">{decodedName}</h1>
          <p className="text-slate-500 text-xs mb-4">{chartType}</p>
          {loading ? (
            <div className="text-slate-500 text-sm py-4 text-center">Loading...</div>
          ) : dynamicData ? (
            chartType.startsWith('jodi') ? renderJodiChart(dynamicData) : renderPanelChart(dynamicData)
          ) : chart ? (
            <div className="text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap border-t border-white/[0.08] pt-4" dangerouslySetInnerHTML={{ __html: chart.content }} />
          ) : (
            <div className="text-slate-500 text-sm py-4 border-t border-white/[0.08] text-center">
              No content created yet.
            </div>
          )}
          <Link to={`/site/${slug}/chart/${chartType}`}
            className="inline-block text-amber-500 hover:text-amber-400 text-xs underline transition mt-4"
          >
            ← Back to {chartType}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MarketChartPage;