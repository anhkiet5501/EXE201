import axios from 'axios';

/**
 * Axios Client kết nối với Backend thật.
 * Tự động gắn token, timeout và xử lý lỗi tập trung.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
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
    if (error.response?.status === 401) {
      localStorage.removeItem('mimo_token');
      localStorage.removeItem('mimo_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
