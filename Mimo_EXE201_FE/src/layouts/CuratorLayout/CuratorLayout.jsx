import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * CuratorLayout: Khung làm việc của Tác giả sáng tạo nội dung (Studio)
 */
export default function CuratorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    color: isActive ? '#a855f7' : '#94a3b8',
    background: isActive ? '#2e1065' : 'transparent',
    border: isActive ? '1px solid #a855f7' : '1px solid transparent',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#110c1d', color: '#f8fafc' }}>
      <aside style={{ width: '250px', borderRight: '1px solid #2e1065', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ padding: '0 10px 20px', fontSize: '20px', fontWeight: 'bold', color: '#c084fc' }}>
          🎨 MIMO STUDIO
        </div>

        <NavLink to="/studio" end style={navItemStyle}>📊 Bàn làm việc</NavLink>
        <NavLink to="/studio/courses" style={navItemStyle}>📚 Khóa học của tôi</NavLink>
        <NavLink to="/studio/editor" style={navItemStyle}>✍️ Trình soạn bài</NavLink>
        <NavLink to="/studio/assets" style={navItemStyle}>🖼️ Thư viện Media</NavLink>

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #2e1065' }}>
          <div style={{ fontSize: '13px', color: '#c084fc', marginBottom: '8px' }}>
            {user?.name || 'Tác giả'} (Curator)
          </div>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px' }}>
        <Outlet />
      </main>
    </div>
  );
}
