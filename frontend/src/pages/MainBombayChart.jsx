import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/public';

function MainBombayChart() {
  const { slug } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/main-bombay36/${slug}`)
      .then(r => setRecords(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#0a0a14] pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-lg font-bold text-center text-red-400 mb-6 uppercase tracking-wider">Main Bombay 36 Bazar Chart</h1>
        {records.length === 0 ? (
          <p className="text-center text-slate-500 text-sm">No chart data available yet.</p>
        ) : (
          records.map((rec, idx) => (
            <div key={idx} className="mb-6 border border-pink-400/30 rounded-lg overflow-hidden bg-[#f5c8a5]/10">
              <div className="bg-purple-700 text-white text-center px-3 py-2 font-bold text-sm">
                {new Date(rec.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {rec.slots.map((s, i) => (
                  <div key={i} className="border border-pink-400/30 p-2 text-center">
                    <div className="text-[11px] font-bold text-slate-400">{s.time}</div>
                    <div className="text-sm font-mono font-bold mt-0.5" style={{ color: s.value ? '#f59e0b' : '#64748b' }}>
                      {s.value || '***'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MainBombayChart;
