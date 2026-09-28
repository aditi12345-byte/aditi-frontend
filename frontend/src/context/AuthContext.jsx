import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('teen_track_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('teen_track_token') || null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('teen_track_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.data) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('teen_track_token', newToken);
      localStorage.setItem('teen_track_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      showToast(`Welcome back, ${newUser.name}!`, 'success');
      return newUser;
    }
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res.data) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('teen_track_token', newToken);
      localStorage.setItem('teen_track_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      showToast(`Welcome to TeenTrack, ${newUser.name}!`, 'success');
      return newUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('teen_track_token');
    localStorage.removeItem('teen_track_user');
    setToken(null);
    setUser(null);
    showToast('Logged out safely.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, showToast, toasts }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
