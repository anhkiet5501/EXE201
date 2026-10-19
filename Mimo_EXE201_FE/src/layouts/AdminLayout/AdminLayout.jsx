import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { sound } from '../../utils/audioEffects';
import { mockAdminData } from '../../services/mocks/mockAdmin';

/**
 * AdminLayout: Khung điều hành trung tâm dành cho Quản Trị Viên Tối Cao (Super Admin / Operations)
 * Phong cách Modern Clean SaaS Dashboard — Sạch sẽ, tương phản cao, chuẩn mực điều hành doanh nghiệp
 */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const metrics = mockAdminData.getMetrics();
  const pendingCount = metrics?.pendingApprovals || 4;
  const ticketCount = metrics?.unresolvedTickets || 5;

  const handleLogout = () => {
    sound.playClick();
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin', label: 'Tổng Quan & Số Liệu', icon: '📊', end: true },
    { to: '/admin/approvals', label: 'Phê Duyệt Nội Dung', icon: '✅', badge: pendingCount > 0 ? pendingCount : null, badgeColor: '#EF4444' },
    { to: '/admin/gamification', label: 'Cân Bằng Game Hóa', icon: '🎮' },
    { to: '/admin/users', label: 'Người Dùng & CSKH', icon: '👥' },
    { to: '/admin/schools', label: 'Trường Học & B2B', icon: '🏫' },
    { to: '/admin/feedback', label: 'Báo Lỗi & Góp Ý', icon: '💬', badge: ticketCount > 0 ? ticketCount : null, badgeColor: '#F59E0B' },
    { to: '/admin/monetization', label: 'Doanh Thu & Gói Cước', icon: '💰' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'inherit' }}>
      {/* 1. SIDEBAR ĐIỀU HÀNH (260px) */}
      <aside style={{
        width: '260px',
        background: '#FFFFFF',
        borderRight: '1.5px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxShadow: '2px 0 12px rgba(0,0,0,0.02)',
        zIndex: 20,
      }}>
        {/* LOGO & BRAND HEADER */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)',
            }}>
              ⚙️
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>mimo</span>
                <span style={{ fontSize: '10px', background: '#0F172A', color: '#FFFFFF', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>ADMIN</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Command & Operations Hub</div>
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', padding: '6px 12px', letterSpacing: '0.05em' }}>
            Phân hệ Quản trị
          </div>

          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => sound.playClick()}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: isActive ? 800 : 600,
                fontSize: '13.5px',
                color: isActive ? '#0284C7' : '#475569',
                background: isActive ? '#F0F9FF' : 'transparent',
                border: isActive ? '1px solid #BAE6FD' : '1px solid transparent',
                transition: 'all 0.15s ease',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  background: item.badgeColor,
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: '999px',
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* CHUYỂN NHANH QUA CÁC GÓC NHÌN ĐỂ TEST DEMO */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', padding: '6px 12px', letterSpacing: '0.05em' }}>
              Xem trước các góc nhìn
            </div>
            <button
              type="button"
              onClick={() => navigate('/learn')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '6px',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
            >
              <span>🧑‍🎓</span>
              <span>Vào app Học viên (/learn)</span>
            </button>
          </div>
        </nav>

        {/* ADMIN USER FOOTER PROFILE */}
        <div style={{ padding: '16px 14px', borderTop: '1.5px solid #F1F5F9', background: '#FAFAFA' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px',
            }}>
              👑
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {user?.name || 'Super Admin'}
              </div>
              <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                <span>Toàn quyền Vận hành</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#FEE2E2',
              color: '#DC2626',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FECACA'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
          >
            <span>🚪</span>
            <span>Đăng xuất Quản trị</span>
          </button>
        </div>
      </aside>

      {/* 2. KHÔNG GIAN LÀM VIỆC CHÍNH (MAIN WORKSPACE) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* TOP HEADER COMMAND BAR */}
        <header style={{
          height: '68px',
          background: '#FFFFFF',
          borderBottom: '1.5px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          {/* TÌM KIẾM TOÀN CỤC */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '480px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '8px 14px',
              width: '100%',
            }}>
              <span style={{ color: '#64748B', fontSize: '14px' }}>🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm người dùng, kịch bản, mã trường, ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  width: '100%',
                  color: '#0F172A',
                }}
              />
            </div>
          </div>

          {/* ACTIONS & NOTIFICATIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* THÔNG BÁO HỆ THỐNG */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowNotifications(!showNotifications);
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  position: 'relative',
                }}
              >
                <span>🔔</span>
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                }}>
                  3
                </span>
              </button>

              {/* POPUP THÔNG BÁO NHANH */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '320px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1.5px solid #E2E8F0',
                  padding: '16px',
                  zIndex: 99,
                }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '10px' }}>🔔 Thông Báo Vận Hành Mới</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                    <div style={{ padding: '8px', background: '#FEF2F2', borderRadius: '8px', borderLeft: '3px solid #EF4444' }}>
                      <strong style={{ color: '#DC2626' }}>Cảnh báo Skill Gap:</strong> 69% học sinh đang làm sai câu sơ cứu bỏng nước sôi!
                    </div>
                    <div style={{ padding: '8px', background: '#F0F9FF', borderRadius: '8px', borderLeft: '3px solid #0284C7' }}>
                      <strong style={{ color: '#0284C7' }}>Bài học mới:</strong> BS. Hoàng Nam vừa gửi kịch bản CPR chờ duyệt.
                    </div>
                    <div style={{ padding: '8px', background: '#FEF3C7', borderRadius: '8px', borderLeft: '3px solid #D97706' }}>
                      <strong style={{ color: '#D97706' }}>Hợp đồng B2B:</strong> THCS Nguyễn Du sắp hết hạn sau 14 ngày.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE SYSTEM STATUS PILL */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#DCFCE7',
              color: '#15803D',
              border: '1px solid #86EFAC',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }}></span>
              <span>Hệ thống Hoạt động 100%</span>
            </div>
          </div>
        </header>

        {/* NỘI DUNG TỪNG TRANG */}
        <main style={{ flex: 1, padding: '32px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
