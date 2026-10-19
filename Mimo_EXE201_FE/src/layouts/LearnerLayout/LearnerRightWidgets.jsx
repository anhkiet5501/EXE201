import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../../utils/audioEffects';

export default function LearnerRightWidgets({
  leaderboard = {
    leagueName: 'GIẢI ĐẤU VÀNG',
    timeLeft: '2 ngày 14 giờ',
    nearbyUsers: [
      { rank: 3, name: 'Hoàng Anh', xp: 1320, avatar: '🧑🏻' },
      { rank: 4, name: 'Bạn (Nam)', xp: 1250, avatar: '🤖', isMe: true },
      { rank: 5, name: 'Minh Trang', xp: 1180, avatar: '👧🏼' },
    ],
    message: 'Chỉ cần thêm 70 XP nữa để lọt vào Top 3 nhận cúp!',
  },
  dailyQuests = [],
  weeklyTip = {
    title: 'Mẹo tuần này: Sạc xe điện an toàn',
    content: 'Khi sạc xe máy điện/xe đạp điện, tuyệt đối không cắm sạc qua đêm ở khu vực kín không có người trông coi. Luôn kiểm tra bình cứu hỏa mini trước cửa phòng!',
  },
  onClaimQuest = () => {},
}) {
  const navigate = useNavigate();
  const [claimedQuests, setClaimedQuests] = useState({});

  const handleClaim = (questId) => {
    sound.playVictory();
    setClaimedQuests((prev) => ({ ...prev, [questId]: true }));
    onClaimQuest(questId);
    alert('Chúc mừng! Bạn đã nhận thưởng nhiệm vụ thành công!');
  };

  return (
    <aside
      style={{
        width: '340px',
        minWidth: '340px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* WIDGET 1: THẺ NÂNG CẤP MIMO PRO (SUPER MIMO BANNER) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
          borderRadius: '20px',
          padding: '22px 20px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(124, 58, 237, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', opacity: 0.85 }}>
              ĐẶC QUYỀN CAO CẤP
            </div>
            <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '2px', letterSpacing: '-0.5px' }}>
              MIMO PRO ✨
            </div>
          </div>
          <div style={{ fontSize: '38px', lineHeight: 1 }}>👑</div>
        </div>

        <p style={{ fontSize: '13px', margin: '12px 0 16px 0', opacity: 0.95, lineHeight: 1.4 }}>
          Mở khóa <strong>Vô hạn tim ❤️</strong>, luyện tập không giới hạn và nhận chứng chỉ kỹ năng an toàn!
        </p>

        <button
          onClick={() => {
            sound.playClick();
            alert('Chào mừng bạn đến với chương trình trải nghiệm MIMO PRO miễn phí 7 ngày!');
          }}
          style={{
            width: '100%',
            background: '#FFFFFF',
            color: '#4F46E5',
            border: 'none',
            borderRadius: '999px',
            padding: '13px 20px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.16)',
            letterSpacing: '0.6px',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.16)';
          }}
        >
          <span>DÙNG THỬ 7 NGÀY MIỄN PHÍ</span>
          <span>➔</span>
        </button>
      </div>

      {/* WIDGET 2: THU NHỎ BẢNG XẾP HẠNG TUẦN (LEADERBOARD PREVIEW) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #E2E8F0',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🏆</span>
              <span>{leaderboard.leagueName}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Còn {leaderboard.timeLeft}
            </div>
          </div>
        </div>

        {/* Danh sách 3 người */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {leaderboard.nearbyUsers?.map((u) => (
            <div
              key={u.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '12px',
                background: u.isMe ? '#FEF9C3' : '#F8FAFC',
                border: u.isMe ? '1.5px solid #FDE047' : '1.5px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#64748B', width: '20px' }}>
                  #{u.rank}
                </span>
                <span style={{ fontSize: '18px' }}>{u.avatar}</span>
                <span style={{ fontSize: '14px', fontWeight: u.isMe ? 800 : 600, color: '#0F172A' }}>
                  {u.name}
                </span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#B45309' }}>
                {u.xp?.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600, marginBottom: '12px' }}>
          🎯 {leaderboard.message}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            navigate('/learn/leaderboard');
          }}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#0EA5E9',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'center',
            padding: '6px',
          }}
        >
          XEM TOÀN BỘ BẢNG ĐẤU ➔
        </button>
      </div>

      {/* WIDGET 3: NHIỆM VỤ HÀNG NGÀY (DAILY QUESTS TRACKER) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #E2E8F0',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span>
            <span>NHIỆM VỤ HÔM NAY</span>
          </div>
          <button
            onClick={() => navigate('/learn/quests')}
            style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Tất cả
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {dailyQuests.map((q) => {
            const isCompleted = q.current >= q.target;
            const isClaimed = claimedQuests[q.id] || q.claimed;

            return (
              <div key={q.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{q.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{q.title}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#B45309' }}>{q.reward}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="mimo-progress-bar" style={{ height: '10px' }}>
                    <div
                      className="mimo-progress-fill"
                      style={{
                        width: `${Math.min(100, (q.current / q.target) * 100)}%`,
                        background: isCompleted ? '#22C55E' : '#3B82F6',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>
                    {q.current}/{q.target}
                  </span>
                </div>

                {isCompleted && !isClaimed && (
                  <button
                    onClick={() => handleClaim(q.id)}
                    className="btn-3d btn-3d-yellow btn-3d-sm"
                    style={{ width: '100%', marginTop: '8px', fontSize: '12px', padding: '6px 12px' }}
                  >
                    🎁 NHẬN THƯỞNG
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* WIDGET 4: CẨM NANG MẸO AN TOÀN TUẦN (WEEKLY SAFETY TIP) */}
      <div
        style={{
          background: '#F0F9FF',
          borderRadius: '20px',
          border: '2px solid #BAE6FD',
          padding: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284C7', fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>
          <span>💡</span>
          <span>{weeklyTip.title}</span>
        </div>
        <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
          {weeklyTip.content}
        </p>
      </div>
    </aside>
  );
}
