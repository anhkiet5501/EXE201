import React, { useState } from 'react';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function AchievementsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeBadgeModal, setActiveBadgeModal] = useState(null);
  const [activeCertModal, setActiveCertModal] = useState(null);

  const filters = [
    { id: 'all', label: 'Tất cả (8)' },
    { id: 'unlocked', label: 'Đã mở khóa (4)' },
    { id: 'first_aid', label: '🚑 Sơ cứu y tế' },
    { id: 'fire', label: '🔥 PCCC & Thoát hiểm' },
    { id: 'cyber', label: '🛡️ An toàn số' },
  ];

  const badges = [
    {
      id: 'b1',
      title: 'Bàn tay vàng',
      category: 'first_aid',
      desc: 'Xử lý hoàn hảo ca sơ cứu bỏng không sai bất kỳ bước nào trong thời gian quy chuẩn.',
      icon: '🩹',
      unlocked: true,
      stars: 3,
      date: '14/10/2026',
      rarity: 'Hiếm (12% học viên đạt)',
    },
    {
      id: 'b2',
      title: 'Chiến binh kiên trì',
      category: 'all',
      desc: 'Duy trì ngọn lửa học tập an toàn liên tục trong 7 ngày không bị đứt chuỗi.',
      icon: '🔥',
      unlocked: true,
      stars: 2,
      date: '16/10/2026',
      rarity: 'Phổ biến (38% học viên đạt)',
    },
    {
      id: 'b3',
      title: 'Mắt thần chống Scam',
      category: 'cyber',
      desc: 'Vạch mặt chuẩn xác 5 tin nhắn bẫy lừa đảo mạng và đường link độc hại.',
      icon: '🛡️',
      unlocked: true,
      stars: 2,
      date: '15/10/2026',
      rarity: 'Khá hiếm (22% học viên đạt)',
    },
    {
      id: 'b4',
      title: 'Hiệp sĩ Hồi sinh',
      category: 'first_aid',
      desc: 'Thực hiện ép tim CPR và thổi ngạt đúng nhịp điệu 30:2 cứu sống nạn nhân ngưng tim.',
      icon: '🫀',
      unlocked: true,
      stars: 1,
      date: '12/10/2026',
      rarity: 'Hiếm (15% học viên đạt)',
    },
    {
      id: 'b5',
      title: 'Khắc tinh giặc lửa',
      category: 'fire',
      desc: 'Vượt qua bài thi Boss Thoát hiểm PCCC trong căn hộ chung cư ngập khói độc.',
      icon: '🚒',
      unlocked: false,
      stars: 0,
      requirement: 'Hoàn thành bài thi Boss Chặng 2 PCCC',
      rarity: 'Cực hiếm (6% học viên đạt)',
    },
    {
      id: 'b6',
      title: 'Vua Giải đấu',
      category: 'all',
      desc: 'Lọt vào Top 3 Bảng xếp hạng tuần ở Giải Đấu Vàng.',
      icon: '👑',
      unlocked: false,
      stars: 0,
      requirement: 'Kết thúc chu kỳ tuần ở Top 3 League',
      rarity: 'Huyền thoại (3% học viên đạt)',
    },
    {
      id: 'b7',
      title: 'Lá chắn Không gian mạng',
      category: 'cyber',
      desc: 'Thiết lập xác thực 2 lớp 2FA và bảo vệ thông tin định danh cá nhân.',
      icon: '💻',
      unlocked: false,
      stars: 0,
      requirement: 'Hoàn thành 10 thử thách An toàn số',
      rarity: 'Khá hiếm (18% học viên đạt)',
    },
    {
      id: 'b8',
      title: 'Bậc thầy Heimlich',
      category: 'first_aid',
      desc: 'Khai thông đường thở cho nạn nhân hóc dị vật nguy kịch dưới 30 giây.',
      icon: '🫁',
      unlocked: false,
      stars: 0,
      requirement: 'Đạt điểm tối đa bài thực hành Heimlich',
      rarity: 'Hiếm (9% học viên đạt)',
    },
  ];

  const certificates = [
    {
      id: 'cert_fa',
      title: 'Chứng Chỉ Sơ Cấp Cứu Ban Đầu Cơ Bản',
      subtitle: 'Basic First Aid & Life Support Certification',
      issuer: 'Học viện Kỹ năng Sinh tồn MIMO & Đối tác Y tế',
      code: 'MIMO-CERT-FA-2026-8891',
      date: '15/10/2026',
      status: 'valid',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      badgeIcon: '🚑',
    },
    {
      id: 'cert_fire',
      title: 'Chứng Nhận Kỹ Năng Thoát Hiểm Hỏa Hoạn & PCCC',
      subtitle: 'Fire Safety & High-rise Building Evacuation',
      issuer: 'Chương trình Liên kết Kỹ năng Nhà trường',
      progress: 65,
      status: 'in_progress',
      gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
      badgeIcon: '🔥',
    },
  ];

  const filteredBadges = badges.filter((b) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unlocked') return b.unlocked;
    return b.category === selectedFilter;
  });

  const handleShare = () => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết Hồ sơ Thành tích của bạn! Bạn có thể chia sẻ lên Facebook/Zalo.');
    } else {
      alert('Liên kết thành tích của bạn: ' + window.location.href);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '960px', margin: '0 auto' }}>
      {/* 1. HEADER KHO THÀNH TÍCH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>🏅</span>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Kho Thành Tích & Chứng Chỉ Kỹ Năng
              </h1>
              <span
                style={{
                  background: '#FEF3C7',
                  color: '#B45309',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  marginTop: '4px',
                  display: 'inline-block',
                }}
              >
                PHÒNG TRUYỀN THỐNG SINH TỒN
              </span>
            </div>
          </div>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '8px 0 0 0' }}>
            Nơi trưng bày các huy hiệu danh dự, chứng chỉ được cấp và các kỷ lục xử lý sự cố thực tế của bạn.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="btn-3d btn-3d-blue btn-3d-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>📤</span>
          <span>CHIA SẺ CHIẾN TÍCH</span>
        </button>
      </div>

      {/* 2. HERO CARD CẤP BẬC DANH DỰ (HONOR RANK PROGRESSION) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '24px',
          padding: '28px 32px',
          color: '#FFFFFF',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.35)',
              flexShrink: 0,
            }}
            className="anim-float"
          >
            🛡️
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#FCD34D', letterSpacing: '1px' }}>
              DANH HIỆU HIỆN TẠI
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '4px 0 6px 0', letterSpacing: '-0.3px' }}>
              Cấp 4 • Người Bảo Vệ (Safety Guardian)
            </h2>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              Cần thêm <strong style={{ color: '#FCD34D' }}>750 XP</strong> để thăng cấp lên{' '}
              <strong style={{ color: '#38BDF8' }}>Cấp 5 • Master Protector</strong>
            </div>
          </div>
        </div>

        {/* Thanh tiến độ XP cấp bậc */}
        <div style={{ minWidth: '240px', flex: 1, maxWidth: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
            <span style={{ color: '#FCD34D' }}>1.250 XP</span>
            <span style={{ color: '#94A3B8' }}>2.000 XP</span>
          </div>
          <div className="mimo-progress-bar" style={{ height: '14px', background: '#334155' }}>
            <div
              className="mimo-progress-fill"
              style={{
                width: '62.5%',
                background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
              }}
            />
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px', textAlign: 'right' }}>
            Tiến độ thăng cấp: 62.5%
          </div>
        </div>
      </div>

      {/* 3. KỶ LỤC SINH TỒN (SURVIVAL STATS) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontSize: '26px', marginBottom: '8px' }}>🚑</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#0EA5E9' }}>18 Nạn nhân</div>
          <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Đã cứu sống trong giả lập</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontSize: '26px', marginBottom: '8px' }}>🎯</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#16A34A' }}>96%</div>
          <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Tỷ lệ quyết định an toàn đúng</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontSize: '26px', marginBottom: '8px' }}>⚡</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#EA580C' }}>1.8 giây</div>
          <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Tốc độ phản xạ trung bình</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontSize: '26px', marginBottom: '8px' }}>🛡️</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#7C3AED' }}>12 Bẫy lừa</div>
          <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Đã phát giác & phòng thủ</div>
        </div>
      </div>

      {/* 4. BẢO TÀNG HUY HIỆU DANH DỰ (INTERACTIVE 3D BADGES) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏆</span>
              <span>Bảo tàng Huy hiệu Danh dự</span>
            </h2>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
              Đã mở khóa: <strong>4 / 8 huy hiệu</strong> • Chạm vào huy hiệu để xem chi tiết
            </div>
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedFilter(f.id);
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  border: '1.5px solid',
                  borderColor: selectedFilter === f.id ? '#15803D' : '#E2E8F0',
                  background: selectedFilter === f.id ? '#DCFCE7' : '#FFFFFF',
                  color: selectedFilter === f.id ? '#15803D' : '#64748B',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lưới huy hiệu */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredBadges.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                sound.playClick();
                setActiveBadgeModal(b);
              }}
              style={{
                background: b.unlocked ? '#FFFFFF' : '#F8FAFC',
                border: `2px solid ${b.unlocked ? '#CBD5E1' : '#E2E8F0'}`,
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: b.unlocked ? '0 4px 12px rgba(0,0,0,0.04)' : 'none',
                opacity: b.unlocked ? 1 : 0.65,
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = b.unlocked ? '0 4px 12px rgba(0,0,0,0.04)' : 'none';
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: b.unlocked ? '#FEF3C7' : '#E2E8F0',
                  border: `2px solid ${b.unlocked ? '#FDE047' : '#CBD5E1'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  filter: b.unlocked ? 'none' : 'grayscale(1)',
                  flexShrink: 0,
                }}
              >
                {b.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {b.title}
                  </h3>
                  {b.unlocked && (
                    <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 800 }}>
                      {'⭐'.repeat(b.stars)}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                  {b.desc}
                </p>

                {b.unlocked ? (
                  <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 800 }}>
                    ✓ Đạt ngày {b.date}
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700 }}>
                    🔒 {b.requirement}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CHỨNG CHỈ KỸ NĂNG ĐƯỢC CẤP (VERIFIED CERTIFICATES) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📜</span>
              <span>Chứng Chỉ Kỹ Năng An Toàn Đã Cấp</span>
            </h2>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
              Chứng nhận có giá trị xác thực kỹ năng sinh tồn cho học sinh cấp 3
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
          {certificates.map((c) => (
            <div
              key={c.id}
              style={{
                background: c.gradient,
                borderRadius: '20px',
                padding: '24px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{c.badgeIcon}</span>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.22)',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    {c.status === 'valid' ? 'ĐÃ XÁC THỰC ✅' : 'TIẾN ĐỘ: ' + c.progress + '%'}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 900, margin: '0 0 4px 0', lineHeight: 1.3 }}>
                  {c.title}
                </h3>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>{c.subtitle}</div>
                <div style={{ fontSize: '11.5px', opacity: 0.85 }}>Cấp bởi: {c.issuer}</div>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, opacity: 0.9 }}>
                  {c.status === 'valid' ? 'Mã: ' + c.code : 'Hoàn thành 3 bài nữa'}
                </span>

                {c.status === 'valid' ? (
                  <button
                    onClick={() => {
                      sound.playVictory();
                      fireConfetti();
                      setActiveCertModal(c);
                    }}
                    style={{
                      background: '#FFFFFF',
                      color: '#047857',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    XEM CHỨNG CHỈ ➔
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FED7AA' }}>
                    Đang rèn luyện...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT HUY HIỆU */}
      {activeBadgeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setActiveBadgeModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>{activeBadgeModal.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
              {activeBadgeModal.title}
            </h3>
            <div style={{ fontSize: '13px', color: '#D97706', fontWeight: 800, marginBottom: '14px' }}>
              Độ hiếm: {activeBadgeModal.rarity}
            </div>

            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              {activeBadgeModal.desc}
            </p>

            <div
              style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '12px',
                marginBottom: '20px',
                fontSize: '13px',
                fontWeight: 700,
                color: activeBadgeModal.unlocked ? '#15803D' : '#DC2626',
              }}
            >
              {activeBadgeModal.unlocked
                ? '✅ Đã mở khóa vào ' + activeBadgeModal.date
                : '🔒 ' + activeBadgeModal.requirement}
            </div>

            <button
              onClick={() => setActiveBadgeModal(null)}
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
              }}
            >
              ĐÓNG
            </button>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT CHỨNG CHỈ CẤP CHÍNH THỨC */}
      {activeCertModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setActiveCertModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFBEB',
              borderRadius: '24px',
              border: '6px solid #D97706',
              padding: '36px 32px',
              maxWidth: '520px',
              width: '92%',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏅</div>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#B45309', letterSpacing: '2px' }}>
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM • GIÁO DỤC KỸ NĂNG SỐNG
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#78350F', margin: '8px 0 4px 0' }}>
              CHỨNG NHẬN KỸ NĂNG SINH TỒN
            </h2>
            <div style={{ fontSize: '13px', color: '#92400E', marginBottom: '18px' }}>
              {activeCertModal.title}
            </div>

            <p style={{ fontSize: '14px', color: '#451A03', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              Chứng nhận học viên <strong>Nguyễn Văn Học</strong> đã hoàn thành xuất sắc chương trình đào tạo thực hành và kiểm tra phản xạ kỹ năng cấp cứu khẩn cấp.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px dashed #D97706', borderBottom: '1px dashed #D97706', padding: '12px 0', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#92400E' }}>MÃ HIỆU</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#78350F' }}>{activeCertModal.code}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#92400E' }}>NGÀY CẤP</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#78350F' }}>{activeCertModal.date}</div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Đang tải file PDF Chứng nhận chính thức về máy của bạn...');
                setActiveCertModal(null);
              }}
              className="btn-3d btn-3d-green"
              style={{ width: '100%' }}
            >
              📥 TẢI VỀ BẢN PDF CÓ CHỮ KÝ SỐ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
