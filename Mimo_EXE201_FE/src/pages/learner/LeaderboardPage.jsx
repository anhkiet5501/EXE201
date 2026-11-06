import React, { useEffect, useState } from 'react';
import ProBadge from '../../components/pro/ProBadge';
import { useOutletContext } from 'react-router-dom';
import { sound } from '../../utils/audioEffects';
import { learnerService } from '../../services/modules/learnerService';

export default function LeaderboardPage() {
  const { data } = useOutletContext();
  const [lbData, setLbData] = useState(data?.leaderboard || null);
  const [loading, setLoading] = useState(!data?.leaderboard);

  useEffect(() => {
    learnerService
      .getWeeklyLeaderboard()
      .then((res) => {
        if (res?.data) {
          setLbData(res.data);
        }
      })
      .catch((err) => {
        console.warn('Lỗi khi tải bảng xếp hạng, dùng dữ liệu mặc định:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const defaultUsers = [
    { rank: 1, name: 'Nguyễn Minh Quân', school: 'THPT FPT - 10A1', xp: 3250, streak: 15, avatar: '👦🏻' },
    { rank: 2, name: 'Trần Phương Anh', school: 'THPT Chuyên LHP', xp: 2980, streak: 12, avatar: '👧🏻' },
    { rank: 3, name: 'Lê Hoàng Bảo', school: 'THPT Lê Quý Đôn', xp: 2760, streak: 10, avatar: '👦🏽' },
    { rank: 4, name: 'Bạn (Nam)', school: 'THPT FPT - 10A2', xp: 1250, streak: 7, avatar: '🤖', isMe: true },
    { rank: 5, name: 'Phạm Ngọc Linh', school: 'THPT FPT - 10A1', xp: 1180, streak: 6, avatar: '👧🏼' },
    { rank: 6, name: 'Vũ Đức Huy', school: 'THPT FPT - 10A3', xp: 1050, streak: 5, avatar: '🧑🏻' },
    { rank: 7, name: 'Đỗ Thảo Vy', school: 'THPT Nguyễn Trãi', xp: 980, streak: 4, avatar: '👧🏻' },
    { rank: 8, name: 'Hoàng Long', school: 'THPT FPT - 10A1', xp: 870, streak: 3, avatar: '👦🏻' },
  ];

  // Chuyển đổi dữ liệu từ Backend sang danh sách hiển thị
  const rawEntries = lbData?.topEntries || lbData?.TopEntries || [];
  const leaderboardUsers =
    rawEntries.length > 0
      ? rawEntries.map((u) => ({
          rank: u.rank ?? u.Rank,
          name: u.fullName || u.FullName || 'Học viên Mimo',
          school: u.levelTitle || u.LevelTitle || 'Thành viên Mimo',
          xp: u.weeklyXp ?? u.WeeklyXp ?? 0,
          streak: 5,
          avatar: u.avatarUrl || u.AvatarUrl ? (
            <img
              src={u.avatarUrl || u.AvatarUrl}
              alt=""
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            '🧑🏻'
          ),
          avatarText: u.avatarUrl || u.AvatarUrl ? null : '🧑🏻',
          isMe: Boolean(u.isCurrentUser ?? u.IsCurrentUser),
          isPro: Boolean(u.isPro ?? u.IsPro),
        }))
      : defaultUsers;

  const top1 = leaderboardUsers.find((u) => u.rank === 1) || defaultUsers[0];
  const top2 = leaderboardUsers.find((u) => u.rank === 2) || defaultUsers[1];
  const top3 = leaderboardUsers.find((u) => u.rank === 3) || defaultUsers[2];

  // Đếm ngược thời gian còn lại của tuần
  const formatTimeLeft = (seconds) => {
    if (!seconds || seconds <= 0) return '2 ngày 14 giờ';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days} ngày ${hours} giờ`;
  };

  const remainingSecs = lbData?.remainingSeconds ?? lbData?.RemainingSeconds;
  const timeLeftDisplay = formatTimeLeft(remainingSecs);
  const tierName = lbData?.tier ? `GIẢI ĐẤU ${lbData.tier.toUpperCase()}` : 'GIẢI ĐẤU VÀNG (GOLD LEAGUE)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. HERO BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 100%)',
          borderRadius: '24px',
          padding: '28px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)',
          color: '#78350F',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '1px' }}>
            CHU KỲ TUẦN NÀY {lbData?.weekNumber ? `(${lbData.weekNumber})` : ''} • CÒN {timeLeftDisplay}
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '6px 0 8px 0', letterSpacing: '-0.5px' }}>
            🏆 {tierName}
          </h1>
          <p style={{ margin: 0, fontSize: '14.5px', maxWidth: '460px', lineHeight: 1.5 }}>
            Top 7 học viên xuất sắc nhất tuần này sẽ chính thức được <strong>thăng hạng lên Giải Bạch Kim</strong>!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="anim-float">
          <img src="/images/mascot.png" alt="Mimo" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
          <span style={{ fontSize: '32px' }}>👑</span>
        </div>
      </div>

      {/* 2. BỤC VINH QUANG TOP 3 (PODIUM) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '16px',
          padding: '20px 0 10px 0',
        }}
      >
        {/* HẠNG 2: BẠC */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '130px' }}>
          <div style={{ fontSize: '24px', marginBottom: '-8px' }}>🥈</div>
          <div style={{ fontSize: '42px', marginBottom: '6px' }}>{top2.avatar}</div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
            {top2.name} {top2.isPro && <ProBadge size="sm" label="" />}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#64748B' }}>
            {top2.xp?.toLocaleString()} XP
          </div>
          <div
            style={{
              width: '100%',
              height: '80px',
              background: '#E2E8F0',
              borderRadius: '16px 16px 0 0',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 900,
              color: '#475569',
            }}
          >
            2
          </div>
        </div>

        {/* HẠNG 1: VÀNG */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '150px' }}>
          <div style={{ fontSize: '32px', marginBottom: '-8px' }}>👑</div>
          <div style={{ fontSize: '50px', marginBottom: '6px' }}>{top1.avatar}</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
            {top1.name} {top1.isPro && <ProBadge size="sm" label="" />}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#D97706' }}>
            {top1.xp?.toLocaleString()} XP
          </div>
          <div
            style={{
              width: '100%',
              height: '110px',
              background: 'linear-gradient(180deg, #FDE047 0%, #EAB308 100%)',
              borderRadius: '18px 18px 0 0',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '34px',
              fontWeight: 900,
              color: '#713F12',
              boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4)',
            }}
          >
            1
          </div>
        </div>

        {/* HẠNG 3: ĐỒNG */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '130px' }}>
          <div style={{ fontSize: '24px', marginBottom: '-8px' }}>🥉</div>
          <div style={{ fontSize: '42px', marginBottom: '6px' }}>{top3.avatar}</div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
            {top3.name} {top3.isPro && <ProBadge size="sm" label="" />}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#B45309' }}>
            {top3.xp?.toLocaleString()} XP
          </div>
          <div
            style={{
              width: '100%',
              height: '60px',
              background: '#FED7AA',
              borderRadius: '16px 16px 0 0',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 900,
              color: '#9A3412',
            }}
          >
            3
          </div>
        </div>
      </div>

      {/* 3. BẢNG DANH SÁCH BẢNG ĐẤU */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            padding: '14px 24px',
            background: '#F8FAFC',
            borderBottom: '2px solid #E2E8F0',
            display: 'flex',
            fontSize: '12px',
            fontWeight: 800,
            color: '#64748B',
          }}
        >
          <div style={{ width: '50px' }}>HẠNG</div>
          <div style={{ flex: 1 }}>HỌC VIÊN</div>
          <div style={{ width: '160px' }}>TRƯỜNG / LỚP</div>
          <div style={{ width: '80px', textAlign: 'center' }}>STREAK</div>
          <div style={{ width: '110px', textAlign: 'right' }}>ĐIỂM XP</div>
        </div>

        <div>
          {leaderboardUsers.map((u) => {
            const isMe = u.isMe;

            return (
              <React.Fragment key={u.rank}>
                <div
                  style={{
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    background: isMe ? '#FEF9C3' : '#FFFFFF',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ width: '50px', fontSize: '16px', fontWeight: 900, color: u.rank <= 3 ? '#D97706' : '#64748B' }}>
                    #{u.rank}
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '26px' }}>{u.avatar}</span>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: isMe ? 900 : 700, color: '#0F172A' }}>
                        {u.name} {u.isPro && <ProBadge size="sm" label="" />} {isMe && <span style={{ color: '#D97706', fontSize: '12px' }}>(Bạn)</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '160px', fontSize: '13px', color: '#64748B' }}>
                    {u.school}
                  </div>

                  <div style={{ width: '80px', textAlign: 'center', fontSize: '14px', fontWeight: 800, color: '#EA580C' }}>
                    🔥 {u.streak}
                  </div>

                  <div style={{ width: '110px', textAlign: 'right', fontSize: '15px', fontWeight: 900, color: '#B45309' }}>
                    {u.xp?.toLocaleString()} XP
                  </div>
                </div>

                {/* Vạch thăng hạng xanh lá sau Top 7 */}
                {u.rank === 7 && (
                  <div
                    style={{
                      background: '#DCFCE7',
                      color: '#15803D',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '8px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderTop: '2px dashed #86EFAC',
                      borderBottom: '2px dashed #86EFAC',
                    }}
                  >
                    <span>▲</span>
                    <span>KHU VỰC THĂNG HẠNG LÊN GIẢI BẠCH KIM (TOP 1 – 7)</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
