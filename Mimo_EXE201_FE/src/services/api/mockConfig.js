/**
 * Nguồn duy nhất quyết định có dùng dữ liệu giả (mock) hay không.
 * Chỉ bật khi đặt rõ VITE_USE_MOCK=true. Mặc định TẮT: lỗi từ Backend sẽ được báo thật
 * thay vì bị che bằng dữ liệu mẫu.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/** Lấy thông điệp lỗi dễ đọc từ lỗi Axios (hỗ trợ RFC 7807 của Backend). */
export const getApiErrorMessage = (err, fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.') => {
  const data = err?.response?.data;
  return data?.detail || data?.message || data?.title || err?.message || fallback;
};

/** true nếu lỗi do mất mạng / timeout / máy chủ lỗi (đáng thử lại), không phải lỗi nghiệp vụ. */
export const isConnectionError = (err) => {
  if (!err?.response) return true;
  return err.response.status >= 500;
};
