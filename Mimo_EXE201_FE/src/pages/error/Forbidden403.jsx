import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getRedirectPathByRole } from '../../utils/roleRedirect';

export default function Forbidden403() {
  const { user } = useAuth();
  const homePath = user ? getRedirectPathByRole(user.role) : '/';

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#f8fafc' }}>
      <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#ef4444', margin: 0 }}>403</h1>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0' }}>Không có quyền truy cập</h2>
      <p style={{ color: '#94a3b8', maxWidth: '460px', marginBottom: '24px' }}>
        Tài khoản của bạn (Role: <strong>{user?.role || 'Khách'}</strong>) không được phép truy cập vào phân hệ này.
      </p>
      <Link
        to={homePath}
        style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
      >
        Quay về phân hệ của bạn →
      </Link>
    </div>
  );
}
