import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound404() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#f8fafc' }}>
      <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#38bdf8', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0' }}>Trang không tồn tại</h2>
      <p style={{ color: '#94a3b8', maxWidth: '460px', marginBottom: '24px' }}>
        Đường dẫn bạn truy cập không tồn tại hoặc đã được chuyển sang địa chỉ mới.
      </p>
      <Link
        to="/"
        style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
      >
        Về trang chủ MIMO →
      </Link>
    </div>
  );
}
