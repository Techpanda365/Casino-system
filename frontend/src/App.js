import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/admin/Dashboard';
import PublicWebsite from './pages/PublicWebsite';
import AboutPage from './pages/AboutPage';
import ApiPage from './pages/ApiPage';
import ForumSectionPage from './pages/ForumSectionPage';
import ChartSectionPage from './pages/ChartSectionPage';
import MarketChartPage from './pages/MarketChartPage';
import MainBombayChart from './pages/MainBombayChart';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        duration: 3000,
        style: { background: '#1e293b', color: '#fff', fontSize: '14px', borderRadius: '10px' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/site/:slug" element={<PublicWebsite />} />
        <Route path="/site/:slug/about" element={<AboutPage />} />
        <Route path="/site/:slug/api" element={<ApiPage />} />
        <Route path="/site/:slug/forum/:section" element={<ForumSectionPage />} />
        <Route path="/site/:slug/forum/:section/:postId" element={<ForumSectionPage />} />
        <Route path="/site/:slug/chart/:chartType" element={<ChartSectionPage />} />
        <Route path="/site/:slug/chart/:chartType/:marketName" element={<MarketChartPage />} />
        <Route path="/site/:slug/main-bombay-chart" element={<MainBombayChart />} />
        <Route path="/login" element={
          <Login setToken={setToken} setRole={setRole} />
        } />
        <Route path="/admin/*" element={
          token ? (
            <Dashboard token={token} role={role} setToken={setToken} setRole={setRole} />
          ) : (
            <Login setToken={setToken} setRole={setRole} />
          )
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
