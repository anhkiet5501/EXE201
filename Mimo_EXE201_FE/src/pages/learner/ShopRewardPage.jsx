import React, { useState } from 'react';
import { sound } from '../../utils/audioEffects';
import MimoPlusUpgradeModal from '../../components/modals/MimoPlusUpgradeModal';

export default function ShopRewardPage() {
  const [showPlusModal, setShowPlusModal] = useState(false);
  const shopItems = [
    {
      id: 'freeze',
      title: 'Bùa Đóng Băng Streak',
      desc: 'Bảo vệ chuỗi học tập nếu bạn bận rộn không thể học 1 ngày.',
      cost: '200 XP',
      icon: '🛡️',
      color: '#0EA5E9',
      bg: '#E0F2FE',
    },
    {
      id: 'hearts',
      title: 'Gói Hồi Đầy 5 Tim',
      desc: 'Hồi phục ngay toàn bộ 5 tim để tiếp tục thử thách an toàn.',
      cost: '150 XP',
      icon: '❤️',
      color: '#EF4444',
      bg: '#FEE2E2',
    },
    {
      id: 'pro_trial',
      title: 'Dùng Thử MIMO PRO',
      desc: 'Mở khóa vô hạn tim, luyện tập không giới hạn trong 7 ngày.',
      cost: 'Miễn phí',
      icon: '👑',
      color: '#8B5CF6',
      bg: '#F3E8FF',
    },
    {
      id: 'badge_hero',
      title: 'Huy hiệu Hiệp sĩ An toàn',
      desc: 'Gắn huy hiệu độc quyền trên bảng xếp hạng và hồ sơ.',
      cost: '500 XP',
      icon: '🎖️',
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px' }}>💎</span>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            Cửa hàng Đổi thưởng & Vật phẩm
          </h1>
        </div>
        <p style={{ color: '#64748B', fontSize: '14.5px', margin: '6px 0 0 0' }}>
          Sử dụng điểm kinh nghiệm (XP) tích lũy để trang bị bùa hộ mệnh và hỗ trợ việc học tập.
        </p>
      </div>

      {/* BANNER MIMO PLUS CÁ NHÂN */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7C3AED, #9333EA, #C026D3)',
          borderRadius: '24px',
          padding: '28px 32px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 12px 28px rgba(124, 58, 237, 0.25)',
        }}
      >
        <div style={{ maxWidth: '560px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.2)', color: '#FFF', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', marginBottom: '8px' }}>
            <span>👑</span>
            <span>GÓI CÁ NHÂN CAO CẤP NHẤT</span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '4px 0 8px 0', letterSpacing: '-0.3px' }}>
            Nâng Cấp MIMO PLUS — Vô Hạn Tim ❤️
          </h2>

          <p style={{ fontSize: '14px', color: '#F5D0FE', margin: 0, lineHeight: 1.5 }}>
            Không bao giờ bị gián đoạn khi giải quyết tình huống khẩn cấp, mở khóa phân tích chuyên sâu của Bác sĩ y khoa & Chuyên gia PCCC, tự động bảo vệ chuỗi Streak và 100% không quảng cáo.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowPlusModal(true);
          }}
          style={{
            background: '#FFFFFF',
            color: '#7C3AED',
            border: 'none',
            borderRadius: '16px',
            padding: '14px 28px',
            fontSize: '14.5px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span>✨</span>
          <span>DÙNG THỬ 14 NGÀY MIỄN PHÍ</span>
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
        }}
      >
        {shopItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                  {item.desc}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: item.color }}>
                {item.cost}
              </span>

              <button
                onClick={() => {
                  sound.playClick();
                  if (item.id === 'pro_trial') {
                    setShowPlusModal(true);
                  } else {
                    alert(`Bạn đã chọn đổi: ${item.title}!`);
                  }
                }}
                className="btn-3d btn-3d-blue btn-3d-sm"
                style={{ padding: '8px 16px', fontSize: '12.5px' }}
              >
                {item.id === 'pro_trial' ? 'NÂNG CẤP' : 'ĐỔI NGAY'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GÓI DOANH NGHIỆP & NHÀ TRƯỜNG (B2B ENTERPRISE) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          borderRadius: '24px',
          padding: '30px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div style={{ maxWidth: '580px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284C7', color: '#FFF', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', marginBottom: '8px' }}>
            <span>🏢</span>
            <span>DÀNH CHO NHÀ TRƯỜNG & DOANH NGHIỆP</span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 900, margin: '4px 0 8px 0', color: '#F8FAFC' }}>
            MIMO School & Enterprise — Đào Tạo An Toàn Tập Thể
          </h2>

          <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            Quản lý từ 15 đến 500+ học sinh/nhân viên, tự động phân khối lớp (10A1-12A5), cấp mã bản quyền giáo viên bộ môn, theo dõi lỗ hổng PCCC và xuất báo cáo kiểm định tuân thủ chính thức.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            window.location.href = '/business';
          }}
          style={{
            background: 'linear-gradient(135deg, #38BDF8, #0284C7)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '14px',
            padding: '14px 26px',
            fontSize: '14px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(2, 132, 199, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🚀</span>
          <span>QUẢN TRỊ DOANH NGHIỆP / TRƯỜNG HỌC</span>
        </button>
      </div>

      {/* MODAL NÂNG CẤP MIMO PLUS */}
      <MimoPlusUpgradeModal
        isOpen={showPlusModal}
        onClose={() => setShowPlusModal(false)}
        onUpgradeSuccess={() => window.location.reload()}
      />
    </div>
  );
}
