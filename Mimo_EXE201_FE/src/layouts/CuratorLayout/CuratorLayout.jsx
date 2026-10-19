import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * CuratorLayout: Không gian làm việc của Chuyên gia Biên soạn & Thẩm định nội dung
 * Phong cách Dark Studio chuẩn Y khoa & Cứu nạn
 */
export default function CuratorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `curator-nav-item ${isActive ? 'active' : ''}`;

  return (
    <div className="curator-layout-root">
      <style>{`
        .curator-layout-root {
          display: flex;
          min-height: 100vh;
          background: #0d091a;
          color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ─── SIDEBAR ─── */
        .curator-sidebar {
          width: 260px;
          background: #140e26;
          border-right: 1px solid #2d1b4e;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 40;
          flex-shrink: 0;
        }

        .curator-brand {
          padding: 24px 20px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #23153d;
        }

        .curator-brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #9333ea, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 14px rgba(147, 51, 234, 0.4);
        }

        .curator-brand-title {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.3px;
          background: linear-gradient(135deg, #f5f3ff, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .curator-brand-subtitle {
          font-size: 11px;
          color: #a78bfa;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .curator-nav-list {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          overflow-y: auto;
        }

        .curator-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 13.5px;
          color: #94a3b8;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .curator-nav-item:hover {
          color: #e2e8f0;
          background: #1f143a;
          border-color: #3b2064;
        }

        .curator-nav-item.active {
          color: #ffffff;
          background: linear-gradient(90deg, rgba(147, 51, 234, 0.25), rgba(99, 102, 241, 0.15));
          border-color: #9333ea;
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.25);
        }

        .curator-nav-item .nav-icon {
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
        }

        .curator-badge-pill {
          margin-left: auto;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 20px;
          font-weight: 700;
        }
        .badge-live { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        .badge-new { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

        .curator-sidebar-footer {
          padding: 16px;
          border-top: 1px solid #23153d;
          background: #100b20;
        }

        .curator-doc-box {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.1));
          border: 1px solid rgba(147, 51, 234, 0.3);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .curator-doc-box-icon {
          font-size: 24px;
        }

        .curator-doc-box-text {
          font-size: 11.5px;
          color: #cbd5e1;
          line-height: 1.4;
        }

        .curator-doc-box-text strong {
          color: #c084fc;
          display: block;
        }

        /* ─── MAIN CONTENT AREA ─── */
        .curator-main-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ─── TOPBAR ─── */
        .curator-topbar {
          height: 68px;
          background: #130d24;
          border-bottom: 1px solid #251640;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .curator-topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .curator-role-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(147, 51, 234, 0.15);
          border: 1px solid #7c3aed;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          color: #e9d5ff;
          font-weight: 700;
        }

        .curator-search-box {
          position: relative;
          width: 320px;
        }

        .curator-search-box input {
          width: 100%;
          background: #1d1336;
          border: 1px solid #361f5c;
          border-radius: 10px;
          padding: 8px 12px 8px 36px;
          color: #f1f5f9;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }

        .curator-search-box input:focus {
          border-color: #9333ea;
          box-shadow: 0 0 10px rgba(147, 51, 234, 0.3);
        }

        .curator-search-box .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 14px;
        }

        .curator-topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .curator-btn-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1f1438;
          border: 1px solid #4a287c;
          color: #e2e8f0;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .curator-btn-preview:hover {
          background: #2b184f;
          border-color: #7c3aed;
          color: #ffffff;
        }

        .curator-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #1d1336;
          border: 1px solid #361f5c;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .curator-icon-btn:hover {
          border-color: #9333ea;
          color: #ffffff;
        }

        .curator-icon-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 10px;
          border: 2px solid #130d24;
        }

        .curator-user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px 4px 6px;
          background: #1d1336;
          border: 1px solid #361f5c;
          border-radius: 30px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .curator-user-chip:hover {
          border-color: #7c3aed;
        }

        .curator-user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #a855f7;
        }

        .curator-user-name {
          font-size: 12.5px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .curator-user-org {
          font-size: 10px;
          color: #c084fc;
        }

        .curator-content-body {
          flex: 1;
          padding: 28px 32px;
          max-width: 1440px;
          width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
        }
      `}</style>

      {/* ─── SIDEBAR TRÁI ─── */}
      <aside className="curator-sidebar">
        <div className="curator-brand">
          <div className="curator-brand-icon">🎨</div>
          <div>
            <div className="curator-brand-title">MIMO STUDIO</div>
            <div className="curator-brand-subtitle">Curator Content Portal</div>
          </div>
        </div>

        <nav className="curator-nav-list">
          <NavLink to="/studio" end className={navItemClass}>
            <span className="nav-icon">📚</span>
            <span>Kịch bản của tôi</span>
            <span className="curator-badge-pill badge-live">18 Live</span>
          </NavLink>

          <NavLink to="/studio/builder" className={navItemClass}>
            <span className="nav-icon">✍️</span>
            <span>Soạn kịch bản & Test</span>
            <span className="curator-badge-pill badge-new">Simulator</span>
          </NavLink>

          <NavLink to="/studio/assets" className={navItemClass}>
            <span className="nav-icon">🗄️</span>
            <span>Thư viện Media</span>
          </NavLink>

          <NavLink to="/studio/analytics" className={navItemClass}>
            <span className="nav-icon">📈</span>
            <span>Phân tích hiệu quả</span>
          </NavLink>

          <NavLink to="/studio/feedback" className={navItemClass}>
            <span className="nav-icon">💬</span>
            <span>Góp ý y tế & Review</span>
            <span className="curator-badge-pill badge-new">3 mới</span>
          </NavLink>

          <NavLink to="/studio/guidelines" className={navItemClass}>
            <span className="nav-icon">📜</span>
            <span>Chuẩn biên soạn</span>
          </NavLink>
        </nav>

        <div className="curator-sidebar-footer">
          <div className="curator-doc-box">
            <span className="curator-doc-box-icon">🩺</span>
            <div className="curator-doc-box-text">
              <strong>Chuẩn Y Khoa 100%</strong>
              Thẩm định bởi Hội Chữ Thập Đỏ & Cục Cảnh sát PCCC
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              to="/learn"
              style={{
                flex: 1,
                padding: '8px 10px',
                background: '#1f1438',
                border: '1px solid #3d1f6d',
                borderRadius: '8px',
                color: '#c084fc',
                fontSize: '11px',
                fontWeight: '700',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              🧑‍🎓 App Học Viên
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
              title="Đăng xuất"
            >
              🚪 Thoát
            </button>
          </div>
        </div>
      </aside>

      {/* ─── KHUNG NỘI DUNG CHÍNH ─── */}
      <div className="curator-main-wrap">
        {/* Topbar điều hướng & Chuyên gia Profile */}
        <header className="curator-topbar">
          <div className="curator-topbar-left">
            <div className="curator-role-pill">
              <span>🩺</span>
              <span>Chuyên gia Y tế & Sơ cứu</span>
            </div>
            <div className="curator-search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Tìm kịch bản, mã bài học, tình huống..." />
            </div>
          </div>

          <div className="curator-topbar-right">
            <Link to="/learn" className="curator-btn-preview" target="_blank" rel="noopener noreferrer">
              <span>📱</span>
              <span>Chế độ Học viên</span>
            </Link>

            {/* Chuông thông báo */}
            <button
              className="curator-icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Thông báo mới"
            >
              <span>🔔</span>
              <span className="curator-icon-badge">3</span>
            </button>

            {/* Chuyên gia Profile Chip */}
            <div
              className="curator-user-chip"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
                alt="BS. Trần Hoàng Nam"
                className="curator-user-avatar"
              />
              <div>
                <div className="curator-user-name">BS. Trần Hoàng Nam</div>
                <div className="curator-user-org">Viện Bỏng Quốc Gia</div>
              </div>
            </div>
          </div>
        </header>

        {/* Thân trang các Module */}
        <main className="curator-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
