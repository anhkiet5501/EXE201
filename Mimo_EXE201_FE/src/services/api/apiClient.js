import axios from 'axios';

/**
 * Axios Client kết nối với Backend thật.
 * Tự động gắn token, timeout và xử lý lỗi tập trung.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: gắn JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mimo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwrap response data và bắt lỗi 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const token = localStorage.getItem('mimo_token');
    const isMock = token && token.startsWith('mock-token-');
    if (error.response?.status === 401 && !isMock && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('mimo_token');
      localStorage.removeItem('mimo_user');
      window.location.href = '/login';
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = 'Máy chủ đang phản hồi chậm hoặc đang khởi động lại (Cold Start). Vui lòng thử lại sau vài giây!';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
