import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockAccounts } from '../../services/mocks/mockAuth';
import { sound } from '../../utils/audioEffects';

export default function RoleSwitcher() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Không hiển thị trên trang Zen Mode (Lúc đang chơi bài tập) để không làm vướng mắt
  if (location.pathname.startsWith('/learn/lesson/')) {
    return null;
  }

  const roles = [
    {
      id: 'LEARNER',
      name: 'Người học (Learner)',
      sub: 'Bản đồ bài học, Hearts, Streak, XP',
      email: 'learner@mimo.com',
      path: '/learn',
      icon: '🧑‍🎓',
      bg: '#DCFCE7',
      color: '#15803D',
      border: '#86EFAC',
    },
    {
      id: 'EDUCATOR',
      name: 'Giáo viên trường (Educator)',
      sub: 'Quản lý lớp, chiếu QR, giao bài tuần',
      email: 'educator@mimo.com',
      path: '/business',
      icon: '👨‍🏫',
      bg: '#E0F2FE',
      color: '#0284C7',
      border: '#7DD3FC',
    },
    {
      id: 'ORGANIZATION',
      name: 'Ban Giám Hiệu (B2B Org)',
      sub: 'Quản lý hợp đồng Seats, cấp mã GV, SSI',
      email: 'bgh.fpt@mimo.com',
      path: '/business',
      icon: '🏢',
      bg: '#EFF6FF',
      color: '#1D4ED8',
      border: '#93C5FD',
    },
    {
      id: 'CURATOR',
      name: 'Chuyên gia Curator Studio',
      sub: 'Soạn kịch bản chuẩn, Mobile Simulator',
      email: 'curator@mimo.com',
      path: '/studio',
      icon: '🎨',
      bg: '#F3E8FF',
      color: '#7C3AED',
      border: '#D8B4FE',
    },
    {
      id: 'ADMIN',
      name: 'Super Admin',
      sub: 'Duyệt bài học Live, doanh thu, game balance',
      email: 'admin@mimo.com',
      path: '/admin',
      icon: '⚙️',
      bg: '#FEF3C7',
      color: '#B45309',
      border: '#FDE68A',
    },
  ];

  const handleSwitch = (roleItem) => {
    sound.playClick();
    const mockUser = mockAccounts.find((acc) => acc.email === roleItem.email);
    if (mockUser) {
      login(
        {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar,
        },
        `mock-token-${mockUser.role.toLowerCase()}-${Date.now()}`
      );
    }
    navigate(roleItem.path);
    setIsOpen(false);
  };

  const currentRoleObj = roles.find((r) => r.id === user?.role) || {
    name: user?.role || 'Khách',
    icon: '⚡',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999999,
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Menu xổ lên chọn 4 Phân hệ */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            right: 0,
            width: '320px',
            background: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0,0,0,0.06)',
            padding: '16px',
            boxSizing: 'border-box',
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '1.5px solid #F1F5F9',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡</span>
                <span>Chuyển Nhanh Phân Hệ</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                Đổi ngay lập tức mà không cần gõ URL
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: '#F1F5F9',
                border: 'none',
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#64748B',
                fontWeight: 700,
                fontSize: '12px',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {roles.map((r) => {
              const isCurrent = user?.role === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => handleSwitch(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    background: isCurrent ? r.bg : '#F8FAFC',
                    border: `1.5px solid ${isCurrent ? r.border : '#E2E8F0'}`,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = '#F8FAFC';
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: r.bg,
                      color: r.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {r.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                        {r.name}
                      </span>
                      {isCurrent && (
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: r.color, background: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>
                          Hiện tại
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nút bấm nổi ở góc màn hình */}
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#0F172A',
          color: '#FFFFFF',
          border: '2px solid #334155',
          borderRadius: '999px',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
        }}
      >
        <span style={{ fontSize: '16px' }}>{currentRoleObj.icon}</span>
        <span>Phân hệ: <strong>{currentRoleObj.name}</strong></span>
        <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '4px' }}>
          {isOpen ? '▼' : '▲'}
        </span>
      </button>
    </div>
  );
}
