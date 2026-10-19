import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { sound } from '../../utils/audioEffects';
import MimoPlusUpgradeModal from '../../components/modals/MimoPlusUpgradeModal';

export default function LearnerSidebar({
  activeDomain = 'first_aid',
  onSelectDomain = () => {},
  domains = [],
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPlusModal, setShowPlusModal] = useState(false);
  // Trạng thái mở rộng menu con của Học tập và Cài đặt (mặc định đóng)
  const [isLearningExpanded, setIsLearningExpanded] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  // Tùy chọn học tập từ Duolingo & Mimo
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Xử lý chuyển đổi Dark / Light mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isMapActive = location.pathname === '/learn';

  const defaultDomains = [
    { id: 'first_aid', name: 'Sơ cấp cứu ban đầu', icon: '🚑', progress: 60 },
    { id: 'fire_safety', name: 'Thoát hiểm & PCCC', icon: '🔥', progress: 30 },
    { id: 'road_safety', name: 'An toàn giao thông', icon: '🚦', progress: 0 },
    { id: 'cyber_safety', name: 'Chống scam & An toàn số', icon: '🛡️', progress: 10 },
    { id: 'personal_safety', name: 'Phòng chống bạo lực & Xâm hại', icon: '🤝', progress: 0 },
  ];

  const domainList = domains.length > 0 ? domains : defaultDomains;

  return (
    <aside
      style={{
        width: '270px',
        minWidth: '270px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: isDarkMode ? '#0F172A' : '#FFFFFF',
        borderRight: `2px solid ${isDarkMode ? '#1E293B' : '#E2E8F0'}`,
        padding: '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        zIndex: 50,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* 1. KHỐI THƯƠNG HIỆU (LOGO & LINH VẬT THỰC TẾ CỦA MIMO) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 6px 18px',
          borderBottom: `1.5px solid ${isDarkMode ? '#1E293B' : '#F1F5F9'}`,
          marginBottom: '14px',
        }}
      >
        <div
          onClick={() => {
            sound.playClick();
            navigate('/learn');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          {/* LINH VẬT THỰC TẾ TÁCH NỀN CỦA DỰ ÁN */}
          <img
            src="/images/mascot.png"
            alt="Mimo Mascot"
            className="anim-float"
            style={{
              width: '42px',
              height: '42px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
            }}
          />
          <div>
            <div
              style={{
                fontSize: '25px',
                fontWeight: 900,
                color: '#22C55E',
                letterSpacing: '-0.5px',
                lineHeight: 1,
                fontFamily: 'var(--font-family)',
              }}
            >
              mimo
            </div>
            <div style={{ fontSize: '11px', color: isDarkMode ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
              Kỹ năng & An toàn
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            background: isDarkMode ? '#064E3B' : '#DCFCE7',
            color: isDarkMode ? '#6EE7B7' : '#15803D',
            padding: '3px 8px',
            borderRadius: '999px',
          }}
        >
          v2.0
        </span>
      </div>

      {/* 2. MENU ĐIỀU HƯỚNG */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        {/* ================================================================= */}
        {/* MỤC 1: HỌC TẬP (CÓ 5 CHỦ ĐỀ CON BÊN DƯỚI CHO PHÉP CHỌN TÙY THÍCH) */}
        {/* ================================================================= */}
        <div>
          <div
            onClick={() => {
              sound.playClick();
              setIsLearningExpanded(!isLearningExpanded);
              navigate('/learn');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderRadius: '14px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '14.5px',
              color: isMapActive ? '#15803D' : isDarkMode ? '#E2E8F0' : '#475569',
              background: isMapActive ? (isDarkMode ? '#064E3B' : '#DCFCE7') : 'transparent',
              border: isMapActive ? '2px solid #86EFAC' : '2px solid transparent',
              borderBottom: isMapActive ? '4px solid #4ADE80' : '2px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '19px' }}>🏠</span>
              <span>Học tập</span>
            </div>
            <span
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#94A3B8' : '#64748B',
                transform: isLearningExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              ▼
            </span>
          </div>

          {/* DANH SÁCH 5 MỤC CHỦ ĐỀ CON NGAY DƯỚI HỌC TẬP */}
          {isLearningExpanded && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                paddingLeft: '12px',
                marginTop: '6px',
                marginBottom: '8px',
                borderLeft: `2px dashed ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                marginLeft: '18px',
              }}
            >
              {domainList.map((dom) => {
                const isSelected = dom.id === activeDomain;

                return (
                  <div
                    key={dom.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectDomain(dom.id);
                      navigate('/learn');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? (isDarkMode ? '#86EFAC' : '#15803D') : isDarkMode ? '#94A3B8' : '#475569',
                      background: isSelected ? (isDarkMode ? '#064E3B' : '#F0FDF4') : 'transparent',
                      border: isSelected ? '1.5px solid #86EFAC' : '1.5px solid transparent',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{dom.icon}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                        {dom.name}
                      </span>
                    </div>

                    {isSelected ? (
                      <span style={{ color: '#22C55E', fontWeight: 900, fontSize: '13px' }}>✓</span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                        {dom.progress}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TAB 2: BẢNG XẾP HẠNG */}
        <NavLink
          to="/learn/leaderboard"
          onClick={() => sound.playClick()}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '14px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14.5px',
            color: isActive ? '#15803D' : isDarkMode ? '#E2E8F0' : '#475569',
            background: isActive ? (isDarkMode ? '#064E3B' : '#DCFCE7') : 'transparent',
            border: isActive ? '2px solid #86EFAC' : '2px solid transparent',
            borderBottom: isActive ? '4px solid #4ADE80' : '2px solid transparent',
          })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '19px' }}>🏆</span>
            <span>Bảng xếp hạng</span>
          </div>
          <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>
            🥇 Vàng
          </span>
        </NavLink>

        {/* TAB 3: NHIỆM VỤ NGÀY */}
        <NavLink
          to="/learn/quests"
          onClick={() => sound.playClick()}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '14px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14.5px',
            color: isActive ? '#15803D' : isDarkMode ? '#E2E8F0' : '#475569',
            background: isActive ? (isDarkMode ? '#064E3B' : '#DCFCE7') : 'transparent',
            border: isActive ? '2px solid #86EFAC' : '2px solid transparent',
            borderBottom: isActive ? '4px solid #4ADE80' : '2px solid transparent',
          })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '19px' }}>⚡</span>
            <span>Nhiệm vụ ngày</span>
          </div>
          <span style={{ background: '#F97316', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '999px' }}>
            1
          </span>
        </NavLink>

        {/* TAB 4: KHO THÀNH TÍCH */}
        <NavLink
          to="/learn/achievements"
          onClick={() => sound.playClick()}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '14px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14.5px',
            color: isActive ? '#15803D' : isDarkMode ? '#E2E8F0' : '#475569',
            background: isActive ? (isDarkMode ? '#064E3B' : '#DCFCE7') : 'transparent',
            border: isActive ? '2px solid #86EFAC' : '2px solid transparent',
            borderBottom: isActive ? '4px solid #4ADE80' : '2px solid transparent',
          })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '19px' }}>🏅</span>
            <span>Kho thành tích</span>
          </div>
          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>4/8</span>
        </NavLink>

        {/* TAB 5: CẨM NANG HỌC TẬP */}
        <NavLink
          to="/learn/handbook"
          onClick={() => sound.playClick()}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '11px 14px',
            borderRadius: '14px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14.5px',
            color: isActive ? '#15803D' : isDarkMode ? '#E2E8F0' : '#475569',
            background: isActive ? (isDarkMode ? '#064E3B' : '#DCFCE7') : 'transparent',
            border: isActive ? '2px solid #86EFAC' : '2px solid transparent',
            borderBottom: isActive ? '4px solid #4ADE80' : '2px solid transparent',
          })}
        >
          <span style={{ fontSize: '19px' }}>📚</span>
          <span>Cẩm nang học tập</span>
        </NavLink>

        {/* TAB 6: LỚP HỌC CỦA TÔI */}
        <NavLink
          to="/learn/classroom"
          onClick={() => sound.playClick()}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '14px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14.5px',
            color: isActive ? '#15803D' : isDarkMode ? '#E2E8F0' : '#475569',
            background: isActive ? (isDarkMode ? '#064E3B' : '#DCFCE7') : 'transparent',
            border: isActive ? '2px solid #86EFAC' : '2px solid transparent',
            borderBottom: isActive ? '4px solid #4ADE80' : '2px solid transparent',
          })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '19px' }}>🏫</span>
            <span>Lớp học của tôi</span>
          </div>
          <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '10px', fontWeight: 800, padding: '2px 5px', borderRadius: '4px' }}>
            B2B
          </span>
        </NavLink>

        {/* TAB 7: HỒ SƠ */}
        <NavLink
          to="/learn/profile"
          onClick={() => sound.playClick()}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '11px 14px',
            borderRadius: '14px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14.5px',
            color: isActive ? '#15803D' : isDarkMode ? '#E2E8F0' : '#475569',
            background: isActive ? (isDarkMode ? '#064E3B' : '#DCFCE7') : 'transparent',
            border: isActive ? '2px solid #86EFAC' : '2px solid transparent',
            borderBottom: isActive ? '4px solid #4ADE80' : '2px solid transparent',
          })}
        >
          <span style={{ fontSize: '19px' }}>👤</span>
          <span>Hồ sơ cá nhân</span>
        </NavLink>

        {/* TAB 8: NÂNG CẤP GÓI (CHÍNH XÁC THEO FIGMA 18.NÂNG CẤP GÓI) */}
        <NavLink
          to="/learn/upgrade"
          onClick={() => sound.playClick()}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '14px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '14.5px',
            color: isActive ? '#0284C7' : isDarkMode ? '#E2E8F0' : '#475569',
            background: isActive ? (isDarkMode ? '#082F49' : '#E0F2FE') : 'transparent',
            border: isActive ? '2px solid #7DD3FC' : '2px solid transparent',
            borderBottom: isActive ? '4px solid #38BDF8' : '2px solid transparent',
            transition: 'all 0.15s ease',
          })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '19px' }}>⭐</span>
            <span>Nâng cấp</span>
          </div>
          <span
            style={{
              background: 'linear-gradient(135deg, #0284C7, #2563EB)',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 900,
              padding: '2px 7px',
              borderRadius: '6px',
              letterSpacing: '0.5px',
            }}
          >
            PRO
          </span>
        </NavLink>

        {/* ================================================================= */}
        {/* TAB 8: CÀI ĐẶT & KHÁC (ACCORDION SUB-ITEMS GIỐNG HỌC TẬP) */}
        {/* ================================================================= */}
        <div style={{ marginTop: '2px' }}>
          <div
            onClick={() => {
              sound.playClick();
              setIsSettingsExpanded(!isSettingsExpanded);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderRadius: '14px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14.5px',
              color: isSettingsExpanded ? '#2563EB' : isDarkMode ? '#E2E8F0' : '#475569',
              background: isSettingsExpanded ? (isDarkMode ? '#1E293B' : '#EFF6FF') : 'transparent',
              border: isSettingsExpanded ? '2px solid #BFDBFE' : '2px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '19px' }}>⚙️</span>
              <span>Cài đặt & Khác</span>
            </div>
            <span
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#94A3B8' : '#64748B',
                transform: isSettingsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              ▼
            </span>
          </div>

          {/* DANH SÁCH CÁC TÙY CHỌN CON HỌC TẬP TỪ DUOLINGO & MIMO */}
          {isSettingsExpanded && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                paddingLeft: '12px',
                marginTop: '6px',
                marginBottom: '8px',
                borderLeft: `2px dashed ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                marginLeft: '18px',
              }}
            >
              {/* 1. ÂM THANH HIỆU ỨNG (SOUND FX) */}
              <div
                onClick={() => {
                  sound.playClick();
                  setSoundEnabled(!soundEnabled);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isDarkMode ? '#E2E8F0' : '#475569',
                  background: isDarkMode ? '#1E293B' : '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔊</span>
                  <span>Âm thanh</span>
                </div>
                <span style={{ fontWeight: 800, color: soundEnabled ? '#22C55E' : '#94A3B8', fontSize: '12px' }}>
                  {soundEnabled ? 'BẬT' : 'TẮT'}
                </span>
              </div>

              {/* 2. RUNG PHẢN HỒI (HAPTICS) */}
              <div
                onClick={() => {
                  sound.playClick();
                  setHapticEnabled(!hapticEnabled);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isDarkMode ? '#E2E8F0' : '#475569',
                  background: isDarkMode ? '#1E293B' : '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📳</span>
                  <span>Rung phản hồi</span>
                </div>
                <span style={{ fontWeight: 800, color: hapticEnabled ? '#22C55E' : '#94A3B8', fontSize: '12px' }}>
                  {hapticEnabled ? 'BẬT' : 'TẮT'}
                </span>
              </div>

              {/* 3. GIAO DIỆN TỐI (DARK MODE - HỌC TỪ GETMIMO) */}
              <div
                onClick={() => {
                  sound.playClick();
                  setIsDarkMode(!isDarkMode);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isDarkMode ? '#E2E8F0' : '#475569',
                  background: isDarkMode ? '#1E293B' : '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🌙</span>
                  <span>Chế độ tối</span>
                </div>
                <span style={{ fontWeight: 800, color: isDarkMode ? '#38BDF8' : '#94A3B8', fontSize: '12px' }}>
                  {isDarkMode ? 'BẬT' : 'TẮT'}
                </span>
              </div>

              {/* 4. PHÍM TẮT HỌC NHANH (KEYBOARD SHORTCUTS - HỌC TỪ DUOLINGO) */}
              <div
                onClick={() => {
                  sound.playClick();
                  setShowShortcutsModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isDarkMode ? '#E2E8F0' : '#475569',
                  background: isDarkMode ? '#1E293B' : '#F8FAFC',
                }}
              >
                <span>⌨️</span>
                <span>Phím tắt học tập</span>
              </div>

              {/* 5. BÁO LỖI KỊCH BẢN (FEEDBACK) */}
              <div
                onClick={() => {
                  sound.playClick();
                  setShowFeedbackModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isDarkMode ? '#E2E8F0' : '#475569',
                  background: isDarkMode ? '#1E293B' : '#F8FAFC',
                }}
              >
                <span>🚩</span>
                <span>Báo lỗi tình huống</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 3. THÔNG TIN USER DƯỚI ĐÁY */}
      <div
        style={{
          paddingTop: '14px',
          borderTop: `1.5px solid ${isDarkMode ? '#1E293B' : '#F1F5F9'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: isDarkMode ? '#1E293B' : '#EFF6FF',
              border: '2px solid #38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            🧑🏻
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: isDarkMode ? '#F8FAFC' : '#0F172A', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Học viên'}
            </div>
            <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700 }}>
              Cấp 4 • Guardian
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Đăng xuất"
          style={{
            background: '#FEE2E2',
            border: 'none',
            color: '#DC2626',
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          🚪
        </button>
      </div>

      {/* MODAL PHÍM TẮT HỌC NHANH (DUOLINGO STYLE) */}
      {showShortcutsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
          }}
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '420px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⌨️</span>
                <span>Phím tắt học tập thần tốc</span>
              </h3>
              <button
                onClick={() => setShowShortcutsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '12px' }}>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>Chọn đáp án tình huống</span>
                <span style={{ background: '#E2E8F0', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '13px' }}>Phím 1, 2, 3, 4</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '12px' }}>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>Kiểm tra đáp án / Tiếp tục</span>
                <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '13px' }}>Phím Enter ↵</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '12px' }}>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>Thoát bài học</span>
                <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '13px' }}>Phím Esc</span>
              </div>
            </div>

            <button
              className="btn-3d btn-3d-green"
              style={{ width: '100%' }}
              onClick={() => setShowShortcutsModal(false)}
            >
              ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}

      {/* MODAL BÁO LỖI & GÓP Ý KỊCH BẢN */}
      {showFeedbackModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
          }}
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '440px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🚩</span>
                <span>Báo lỗi kịch bản & Góp ý</span>
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Nếu bạn thấy câu hỏi chưa chuẩn y khoa hoặc gặp trục trặc kỹ thuật, hãy gửi ngay cho đội ngũ chuyên gia Mimo!
            </p>

            <textarea
              rows={4}
              placeholder="Mô tả chi tiết nội dung cần góp ý hoặc báo lỗi..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: '2px solid #CBD5E1',
                fontSize: '14px',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '20px',
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowFeedbackModal(false)}
                style={{
                  flex: 1,
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#475569',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#E2E8F0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#F1F5F9')}
              >
                HỦY BỎ
              </button>
              <button
                className="btn-3d btn-3d-green"
                style={{ flex: 1 }}
                onClick={() => {
                  sound.playVictory();
                  alert('Cảm ơn bạn! Đội ngũ chuyên gia Mimo đã ghi nhận đóng góp của bạn.');
                  setShowFeedbackModal(false);
                  setFeedbackText('');
                }}
              >
                GỬI GÓP Ý
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL NÂNG CẤP MIMO PLUS */}
      <MimoPlusUpgradeModal
        isOpen={showPlusModal}
        onClose={() => setShowPlusModal(false)}
        onUpgradeSuccess={() => window.location.reload()}
      />
    </aside>
  );
}
