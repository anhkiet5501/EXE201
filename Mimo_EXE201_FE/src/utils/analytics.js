/**
 * Google Analytics 4 cho MIMO.
 *
 * Nguyên tắc:
 *  - Chỉ chạy ở bản build thật (hoặc khi đặt VITE_GA_MEASUREMENT_ID): chạy local không làm lẫn số liệu.
 *  - Chỉ nạp script của Google SAU KHI người dùng bấm "Đồng ý" cookie (có học sinh nhỏ tuổi).
 *  - Chỉ gửi mã người dùng nội bộ (GUID) và vai trò/gói. KHÔNG gửi email, tên, số điện thoại (Google cấm PII).
 *  - Mọi hàm đều an toàn khi chưa bật: không làm gì, không báo lỗi.
 */

const CONSENT_KEY = 'mimo_analytics_consent'; // 'granted' | 'denied'

// Mã đo lường là thông tin công khai (nằm trong mã nguồn trang web), không phải bí mật.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || (import.meta.env.PROD ? 'G-SBM49KZN59' : '');

let loaded = false;

const readStorage = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Trình duyệt chặn lưu trữ: bỏ qua
  }
};

export const isAnalyticsConfigured = () => Boolean(GA_ID);

/** 'granted' | 'denied' | null (chưa chọn) */
export const getAnalyticsConsent = () => {
  const value = readStorage(CONSENT_KEY);
  return value === 'granted' || value === 'denied' ? value : null;
};

const isActive = () =>
  Boolean(GA_ID) &&
  loaded &&
  getAnalyticsConsent() === 'granted' &&
  window[`ga-disable-${GA_ID}`] !== true;

function loadGoogleTag() {
  if (loaded || !GA_ID || typeof window === 'undefined') return;
  loaded = true;

  window[`ga-disable-${GA_ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
  };
  window.gtag('js', new Date());
  // Tự gửi page_view thủ công theo từng route (ứng dụng một trang)
  window.gtag('config', GA_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

export function trackEvent(name, params = {}) {
  if (!isActive()) return;
  window.gtag('event', name, params);
}

export function trackPageView(path) {
  trackEvent('page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`, // chỉ đường dẫn, không kèm query (tránh lộ mã giao dịch...)
    page_title: document.title,
  });
}

/** Gắn người dùng đã đăng nhập: chỉ GUID nội bộ + vai trò + gói. */
export function identifyUser(user) {
  if (!isActive() || !user?.id) return;
  window.gtag('set', { user_id: String(user.id) });
  window.gtag('set', 'user_properties', {
    role: String(user.role || '').toLowerCase() || 'unknown',
    plan: user.isPro ? 'pro' : 'free',
  });
}

export function clearUser() {
  if (!isActive()) return;
  window.gtag('set', { user_id: null });
}

/** Gọi khi mở ứng dụng: nếu người dùng đã đồng ý từ trước thì bật GA. */
export function initAnalytics() {
  if (getAnalyticsConsent() === 'granted') {
    loadGoogleTag();
  }
}

/** Lưu lựa chọn cookie. Đồng ý: bật GA và gửi ngay lượt xem trang hiện tại + gắn người dùng (nếu đang đăng nhập). */
export function setAnalyticsConsent(granted) {
  writeStorage(CONSENT_KEY, granted ? 'granted' : 'denied');

  if (!GA_ID || typeof window === 'undefined') return;

  if (granted) {
    loadGoogleTag();
    window[`ga-disable-${GA_ID}`] = false;
    trackPageView(window.location.pathname);
    try {
      identifyUser(JSON.parse(readStorage('mimo_user') || 'null'));
    } catch {
      // dữ liệu người dùng hỏng: bỏ qua
    }
  } else {
    // Tắt thu thập ngay lập tức nếu trước đó đã bật
    window[`ga-disable-${GA_ID}`] = true;
  }
}
