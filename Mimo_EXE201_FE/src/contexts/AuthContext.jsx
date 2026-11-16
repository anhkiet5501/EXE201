import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { authService } from '../services/modules/authService';
import apiClient from '../services/api/apiClient';
import { API_ENDPOINTS } from '../services/api/endpoints';
import { trackEvent, identifyUser, clearUser } from '../utils/analytics';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mimo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      // Dữ liệu localStorage bị hỏng -> coi như chưa đăng nhập thay vì làm sập cả app
      localStorage.removeItem('mimo_user');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mimo_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Đồng bộ trạng thái Pro/hồ sơ từ Backend (nguồn sự thật duy nhất). Trả về dữ liệu /auth/me hoặc null.
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('mimo_token');
    if (!currentToken || currentToken.startsWith('mock-token-')) return null;

    try {
      const res = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      const meData = res?.data?.data || res?.data;
      if (!meData) return null;

      setUser((prev) => {
        const isPro = meData.isPro ?? meData.stats?.isPro ?? prev?.isPro ?? false;
        const cleanPlan = String(meData.planCode || meData.plan || prev?.planCode || (isPro ? 'PREMIUM_6M' : 'FREE'))
          .toUpperCase()
          .replace('MIMO_', '');
        const updated = {
          ...prev,
          ...meData,
          role: prev?.role || 'STUDENT',
          isPro,
          isPlus: isPro,
          plan: cleanPlan,
          planCode: cleanPlan,
          planName: meData.planName || prev?.planName || (isPro ? 'Gói 6 Tháng (Half-Year)' : 'Mimo Free'),
        };
        localStorage.setItem('mimo_user', JSON.stringify(updated));
        return updated;
      });
      return meData;
    } catch (err) {
      console.warn('Lưu ý đồng bộ me data trong AuthContext:', err?.message);
      return null;
    }
  }, []);

  // Tự động đồng bộ khi app khởi chạy hoặc khi có token mới
  useEffect(() => {
    if (!token) return;
    refreshUser();
  }, [token, refreshUser]);

  // Cập nhật thuộc tính người dùng cho GA khi đổi tài khoản / vai trò / gói (Free <-> Pro)
  useEffect(() => {
    if (user?.id) identifyUser(user);
  }, [user?.id, user?.role, user?.isPro]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (userData, userToken, method = 'email') => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('mimo_user', JSON.stringify(userData));
    localStorage.setItem('mimo_token', userToken);

    identifyUser(userData);
    trackEvent('login', { method, role: String(userData?.role || '').toLowerCase() });
  };

  const logout = () => {
    trackEvent('logout', { role: String(user?.role || '').toLowerCase(), reason: 'manual' });
    clearUser();
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        role: user?.role || null,
        login,
        logout,
        refreshUser,
        loading,
        setLoading,
      }}
    >
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
