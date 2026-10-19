import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { mockSuccess, mockError } from '../mocks/mockHelper';
import { mockAccounts } from '../mocks/mockAuth';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const authService = {
  /**
   * Đăng nhập: Trả về { token, user }
   */
  async login(email, password) {
    if (USE_MOCK) {
      const found = mockAccounts.find(
        (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );
      if (found) {
        return mockSuccess({
          token: `mock-token-${found.role.toLowerCase()}-${Date.now()}`,
          user: {
            id: found.id,
            name: found.name,
            email: found.email,
            role: found.role,
            avatar: found.avatar,
          },
        });
      }
      return mockError('Email hoặc mật khẩu không đúng! (Gợi ý test: learner@mimo.com / pass: 123)', 401);
    }

    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  },

  /**
   * Đăng ký
   */
  async register(formData) {
    if (USE_MOCK) {
      return mockSuccess({
        message: 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.',
      });
    }
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, formData);
  },

  /**
   * Quên mật khẩu
   */
  async forgotPassword(email) {
    if (USE_MOCK) {
      return mockSuccess({
        message: 'Mã xác nhận OTP đã được gửi đến email của bạn.',
      });
    }
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem('mimo_token');
    localStorage.removeItem('mimo_user');
  },

  /**
   * Lấy user hiện tại từ localStorage
   */
  getCurrentUser() {
    try {
      const raw = localStorage.getItem('mimo_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
