import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../../utils/audioEffects';
import { useProStatus } from '../../hooks/useProStatus';
import ProBadge from './ProBadge';

/** Thẻ trạng thái thành viên Pro: gói đang dùng, số ngày còn lại và các quyền lợi đang hoạt động. */
export default function ProStatusCard() {
  const navigate = useNavigate();
  const { isPro, planName, daysLeft, expiresAt, streakFreezes } = useProStatus();
  if (!isPro) return null;

  const perks = [
    { icon: '❤️', text: 'Vô hạn tim: học liên tục, trả lời sai không bị trừ tim', to: '/learn' },
    { icon: '🎯', text: 'Ôn tập chuyên sâu mọi câu từng làm sai, kèm giải thích', to: '/learn/practice' },
    { icon: '📊', text: 'Báo cáo rủi ro an toàn 30 ngày (ngay bên dưới)', to: null },
    { icon: '🛡️', text: `Bùa bảo vệ chuỗi Streak: còn ${streakFreezes} bùa`, to: '/learn/shop' },
    { icon: '👑', text: 'Vương miện Pro hiển thị trên hồ sơ và bảng xếp hạng', to: null },
  ];

  const urgent = daysLeft !== null && daysLeft <= 7;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 55%, #B45309 130%)',
        borderRadius: '24px',
        padding: '24px 26px',
        color: '#FFFFFF',
        boxShadow: '0 14px 30px rgba(76, 29, 149, 0.28)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <ProBadge label="MIMO PRO" />
          <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '8px' }}>{planName}</div>
          <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
            {expiresAt ? `Hiệu lực đến ${expiresAt.toLocaleDateString('vi-VN')}` : 'Không giới hạn thời gian'}
          </div>
        </div>
        {daysLeft !== null && (
          <div
            style={{
              textAlign: 'center',
              background: urgent ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.14)',
              borderRadius: '16px',
              padding: '10px 18px',
              minWidth: '92px',
            }}
          >
            <div style={{ fontSize: '30px', fontWeight: 900, lineHeight: 1 }}>{daysLeft}</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, opacity: 0.9 }}>ngày còn lại</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        {perks.map((p) => (
          <div
            key={p.text}
            onClick={() => {
              if (p.to) {
                sound.playClick();
                navigate(p.to);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13.5px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '9px 12px',
              cursor: p.to ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontSize: '18px' }}>{p.icon}</span>
            <span style={{ flex: 1 }}>{p.text}</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#86EFAC' }}>✓ ĐANG BẬT</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          sound.playClick();
          navigate('/learn/upgrade');
        }}
        style={{
          marginTop: '16px',
          padding: '11px 20px',
          borderRadius: '999px',
          border: 'none',
          background: urgent ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(255,255,255,0.18)',
          color: '#FFFFFF',
          fontWeight: 900,
          fontSize: '13.5px',
          cursor: 'pointer',
        }}
      >
        {urgent ? '⏰ Sắp hết hạn: Gia hạn ngay' : 'Gia hạn / đổi gói'}
      </button>
    </div>
  );
}
