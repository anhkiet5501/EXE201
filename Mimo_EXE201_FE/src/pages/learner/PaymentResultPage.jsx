import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { sound, fireConfetti } from '../../utils/audioEffects';
import { paymentService } from '../../services/modules/paymentService';
import { useAuth } from '../../contexts/AuthContext';
import { getApiErrorMessage } from '../../services/api/mockConfig';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 10;

const getPlanName = (code) => {
  const clean = String(code || '').toUpperCase().replace('MIMO_', '');
  switch (clean) {
    case 'PREMIUM_1M':
      return 'Gói Mimo Pro 1 Tháng (Linh Hoạt)';
    case 'PREMIUM_3M':
      return 'Gói Mimo Pro 3 Tháng (Khuyên Dùng)';
    case 'PREMIUM_6M':
      return 'Gói Mimo Pro 6 Tháng (Tiết Kiệm Nhất)';
    default:
      return 'Gói Mimo Pro Nâng Cấp';
  }
};

const shell = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  fontFamily: 'var(--font-family)',
};

const card = {
  width: '100%',
  maxWidth: '540px',
  background: '#FFFFFF',
  borderRadius: '28px',
  padding: '40px 32px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const primaryBtn = {
  flex: 1,
  padding: '14px',
  borderRadius: '16px',
  border: 'none',
  background: 'linear-gradient(135deg, #0284C7, #0369A1)',
  color: '#FFFFFF',
  fontWeight: 800,
  fontSize: '15px',
  cursor: 'pointer',
};

const secondaryBtn = {
  flex: 1,
  padding: '14px',
  borderRadius: '16px',
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  color: '#475569',
  fontWeight: 800,
  fontSize: '15px',
  cursor: 'pointer',
};

const barColor = {
  success: 'linear-gradient(90deg, #22C55E, #16A34A, #10B981)',
  failed: 'linear-gradient(90deg, #EF4444, #DC2626)',
  waiting: 'linear-gradient(90deg, #F59E0B, #D97706)',
};

/**
 * Trang kết quả thanh toán.
 * Trạng thái giao dịch LUÔN lấy từ Backend (theo txnRef), không tin tham số trên URL.
 * status: loading | success | failed | timeout
 */
export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const txnRef =
    searchParams.get('txnRef') || searchParams.get('vnp_TxnRef') || searchParams.get('orderCode') || '';
  const hasLegacyVnpParams = [...searchParams.keys()].some((k) => k.startsWith('vnp_'));

  const [status, setStatus] = useState('loading');
  const [tx, setTx] = useState(null);
  const [message, setMessage] = useState('');
  const [recheckKey, setRecheckKey] = useState(0);
  const celebratedRef = useRef(false);

  const poll = useCallback(
    async (isCancelled) => {
      if (!txnRef) {
        setStatus('failed');
        setMessage('Không tìm thấy mã giao dịch. Nếu bạn đã chuyển tiền, vui lòng liên hệ hỗ trợ kèm thời gian giao dịch.');
        return;
      }

      // Tương thích luồng VNPay cũ: để Backend xác thực chữ ký và ghi nhận kết quả
      if (hasLegacyVnpParams && recheckKey === 0) {
        try {
          await paymentService.verifyVnPayReturn(window.location.search);
        } catch (err) {
          console.warn('Xác thực VNPay return:', getApiErrorMessage(err));
        }
      }

      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
        if (isCancelled()) return;
        try {
          const res = await paymentService.getPaymentHistory();
          const list = Array.isArray(res?.data) ? res.data : [];
          const found = list.find((t) => t.txnRef === txnRef);

          if (found) {
            if (isCancelled()) return;
            setTx(found);
            if (found.status === 'Success') {
              await refreshUser();
              if (!isCancelled()) setStatus('success');
              return;
            }
            if (found.status === 'Failed' || found.status === 'Refunded') {
              setMessage('Giao dịch chưa được hoàn tất hoặc đã bị hủy. Tài khoản của bạn chưa bị trừ phí.');
              setStatus('failed');
              return;
            }
            // Pending -> tiếp tục chờ
          }
        } catch (err) {
          console.warn('Không lấy được trạng thái giao dịch:', getApiErrorMessage(err));
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }

      if (!isCancelled()) setStatus('timeout');
    },
    [txnRef, hasLegacyVnpParams, recheckKey, refreshUser]
  );

  useEffect(() => {
    let cancelled = false;
    poll(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [poll]);

  useEffect(() => {
    if (status === 'success' && !celebratedRef.current) {
      celebratedRef.current = true;
      sound.playVictory();
      fireConfetti();
    }
  }, [status]);

  const handleRecheck = () => {
    setStatus('loading');
    setRecheckKey((k) => k + 1);
  };

  const barKey = status === 'success' ? 'success' : status === 'failed' ? 'failed' : 'waiting';

  return (
    <div style={shell}>
      <div style={card}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: barColor[barKey],
          }}
        />

        {status === 'loading' && (
          <>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>⏳</div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>
              Đang xác nhận thanh toán...
            </h1>
            <p style={{ color: '#64748B', fontSize: '14.5px', margin: 0, lineHeight: 1.5 }}>
              Vui lòng không đóng trang. Hệ thống đang chờ ngân hàng xác nhận giao dịch của bạn.
            </p>
          </>
        )}

        {status === 'timeout' && (
          <>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>🕒</div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0' }}>
              Chưa nhận được xác nhận
            </h1>
            <p style={{ color: '#64748B', fontSize: '14.5px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Giao dịch có thể cần thêm ít phút để ngân hàng xác nhận. Nếu bạn đã thanh toán, gói Pro sẽ tự động
              được kích hoạt khi hệ thống nhận được tiền.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleRecheck} style={primaryBtn}>
                🔄 Kiểm tra lại
              </button>
              <button onClick={() => navigate('/learn')} style={secondaryBtn}>
                Về Trang Học Tập
              </button>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '44px',
                margin: '0 auto 16px auto',
                boxShadow: '0 10px 25px rgba(22, 163, 74, 0.25)',
              }}
            >
              👑
            </div>

            <span
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#F0FDF4',
                color: '#16A34A',
                fontWeight: 800,
                fontSize: '12.5px',
                letterSpacing: '0.5px',
                marginBottom: '10px',
                border: '1px solid #BBF7D0',
              }}
            >
              ✓ GIAO DỊCH THÀNH CÔNG
            </span>

            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0', lineHeight: 1.25 }}>
              Chúc Mừng Thành Viên Mimo Pro!
            </h1>

            <p style={{ color: '#64748B', fontSize: '14.5px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Tài khoản của bạn đã được nâng cấp thành công. Toàn bộ đặc quyền không giới hạn đã sẵn sàng!
            </p>

            <div
              style={{
                background: '#F8FAFC',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#64748B' }}>Gói đăng ký:</span>
                <strong style={{ color: '#0F172A', fontWeight: 800 }}>{getPlanName(tx?.planCode)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#64748B' }}>Số tiền thanh toán:</span>
                <strong style={{ color: '#16A34A', fontSize: '18px', fontWeight: 900 }}>
                  {Number(tx?.amount || 0).toLocaleString('vi-VN')} đ
                </strong>
              </div>

              {tx?.paymentMethod && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748B' }}>Phương thức:</span>
                  <span style={{ color: '#0284C7', fontWeight: 700 }}>{tx.paymentMethod}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: '#94A3B8' }}>Mã tham chiếu:</span>
                <span style={{ color: '#64748B', fontFamily: 'monospace' }}>{txnRef}</span>
              </div>
            </div>

            <div
              style={{
                background: '#FEF9C3',
                borderRadius: '16px',
                padding: '14px 18px',
                marginBottom: '28px',
                textAlign: 'left',
                border: '1px solid #FDE047',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#854D0E', marginBottom: '6px' }}>
                ⚡ Đặc quyền đã được mở khóa ngay lập tức:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#713F12', lineHeight: 1.6 }}>
                <li>❤️ <strong>Vô hạn trái tim</strong>: Học liên tục, trả lời sai không bị trừ tim</li>
                <li>🛡️ <strong>Bảo vệ chuỗi Streak</strong>: Tự động hồi phục khi bỏ lỡ ngày học</li>
                <li>🤖 <strong>AI Bác sĩ & Chuyên gia</strong>: Phân tích tình huống phản xạ chuyên sâu</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/learn')}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284C7, #0369A1)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              🚀 Bắt Đầu Học Với Mimo Pro Ngay →
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '44px',
                margin: '0 auto 16px auto',
              }}
            >
              ✕
            </div>

            <span
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#FEF2F2',
                color: '#DC2626',
                fontWeight: 800,
                fontSize: '12.5px',
                marginBottom: '10px',
                border: '1px solid #FECACA',
              }}
            >
              GIAO DỊCH KHÔNG THÀNH CÔNG
            </span>

            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0' }}>
              Thanh Toán Bị Hủy Hoặc Thất Bại
            </h1>

            <p style={{ color: '#64748B', fontSize: '14.5px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              {message || 'Giao dịch chưa được hoàn tất hoặc đã bị hủy. Tài khoản của bạn chưa bị trừ phí.'}
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => navigate('/learn/upgrade')} style={primaryBtn}>
                🔄 Thử Thanh Toán Lại
              </button>
              <button onClick={() => navigate('/learn')} style={secondaryBtn}>
                Về Trang Học Tập
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
