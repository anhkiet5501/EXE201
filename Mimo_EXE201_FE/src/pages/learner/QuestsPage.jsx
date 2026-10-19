import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function QuestsPage() {
  const { data, refreshData } = useOutletContext();
  const [claimed, setClaimed] = useState({});

  const dailyQuests = data?.dailyQuests || [
    { id: 'q1', title: 'Hoàn thành 2 bài học mới', current: 1, target: 2, reward: '+10 XP', icon: '🎯' },
    { id: 'q2', title: 'Đạt 40 XP hôm nay', current: 30, target: 40, reward: '+1 Bùa Đóng Băng 🛡️', icon: '⚡' },
    { id: 'q3', title: 'Đạt 1 bài học Hoàn hảo (Không mất tim)', current: 1, target: 1, reward: '+15 XP', icon: '✨', completed: true },
  ];

  const handleClaimReward = (qId) => {
    sound.playVictory();
    fireConfetti();
    setClaimed((prev) => ({ ...prev, [qId]: true }));
    alert('🎉 Chúc mừng bạn đã nhận thưởng thành công!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px' }}>⚡</span>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            Nhiệm vụ rèn luyện hàng ngày
          </h1>
        </div>
        <p style={{ color: '#64748B', fontSize: '14.5px', margin: '6px 0 0 0' }}>
          Mỗi nhiệm vụ hoàn thành là một thói quen an toàn được củng cố. Làm mới mỗi ngày vào lúc 00:00!
        </p>
      </div>

      {/* Danh sách nhiệm vụ ngày */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dailyQuests.map((q) => {
          const isDone = q.current >= q.target;
          const isClaimed = claimed[q.id] || q.claimed;

          return (
            <div
              key={q.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '2px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '500px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: isDone ? '#DCFCE7' : '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0,
                  }}
                >
                  {q.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {q.title}
                    </h3>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#B45309' }}>
                      {q.reward}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="mimo-progress-bar" style={{ height: '12px' }}>
                      <div
                        className="mimo-progress-fill"
                        style={{
                          width: `${Math.min(100, (q.current / q.target) * 100)}%`,
                          background: isDone ? '#22C55E' : '#3B82F6',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                      {q.current}/{q.target}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginLeft: '24px' }}>
                {isDone && !isClaimed ? (
                  <button
                    onClick={() => handleClaimReward(q.id)}
                    className="btn-3d btn-3d-yellow btn-3d-sm"
                  >
                    🎁 NHẬN THƯỞNG
                  </button>
                ) : isClaimed ? (
                  <span
                    style={{
                      background: '#F1F5F9',
                      color: '#64748B',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '8px 14px',
                      borderRadius: '10px',
                    }}
                  >
                    ✓ ĐÃ NHẬN
                  </span>
                ) : (
                  <span
                    style={{
                      background: '#F8FAFC',
                      color: '#94A3B8',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '8px 14px',
                      borderRadius: '10px',
                    }}
                  >
                    ĐANG HỌC
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
