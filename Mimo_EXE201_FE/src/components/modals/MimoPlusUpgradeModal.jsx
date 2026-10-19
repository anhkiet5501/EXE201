import React, { useState } from 'react';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function MimoPlusUpgradeModal({ isOpen, onClose, onUpgradeSuccess = () => {} }) {
  const [selectedPlan, setSelectedPlan] = useState('QUARTERLY'); // MONTHLY | QUARTERLY | HALF_YEAR
  const [showQrStep, setShowQrStep] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const plans = {
    MONTHLY: { id: 'MONTHLY', name: 'Gói 1 Tháng (Monthly)', price: 79000, desc: 'Linh hoạt cho phụ huynh muốn trải nghiệm', badge: 'Linh hoạt' },
    QUARTERLY: { id: 'QUARTERLY', name: 'Gói 3 Tháng (Quarterly)', price: 219000, desc: 'Chỉ 73.000 đ/tháng. Tiết kiệm 18.000 đ so với trả từng tháng', badge: '⭐ Gói Chủ Lực • Phổ biến nhất' },
    HALF_YEAR: { id: 'HALF_YEAR', name: 'Gói 6 Tháng (Half-Year)', price: 399000, desc: 'Chỉ 66.500 đ/tháng. Tiết kiệm 75.000 đ so với trả từng tháng', badge: '💎 Tiết kiệm 75k' },
  };

  const activePlanObj = plans[selectedPlan];

  const handleStartPayment = () => {
    sound.playClick();
    setShowQrStep(true);
  };

  const handleConfirmPaid = () => {
    setIsProcessing(true);
    sound.playClick();
    setTimeout(() => {
      setIsProcessing(false);
      setShowQrStep(false);
      sound.playVictory();
      fireConfetti();

      // Cập nhật trạng thái User thành PLUS trong localStorage
      try {
        const rawUser = localStorage.getItem('mimo_user');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          u.isPlus = true;
          u.plan = 'MIMO_PLUS';
          localStorage.setItem('mimo_user', JSON.stringify(u));
        }
      } catch (e) {
        console.error('Error updating plus user:', e);
      }

      onUpgradeSuccess(activePlanObj);
      alert(`🎉 CHÚC MỪNG BẠN ĐÃ NÂNG CẤP THÀNH CÔNG GÓI MIMO PLUS (${activePlanObj.name})!\nBạn đã mở khóa Vô Hạn Tim và toàn bộ đặc quyền cao cấp.`);
      onClose();
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          maxWidth: '560px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '2px solid #E2E8F0',
          position: 'relative',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* NÚT ĐÓNG */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          ✕
        </button>

        {!showQrStep ? (
          <div style={{ overflowY: 'auto', padding: '32px 28px 24px' }}>
            {/* HERO BANNER TÍM VÀNG DUOLINGO PLUS */}
            <div
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #9333EA, #C026D3)',
                borderRadius: '20px',
                padding: '24px 20px',
                textAlign: 'center',
                color: '#FFFFFF',
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '46px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}>👑</div>
              <h2 style={{ fontSize: '26px', fontWeight: 900, margin: '6px 0 4px', letterSpacing: '-0.5px' }}>
                MIMO PLUS
              </h2>
              <div style={{ fontSize: '13.5px', color: '#F5D0FE', fontWeight: 700 }}>
                Trải nghiệm học kỹ năng sinh tồn đỉnh cao — Không giới hạn tim
              </div>
            </div>

            {/* 5 ĐẶC QUYỀN VƯỢT TRỘI CỦA MIMO PLUS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#FAF5FF', borderRadius: '12px', border: '1px solid #F3E8FF' }}>
                <span style={{ fontSize: '24px' }}>❤️</span>
                <div style={{ fontSize: '13.5px', color: '#0F172A' }}>
                  <strong>Vô Hạn Tim:</strong> Xử lý tình huống sai thoải mái, không lo gián đoạn bài học.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
                <span style={{ fontSize: '24px' }}>🩺</span>
                <div style={{ fontSize: '13.5px', color: '#0F172A' }}>
                  <strong>Lời khuyên Bác sĩ & Chuyên gia PCCC:</strong> Phân tích sâu nguyên nhân y khoa & quy chuẩn cứu hộ.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#FFF7ED', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
                <span style={{ fontSize: '24px' }}>🛡️</span>
                <div style={{ fontSize: '13.5px', color: '#0F172A' }}>
                  <strong>Tự động bảo vệ Streak:</strong> Không bao giờ đứt chuỗi ngày học nếu bận rộn 1 ngày.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#EFF6FF', borderRadius: '12px', border: '1px solid #DBEAFE' }}>
                <span style={{ fontSize: '24px' }}>🎖️</span>
                <div style={{ fontSize: '13.5px', color: '#0F172A' }}>
                  <strong>Chứng Chỉ Số Có QR Tra Cứu:</strong> Cấp chứng chỉ chính thức bổ sung vào CV & hồ sơ.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '24px' }}>🚫</span>
                <div style={{ fontSize: '13.5px', color: '#0F172A' }}>
                  <strong>100% Không Quảng Cáo:</strong> Hoàn toàn tập trung vào rèn luyện phản xạ sinh tồn.
                </div>
              </div>
            </div>

            {/* CHỌN GÓI CƯỚC */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {Object.values(plans).map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPlan(p.id);
                    }}
                    style={{
                      border: isSelected ? '2.5px solid #7C3AED' : '2px solid #E2E8F0',
                      background: isSelected ? '#FAF5FF' : '#FFFFFF',
                      borderRadius: '16px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 14px rgba(124, 58, 237, 0.15)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15.5px', fontWeight: 900, color: '#0F172A' }}>
                          {p.name}
                        </span>
                        {p.badge && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              background: isSelected ? '#7C3AED' : '#F1F5F9',
                              color: isSelected ? '#FFFFFF' : '#475569',
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
                        {p.desc}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#7C3AED' }}>
                        {p.price.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NÚT HÀNH ĐỘNG CHÍNH */}
            <button
              onClick={handleStartPayment}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '16px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.15s',
              }}
            >
              <span>✨</span>
              <span>DÙNG THỬ 14 NGÀY MIỄN PHÍ</span>
            </button>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
              Sau 14 ngày tự động gia hạn {activePlanObj.price.toLocaleString('vi-VN')} đ. Hủy bất cứ lúc nào.
            </div>
          </div>
        ) : (
          /* STEP 2: MÀN HÌNH QUÉT MÃ VIETQR PAYOS */
          <div style={{ padding: '32px 28px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px' }}>
              Thanh Toán Gói MIMO PLUS
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
              Gói đã chọn: <strong>{activePlanObj.name}</strong> • Số tiền: <strong style={{ color: '#7C3AED' }}>{activePlanObj.price.toLocaleString('vi-VN')} đ</strong>
            </p>

            <div
              style={{
                display: 'inline-block',
                padding: '16px',
                background: '#F8FAFC',
                borderRadius: '16px',
                border: '2px dashed #7C3AED',
                margin: '8px auto 16px',
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=MIMO_PLUS_${selectedPlan}_${activePlanObj.price}`}
                alt="QR PayOS"
                style={{ width: '190px', height: '190px', display: 'block' }}
              />
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '8px', fontWeight: 700 }}>
                Cổng thanh toán tự động PayOS • VietQR
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowQrStep(false)}
                disabled={isProcessing}
                style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                }}
              >
                Quay lại
              </button>

              <button
                type="button"
                onClick={handleConfirmPaid}
                disabled={isProcessing}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                }}
              >
                {isProcessing ? '⏳ Đang kích hoạt gói...' : '✅ Giả lập Quét QR Thành Công'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
