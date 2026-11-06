import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../../utils/audioEffects';

/** Thẻ giới thiệu tính năng Pro cho người dùng Free: mô tả quyền lợi và dẫn tới trang nâng cấp. */
export default function ProLockedCard({ icon = '🔒', title, description, bullets = [] }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        border: '2px dashed #FCD34D',
        borderRadius: '20px',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 900, color: '#78350F' }}>{title}</div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309' }}>👑 CHỈ DÀNH CHO MIMO PRO</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: '13.5px', color: '#92400E', lineHeight: 1.5 }}>{description}</p>
      {bullets.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#92400E', lineHeight: 1.7 }}>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      <button
        onClick={() => {
          sound.playClick();
          navigate('/learn/upgrade');
        }}
        style={{
          alignSelf: 'flex-start',
          marginTop: '4px',
          padding: '11px 20px',
          borderRadius: '999px',
          border: 'none',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          color: '#FFFFFF',
          fontWeight: 900,
          fontSize: '13.5px',
          cursor: 'pointer',
          boxShadow: '0 6px 14px rgba(217, 119, 6, 0.3)',
        }}
      >
        Nâng cấp Mimo Pro →
      </button>
    </div>
  );
}
