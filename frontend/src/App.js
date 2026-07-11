import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/admin/Dashboard';
import PublicWebsite from './pages/PublicWebsite';
import AboutPage from './pages/AboutPage';
import ApiPage from './pages/ApiPage';
import ForumSectionPage from './pages/ForumSectionPage';
import ChartSectionPage from './pages/ChartSectionPage';
import MarketChartPage from './pages/MarketChartPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/site/:slug" element={<PublicWebsite />} />
        <Route path="/site/:slug/about" element={<AboutPage />} />
        <Route path="/site/:slug/api" element={<ApiPage />} />
        <Route path="/site/:slug/forum/:section" element={<ForumSectionPage />} />
        <Route path="/site/:slug/forum/:section/:postId" element={<ForumSectionPage />} />
        <Route path="/site/:slug/chart/:chartType" element={<ChartSectionPage />} />
        <Route path="/site/:slug/chart/:chartType/:marketName" element={<MarketChartPage />} />
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
