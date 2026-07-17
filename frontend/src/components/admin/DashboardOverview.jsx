import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function DashboardOverview({ token, siteSlug }) {
  const [stats, setStats] = useState({ markets: 0, activeMarkets: 0, todayResults: 0, admins: 0 });
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [marketsRes, resultsRes, adminsRes] = await Promise.all([
          axios.get(`${API}/markets`, { headers }),
          axios.get(`${API}/results`, { headers }),
          axios.get(`${API}/admin/all`, { headers }).catch(() => ({ data: [] }))
        ]);
        const markets = marketsRes.data;
        const results = resultsRes.data;
        const admins = adminsRes.data || [];
        setStats({
          markets: markets.length,
          activeMarkets: markets.filter((m) => m.active).length,
          todayResults: results.filter((r) => {
            const today = new Date();
            const rd = new Date(r.date);
            return rd.toDateString() === today.toDateString();
          }).length,
          admins: Array.isArray(admins) ? admins.length : 0
        });
        setRecentResults(results.slice(0, 5));
      } catch { /* ignore */ }
    };
    fetchData();
  }, [token]);

  const cards = [
    {
      label: 'Total Markets',
      value: stats.markets,
      sub: `${stats.activeMarkets} active`,
      gradient: 'from-purple-600 to-indigo-600',
      shadow: 'shadow-purple-500/25',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      label: "Today's Results",
      value: stats.todayResults,
      sub: 'results added today',
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/25',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11L12 14L22 4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16"/>
        </svg>
      )
    },
    {
      label: 'Total Admins',
      value: stats.admins,
      sub: 'registered admins',
      gradient: 'from-orange-500 to-red-600',
      shadow: 'shadow-orange-500/25',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"/>
          <path d="M23 21V19C22.7356 17.4697 21.9369 16.0728 20.74 15.05"/>
          <path d="M16 3.13C17.215 3.613 18.1947 4.543 18.76 5.72C19.3253 6.897 19.4364 8.222 99.074 9.27"/>
        </svg>
      )
    },
    {
      label: 'Site Status',
      value: 'Live',
      sub: 'all systems operational',
      gradient: 'from-sky-500 to-cyan-600',
      shadow: 'shadow-sky-500/25',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group"
            style={{ background: `linear-gradient(135deg, var(--${card.gradient}))` }}>
            <div className={`bg-gradient-to-br ${card.gradient} ${card.shadow} p-5 text-white relative z-10`}>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {card.icon}
                </div>
                <span className="text-3xl font-bold">{card.value}</span>
              </div>
              <div className="text-sm font-medium opacity-90">{card.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{card.sub}</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          </div>
        ))}
      </div>

      {/* Recent Results */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-amber-400">Recent Results</h3>
          <span className="text-xs text-slate-400">Latest entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-left p-3 text-xs font-semibold text-slate-400 uppercase">Market</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
                <th className="text-center p-3 text-xs font-semibold text-slate-400 uppercase">Open</th>
                <th className="text-center p-3 text-xs font-semibold text-slate-400 uppercase">Jodi</th>
                <th className="text-center p-3 text-xs font-semibold text-slate-400 uppercase">Close</th>
                <th className="text-center p-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"/>
                        <path d="M14 2V8H20"/>
                        <path d="M12 18V12"/>
                        <path d="M9 15H15"/>
                      </svg>
                      <span>No results yet. Start by adding markets and results.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                recentResults.map((r) => (
                  <tr key={r._id} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-3 font-medium text-white">{r.market?.name || 'Unknown'}</td>
                    <td className="p-3 text-slate-400">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="p-3 text-center font-mono text-white">{r.openPatti || '-'}</td>
                    <td className="p-3 text-center font-mono font-bold text-amber-400">{r.jodi || '-'}</td>
                    <td className="p-3 text-center font-mono text-white">{r.closePatti || '-'}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        r.status === 'closed' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <a href="/admin/markets"
          className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-amber-500/30 hover:shadow-md transition-all group">
          <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
            <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Manage Markets</div>
            <div className="text-xs text-slate-400">Add or edit markets</div>
          </div>
        </a>
        <a href="/admin/results"
          className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/30 hover:shadow-md transition-all group">
          <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
            <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11L12 14L22 4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Add Results</div>
            <div className="text-xs text-slate-400">Update daily results</div>
          </div>
        </a>
        <a href="/admin/settings"
          className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-amber-500/30 hover:shadow-md transition-all group">
          <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
            <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1V5M12 19V23M5 12H1M23 12H19M18.36 5.64L15.54 8.46M8.46 15.54L5.64 18.36M18.36 18.36L15.54 15.54M8.46 8.46L5.64 5.64"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Site Settings</div>
            <div className="text-xs text-slate-400">Customize your site</div>
          </div>
        </a>
        <a href={siteSlug ? `/site/${siteSlug}` : '/'}
          className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-amber-500/30 hover:shadow-md transition-all group">
          <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
            <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13V19C18 20.1 17.1 21 16 21H6C4.9 21 4 20.1 4 19V8C4 6.9 4.9 6 6 6H12"/>
              <path d="M15 3H21V9"/>
              <path d="M10 14L21 3"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">View Website</div>
            <div className="text-xs text-slate-400">/site/{siteSlug || '...'}</div>
          </div>
        </a>
      </div> */}
    </div>
);
}

export default DashboardOverview;
