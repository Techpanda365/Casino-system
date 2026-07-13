import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import AdminList from '../AdminList';
import SubscriptionPlan from '../SubscriptionPlan';
import MarketManagement from './MarketManagement';
import ResultManagement from './ResultManagement';
import SiteSettings from './SiteSettings';
import GuessManagement from './GuessManagement';
import ChartManagement from './ChartManagement';

import DashboardOverview from './DashboardOverview';
import StarlineManagement from './StarlineManagement';
import PassHuaManagement from './PassHuaManagement';
import StarlineChartManagement from './StarlineChartManagement';
import BannerManagement from './BannerManagement';
import ForumManagement from './ForumManagement';
import Profile from './Profile';
import MainBombayManagement from './MainBombayManagement';

const navItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      end: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      )
    },
    {
      path: '/admin/markets',
      label: 'Markets',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      path: '/admin/guesses',
      label: 'Free Fix Game',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      path: '/admin/results',
      label: 'Results',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11L12 14L22 4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16"/>
        </svg>
      )
    },
    {
      path: '/admin/charts',
      label: 'Charts',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      path: '/admin/starline',
      label: 'Starline',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      )
    },
    {
      path: '/admin/passhua',
      label: 'Aaj Pass Hua',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11L12 14L22 4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      )
    },
    {
      path: '/admin/starline-charts',
      label: 'Starline Charts',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      )
    },
    {
      path: '/admin/banners',
      label: 'Banners',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15L16 10L5 21" />
        </svg>
      )
    },
    {
      path: '/admin/forums',
      label: 'Forum Zones',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      path: '/admin/main-bombay',
      label: 'Main Bombay 36',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      adminOnly: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1V5M12 19V23M5 12H1M23 12H19M18.36 5.64L15.54 8.46M8.46 15.54L5.64 18.36M18.36 18.36L15.54 15.54M8.46 8.46L5.64 5.64"/>
        </svg>
      )
    },
  {
    path: '/admin/admins',
    label: 'Admins',
    superadminOnly: true,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"/>
      </svg>
    )
  },
  {
    path: '/admin/profile',
    label: 'Edit Profile',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
];

function Dashboard({ token, role, setToken, setRole }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const siteSlug = localStorage.getItem('siteSlug') || '';
  const adminName = localStorage.getItem('adminName') || '';
  const adminAvatar = localStorage.getItem('adminAvatar') || '';

  const logout = () => {
    localStorage.clear();
    setToken('');
    setRole('');
    navigate('/admin');
  };

  const isActive = (item) => {
    if (item.end) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
        {/* Brand */}
        <div className={`p-4 border-b border-slate-700 ${sidebarOpen ? '' : 'px-2'}`}>
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {sidebarOpen && (
              <div>
                  <div className="font-bold text-sm text-amber-400">Admin Panel</div>
                <div className="text-xs text-slate-400">{role === 'superadmin' ? 'Super Admin' : 'Admin'}</div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white flex justify-center">
          <svg className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.filter((item) => {
            if (item.superadminOnly) return role === 'superadmin';
            if (item.adminOnly) return role === 'admin';
            return true;
          }).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive(item)
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${!sidebarOpen && 'justify-center px-0'}`}
              title={!sidebarOpen ? item.label : ''}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-t border-slate-700">
          {sidebarOpen && (
            <div className="mb-3 px-3 py-2 bg-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-400">Signed in as</div>
              <div className="text-sm font-medium text-white truncate">{adminName || role}</div>
            </div>
          )}
          <button onClick={logout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all ${!sidebarOpen && 'justify-center'}`}
            title={!sidebarOpen ? 'Logout' : ''}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"/>
              <path d="M16 17L21 12L16 7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>

          {sidebarOpen && siteSlug && (
            <Link to={`/site/${siteSlug}`}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all mt-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13V19C18 20.1 17.1 21 16 21H6C4.9 21 4 20.1 4 19V8C4 6.9 4.9 6 6 6H12"/>
                <path d="M15 3H21V9"/>
                <path d="M10 14L21 3"/>
              </svg>
              <span>My Site</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-900 shadow-sm border-b border-slate-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-amber-400">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Welcome back, {adminName || role}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/profile"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition group"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {adminAvatar ? (
                    <img src={adminAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (adminName || role)[0].toUpperCase()
                  )}
                </div>
                <span className="text-xs text-slate-300 group-hover:text-white transition">{adminName || role}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview token={token} siteSlug={siteSlug} />} />
            {role !== 'superadmin' && (
              <Route path="/markets" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <MarketManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/guesses" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <GuessManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/results" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <ResultManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/charts" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <ChartManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/starline" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <StarlineManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/passhua" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <PassHuaManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/starline-charts" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <StarlineChartManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/banners" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <BannerManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/forums" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <ForumManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/main-bombay" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <MainBombayManagement token={token} />
                </div>
              } />
            )}
            {role === 'superadmin' && (
              <Route path="/forums" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <ForumManagement token={token} />
                </div>
              } />
            )}
            {role !== 'superadmin' && (
              <Route path="/settings" element={
                <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                  <SiteSettings token={token} />
                </div>
              } />
            )}
            {role === 'superadmin' && (
              <Route path="/admins" element={
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                    <AdminList token={token} />
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                    <SubscriptionPlan />
                  </div>
                </div>
              } />
            )}
            <Route path="/profile" element={
              <div className="bg-slate-800/50 rounded-2xl shadow-sm border border-slate-700 p-6">
                <Profile token={token} />
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
