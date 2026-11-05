import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { mockSuccess, mockError } from '../mocks/mockHelper';
import { mockAccounts } from '../mocks/mockAuth';

import { USE_MOCK } from '../api/mockConfig';

export const authService = {
  /**
   * Đăng nhập: Trả về { token, user }
   */
  async login(email, password) {
    if (USE_MOCK) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      // 1. Kiểm tra danh sách mockAccounts mặc định
      let found = mockAccounts.find(
        (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPassword
      );

      // 2. Nếu không thấy, kiểm tra danh sách tài khoản người dùng tự đăng ký trong localStorage
      if (!found) {
        try {
          const registered = JSON.parse(localStorage.getItem('mimo_registered_users') || '[]');
          found = registered.find(
            (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPassword
          );
        } catch {
          // Bỏ qua nếu parse JSON lỗi
        }
      }

      if (found) {
        return mockSuccess({
          token: `mock-token-${found.role.toLowerCase()}-${Date.now()}`,
          user: {
            id: found.id,
            name: found.name,
            email: found.email,
            role: found.role,
            avatar: found.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=User',
          },
        });
      }
      return mockError('Email hoặc mật khẩu không đúng! (Gợi ý tài khoản mẫu: learner@mimo.com, educator@mimo.com, curator@mimo.com, admin@mimo.com / Mật khẩu: 123)', 401);
    }

    try {
      const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      if (res?.data && res.data.accessToken && !res.data.token) {
        res.data.token = res.data.accessToken;
      }

      if (res?.data?.user) {
        const u = res.data.user;
        const roleMap = {
          1: 'ADMIN',
          2: 'STUDENT',
          3: 'CURATOR',
          4: 'ORGANIZATION',
          5: 'EDUCATOR',
        };
        // Chuẩn hóa role sang chuỗi in hoa: ưu tiên roleName ('Admin' -> 'ADMIN') hoặc map từ enum số
        u.role = (u.roleName ? u.roleName : (roleMap[u.role] || u.role || 'STUDENT')).toString().toUpperCase();
        u.name = u.fullName || u.name || (u.email ? u.email.split('@')[0] : 'User');
      }

      // Tự động gọi /auth/me bằng token vừa nhận để làm giàu đối tượng user (isPro, planCode, planName, hearts)
      if (res?.data?.token) {
        try {
          const meRes = await apiClient.get(API_ENDPOINTS.AUTH.ME, {
            headers: { Authorization: `Bearer ${res.data.token}` },
          });
          const meData = meRes?.data?.data || meRes?.data;
          if (meData && res.data.user) {
            const isPro = meData.isPro ?? meData.stats?.isPro ?? false;
            const cleanPlan = String(meData.planCode || meData.plan || (isPro ? 'PREMIUM_6M' : 'FREE'))
              .toUpperCase()
              .replace('MIMO_', '');
            res.data.user = {
              ...res.data.user,
              ...meData,
              role: res.data.user.role, // Giữ role đã chuẩn hóa
              isPro,
              isPlus: isPro,
              plan: cleanPlan,
              planCode: cleanPlan,
              planName: meData.planName || (isPro ? 'Gói 6 Tháng (Half-Year)' : 'Mimo Free'),
              hearts: meData.hearts ?? 5,
            };
          }
        } catch (meErr) {
          console.warn('Không thể nạp thông tin chi tiết /auth/me khi login:', meErr?.message);
        }
      }

      return res;
    } catch (apiErr) {
      // Không còn fallback sang tài khoản mẫu: lỗi từ Backend (sai mật khẩu, mất mạng...) được báo đúng như thật.
      // Chế độ mock chỉ chạy khi VITE_USE_MOCK=true (xử lý ở đầu hàm).
      console.warn('Backend login error:', apiErr?.message);
      throw apiErr;
    }
  },

  /**
   * Đăng ký
   */
  async register(formData) {
    if (USE_MOCK) {
      try {
        const registered = JSON.parse(localStorage.getItem('mimo_registered_users') || '[]');
        const newUser = {
          id: `user_custom_${Date.now()}`,
          email: formData.email.trim(),
          password: formData.password.trim(),
          name: formData.fullName || formData.name || formData.email.split('@')[0],
          role: formData.role || 'LEARNER',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name || 'User')}`,
        };
        registered.push(newUser);
        localStorage.setItem('mimo_registered_users', JSON.stringify(registered));
      } catch (e) {
        console.error('Lỗi lưu tài khoản đăng ký:', e);
      }

      return mockSuccess({
        message: 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.',
      });
    }

    const payload = {
      fullName: (formData.fullName || formData.name || '').trim(),
      email: (formData.email || '').trim().toLowerCase(),
      password: formData.password || '',
      phoneNumber: formData.phoneNumber || formData.phone || null,
    };

    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  /**
   * Đăng ký Trường học / Doanh nghiệp B2B
   */
  async registerOrganization(formData) {
    if (USE_MOCK) {
      return mockSuccess({
        message: 'Đăng ký tổ chức trường học thành công! Vui lòng đăng nhập để tiếp tục.',
      });
    }

    const payload = {
      organizationName: (formData.organizationName || formData.orgName || '').trim(),
      representativeName: (formData.representativeName || formData.fullName || formData.name || '').trim(),
      email: (formData.email || '').trim().toLowerCase(),
      password: formData.password || '',
      phoneNumber: formData.phoneNumber || formData.phone || null,
      address: formData.address || null,
    };

    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER_ORGANIZATION, payload);
  },

  /**
   * Đăng ký Tác giả / Biên tập viên / Chuyên gia kịch bản (Curator)
   */
  async registerCurator(formData) {
    if (USE_MOCK) {
      return mockSuccess({
        message: 'Đăng ký tài khoản tác giả / biên tập viên thành công! Vui lòng đăng nhập để tiếp tục.',
      });
    }

    const payload = {
      fullName: (formData.fullName || formData.name || '').trim(),
      email: (formData.email || '').trim().toLowerCase(),
      password: formData.password || '',
      phoneNumber: formData.phoneNumber || formData.phone || null,
      specialization: formData.specialization || null,
    };

    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER_CURATOR, payload);
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
