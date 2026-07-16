import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/user';
const AuthContext = createContext(null);

export function AuthProvider({ children, slug }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('forumToken'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const r = await axios.get(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(r.data);
    } catch { localStorage.removeItem('forumToken'); setToken(null); setUser(null); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email, password) => {
    const r = await axios.post(`${API}/login`, { email, password, slug });
    localStorage.setItem('forumToken', r.data.token);
    setToken(r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };

  const register = async (name, email, password) => {
    const r = await axios.post(`${API}/register`, { name, email, password, slug });
    localStorage.setItem('forumToken', r.data.token);
    setToken(r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };

  const logout = () => {
    localStorage.removeItem('forumToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
