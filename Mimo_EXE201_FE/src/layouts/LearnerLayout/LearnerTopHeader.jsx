import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../../utils/audioEffects';
import MimoPlusUpgradeModal from '../../components/modals/MimoPlusUpgradeModal';

export default function LearnerTopHeader({
  stats = {
    hearts: 4,
    maxHearts: 5,
    streak: 7,
    xp: 1250,
    streakFreezes: 1,
    todayXp: 30,
    dailyGoalXp: 50,
  },
  domains = [],
  activeDomain = 'first_aid',
  onSelectDomain = () => {},
}) {
  const navigate = useNavigate();
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showXpModal, setShowXpModal] = useState(false);
  const [showPlusModal, setShowPlusModal] = useState(false);

  const rawUser = localStorage.getItem('mimo_user');
  const isPlusUser = rawUser?.includes('PLUS') || false;

  const currentDomainObj = domains.find((d) => d.id === activeDomain) || {
    name: 'Sơ cấp cứu ban đầu',
    icon: '🚑',
  };

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const streakStatus = [true, true, true, true, true, true, false];

  return (
    <>
      <header
        style={{
          height: '68px',
          background: 'var(--bg-card)',
          borderBottom: '2px solid var(--border-subtle)',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}
      >
        {/* BÊN TRÁI: HIỂN THỊ CHỦ ĐỀ ĐANG HỌC TINH TẾ (KHÔNG CÒN DROPDOWN THÔ) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{currentDomainObj.icon}</span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
            {currentDomainObj.name}
          </span>
        </div>

        {/* BÊN PHẢI: BẢNG TÀI NGUYÊN (STREAK, XP, TIM, THÔNG BÁO) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* 1. STREAK WIDGET */}
          <div
            onClick={() => {
              sound.playClick();
              setShowStreakModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: '#FFF7ED',
              border: '1.5px solid #FFEDD5',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '14px',
              color: '#EA580C',
              transition: 'transform 0.1s',
            }}
            title="Chuỗi ngày học liên tục"
          >
            <span style={{ fontSize: '18px' }}>🔥</span>
            <span>{stats.streak}</span>
          </div>

          {/* 2. XP COUNTER */}
          <div
            onClick={() => {
              sound.playClick();
              setShowXpModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: '#FEFCE8',
              border: '1.5px solid #FEF08A',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '14px',
              color: '#B45309',
            }}
            title="Điểm kinh nghiệm tích lũy"
          >
            <span style={{ fontSize: '18px' }}>⭐</span>
            <span>{stats.xp?.toLocaleString()} XP</span>
          </div>

          {/* 3. HEARTS COUNTER */}
          <div
            onClick={() => {
              sound.playClick();
              setShowHeartModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: isPlusUser ? '#FAF5FF' : '#FEF2F2',
              border: isPlusUser ? '1.5px solid #F3E8FF' : '1.5px solid #FECACA',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '14px',
              color: isPlusUser ? '#7C3AED' : '#DC2626',
            }}
            title={isPlusUser ? 'Đặc quyền Vô Hạn Tim (MIMO PLUS)' : 'Mạng sống còn lại'}
          >
            <span style={{ fontSize: '18px' }}>❤️</span>
            <span>{isPlusUser ? '∞ Vô Hạn' : `${stats.hearts}/${stats.maxHearts}`}</span>
          </div>

          {/* HUY HIỆU MIMO PLUS */}
          {/* HUY HIỆU MIMO PLUS */}
          {!isPlusUser ? (
            <button
              onClick={() => {
                sound.playClick();
                navigate('/learn/upgrade');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '13px',
                color: '#FFFFFF',
                boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)',
              }}
            >
              <span>👑</span>
              <span>MIMO PLUS</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                navigate('/learn/upgrade');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                fontWeight: 800,
                fontSize: '12px',
                color: '#B45309',
                cursor: 'pointer',
              }}
              title="Xem thông tin gói hội viên của bạn"
            >
              <span>👑</span>
              <span>PLUS MEMBER</span>
            </button>
          )}

          {/* 4. CHUÔNG THÔNG BÁO */}
          <button
            onClick={() => {
              sound.playClick();
              alert('Thông báo: Nam vừa vượt qua bạn trên BXH Vàng! Hãy học ngay 1 bài để đòi lại vị trí!');
            }}
            style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              position: 'relative',
            }}
            title="Thông báo"
          >
            🔔
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#EF4444',
                border: '2px solid #FFFFFF',
              }}
            />
          </button>
        </div>
      </header>

      {/* POPUP CHI TIẾT STREAK */}
      {showStreakModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowStreakModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '380px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>🔥</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#EA580C', margin: '0 0 6px 0' }}>
              Chuỗi {stats.streak} ngày liên tục!
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 20px 0' }}>
              Bạn đang tạo dựng thói quen an toàn tuyệt vời! Học thêm 1 bài mỗi ngày để không làm tắt ngọn lửa!
            </p>

            {/* Lịch tuần */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              {daysOfWeek.map((day, idx) => (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>{day}</div>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: streakStatus[idx] ? '#F97316' : '#E2E8F0',
                      color: streakStatus[idx] ? '#FFFFFF' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                    }}
                  >
                    {streakStatus[idx] ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            {/* Bùa đóng băng */}
            <div
              style={{
                background: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                <span style={{ fontSize: '26px' }}>🛡️</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E40AF' }}>
                    Bùa Đóng Băng: {stats.streakFreezes}/2
                  </div>
                  <div style={{ fontSize: '12px', color: '#3B82F6' }}>
                    Tự động cứu chuỗi nếu bận 1 ngày
                  </div>
                </div>
              </div>
              <button
                className="btn-3d btn-3d-blue btn-3d-sm"
                onClick={() => alert('Đã mua thêm 1 Bùa Đóng Băng! Trừ 200 XP.')}
              >
                + MUA
              </button>
            </div>

            <button
              className="btn-3d btn-3d-orange"
              style={{ width: '100%' }}
              onClick={() => setShowStreakModal(false)}
            >
              TIẾP TỤC HỌC
            </button>
          </div>
        </div>
      )}

      {/* MODAL HỒI PHỤC TIM (HEART RECOVERY) */}
      {showHeartModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowHeartModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '420px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>❤️</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', margin: '0 0 6px 0' }}>
              Mạng sống: {stats.hearts}/{stats.maxHearts} Tim
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 20px 0' }}>
              Mỗi quyết định sai sẽ trừ 1 tim. Hồi 1 tim tiếp theo sau: <strong>03:25:10</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {/* Lựa chọn 1: Luyện tập miễn phí */}
              <button
                onClick={() => {
                  setShowHeartModal(false);
                  navigate('/learn/practice');
                }}
                className="btn-3d btn-3d-green"
                style={{ width: '100%', textTransform: 'none', justifyContent: 'flex-start', padding: '14px 18px' }}
              >
                <span style={{ fontSize: '24px' }}>🎯</span>
                <div style={{ textAlign: 'left', flex: 1, marginLeft: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>Luyện tập để hồi tim (Miễn phí)</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>Làm đúng 3 câu sai cũ ➔ +1 Tim</div>
                </div>
              </button>

              {/* Lựa chọn 2: Mua bằng XP */}
              <button
                onClick={() => {
                  alert('Đã hồi đầy 5 Tim! Trừ 150 XP.');
                  setShowHeartModal(false);
                }}
                className="btn-3d btn-3d-yellow"
                style={{ width: '100%', textTransform: 'none', justifyContent: 'flex-start', padding: '14px 18px' }}
              >
                <span style={{ fontSize: '24px' }}>⭐</span>
                <div style={{ textAlign: 'left', flex: 1, marginLeft: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>Hồi đầy 5 tim ngay (150 XP)</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>Sẵn sàng tiếp tục bài học</div>
                </div>
              </button>

              {/* Lựa chọn 3: Mimo Plus */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowHeartModal(false);
                  setShowPlusModal(true);
                }}
                className="btn-3d"
                style={{ width: '100%', textTransform: 'none', justifyContent: 'flex-start', padding: '14px 18px', background: 'linear-gradient(135deg, #7C3AED, #9333EA)', color: '#FFFFFF', border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center' }}
              >
                <span style={{ fontSize: '24px' }}>👑</span>
                <div style={{ textAlign: 'left', flex: 1, marginLeft: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>MIMO PLUS — Vô hạn tim</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>Dùng thử 14 ngày miễn phí</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowHeartModal(false)}
              style={{
                width: '100%',
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
              onMouseEnter={(e) => e.currentTarget.style.background = '#E2E8F0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#F1F5F9'}
            >
              ĐÓNG
            </button>
          </div>
        </div>
      )}

      {/* POPUP CHI TIẾT XP */}
      {showXpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowXpModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '380px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>⭐</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#B45309', margin: '0 0 6px 0' }}>
              Tổng {stats.xp?.toLocaleString()} XP
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 20px 0' }}>
              Mục tiêu hôm nay: <strong>{stats.todayXp} / {stats.dailyGoalXp} XP</strong>
            </p>

            <div className="mimo-progress-bar" style={{ height: '20px', marginBottom: '24px' }}>
              <div
                className="mimo-progress-fill"
                style={{ width: `${(stats.todayXp / stats.dailyGoalXp) * 100}%` }}
              />
            </div>

            <button
              className="btn-3d btn-3d-green"
              style={{ width: '100%' }}
              onClick={() => setShowXpModal(false)}
            >
              ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}
      {/* MODAL NÂNG CẤP MIMO PLUS */}
      <MimoPlusUpgradeModal
        isOpen={showPlusModal}
        onClose={() => setShowPlusModal(false)}
        onUpgradeSuccess={() => window.location.reload()}
      />
    </>
  );
}
