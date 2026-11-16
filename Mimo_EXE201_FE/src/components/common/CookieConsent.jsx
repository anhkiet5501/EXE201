import React, { useState } from 'react';
import { getAnalyticsConsent, isAnalyticsConfigured, setAnalyticsConsent } from '../../utils/analytics';

/**
 * Banner xin đồng ý cookie thống kê (Google Analytics).
 * Chỉ hiện khi đã cấu hình GA và người dùng chưa chọn. Chưa đồng ý thì không nạp bất kỳ script nào của Google.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(() => isAnalyticsConfigured() && getAnalyticsConsent() === null);

  if (!visible) return null;

  const choose = (granted) => {
    setAnalyticsConsent(granted);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Thông báo cookie"
      style={{
        position: 'fixed',
        left: '16px',
        right: '16px',
        bottom: '16px',
        zIndex: 100000,
        maxWidth: '720px',
        margin: '0 auto',
        background: '#0F172A',
        color: '#F8FAFC',
        borderRadius: '18px',
        padding: '16px 18px',
        boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexWrap: 'wrap',
        fontFamily: 'var(--font-family)',
      }}
    >
      <div style={{ flex: '1 1 320px', fontSize: '13.5px', lineHeight: 1.5 }}>
        🍪 MIMO dùng cookie thống kê ẩn danh (Google Analytics) để hiểu cách mọi người dùng ứng dụng và cải thiện bài học.
        Chúng tôi <strong>không</strong> gửi tên, email hay số điện thoại của bạn cho Google.
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => choose(false)}
          style={{
            padding: '10px 16px',
            borderRadius: '999px',
            border: '1px solid #475569',
            background: 'transparent',
            color: '#E2E8F0',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Từ chối
        </button>
        <button
          onClick={() => choose(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '999px',
            border: 'none',
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Đồng ý
        </button>
      </div>
    </div>
  );
}
