import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { businessService } from '../../services/modules/businessService';
import { useAuth } from '../../contexts/AuthContext';
import { sound } from '../../utils/audioEffects';
import './BusinessLayout.css';

export default function BusinessLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [org, setOrg] = useState(null);

  useEffect(() => {
    businessService.getOverview().then((res) => {
      if (res?.data) {
        setOrg(res.data);
      }
    });
  }, []);

  const handleLogout = () => {
    sound.playClick();
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `biz-nav-item ${isActive ? 'active' : ''}`;

  return (
    <div className="biz-layout">
      {/* SIDEBAR TỔ CHỨC / TRƯỜNG HỌC */}
      <aside className="biz-sidebar">
        <div className="biz-sidebar-header">
          <div className="biz-brand">
            <div className="biz-brand-logo">🏢</div>
            <div className="biz-brand-title">
              <span>MIMO B2B</span>
              <span className="biz-brand-sub">School & Enterprise</span>
            </div>
          </div>

          <div className="biz-org-card">
            <div className="biz-org-name" title={org?.name || 'THPT FPT Cần Thơ'}>
              {org?.name || 'THPT FPT Cần Thơ'}
            </div>
            <div className="biz-org-badge">
              <span>🏫</span>
              <span>{org?.plan?.usedSeats || 412}/{org?.plan?.totalSeats || 500} Suất</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="biz-nav">
          <NavLink to="/business" end className={navClass} onClick={() => sound.playClick()}>
            <span className="biz-nav-icon">📊</span>
            <span>Tổng Quan</span>
          </NavLink>

          <NavLink to="/business/classes" className={navClass} onClick={() => sound.playClick()}>
            <span className="biz-nav-icon">🏫</span>
            <span>Khối & Lớp Học</span>
          </NavLink>

          <NavLink to="/business/teachers" className={navClass} onClick={() => sound.playClick()}>
            <span className="biz-nav-icon">🔑</span>
            <span>Mã Bản Quyền GV</span>
          </NavLink>

          <NavLink to="/business/campaigns" className={navClass} onClick={() => sound.playClick()}>
            <span className="biz-nav-icon">🎯</span>
            <span>Chiến Dịch Đào Tạo</span>
          </NavLink>

          <NavLink to="/business/skill-gap" className={navClass} onClick={() => sound.playClick()}>
            <span className="biz-nav-icon">⚠️</span>
            <span>Lỗ Hổng Kỹ Năng</span>
          </NavLink>

          <NavLink to="/business/reports" className={navClass} onClick={() => sound.playClick()}>
            <span className="biz-nav-icon">📜</span>
            <span>Báo Cáo Kiểm Định</span>
          </NavLink>

          <NavLink to="/business/billing" className={navClass} onClick={() => sound.playClick()}>
            <span className="biz-nav-icon">💳</span>
            <span>Gói Cước & Suất</span>
          </NavLink>
        </nav>

        {/* FOOTER SWITCH & USER */}
        <div className="biz-footer">
          <button
            type="button"
            className="biz-switch-btn"
            onClick={() => {
              sound.playClick();
              navigate('/learn');
            }}
          >
            <span>🧑‍🎓</span>
            <span>Bàn học cá nhân (/learn)</span>
          </button>

          <button
            type="button"
            className="biz-switch-btn"
            style={{ background: '#1E3A5F', borderColor: '#2563EB', color: '#93C5FD' }}
            onClick={() => {
              sound.playClick();
              navigate('/learn/classroom');
            }}
          >
            <span>👨‍🏫</span>
            <span>Lớp học Giáo viên (/classroom)</span>
          </button>

          <div className="biz-user-profile">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=PrincipalDat'}
              alt="Avatar"
              className="biz-user-avatar"
            />
            <div className="biz-user-meta">
              <div className="biz-user-name">{user?.name || 'Hiệu Trưởng (BGH)'}</div>
              <div className="biz-user-role">Quản Trị Tổ Chức</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Đăng xuất"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#EF4444',
                cursor: 'pointer',
                fontSize: '15px',
                padding: '4px',
              }}
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* KHÔNG GIAN LÀM VIỆC CHÍNH */}
      <main className="biz-main">
        <Outlet />
      </main>
    </div>
  );
}
