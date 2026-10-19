import React, { useState } from 'react';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function BusinessBillingPage() {
  const [totalSeats, setTotalSeats] = useState(500);
  const [usedSeats, setUsedSeats] = useState(412);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState({ seats: 50, price: 1250000 });
  const [isProcessing, setIsProcessing] = useState(false);

  const packs = [
    { seats: 50, price: 1250000, label: 'Nạp thêm +50 Suất', discount: 'Chuẩn B2B' },
    { seats: 100, price: 2300000, label: 'Nạp thêm +100 Suất', discount: 'Tiết kiệm 8%' },
    { seats: 200, price: 4200000, label: 'Nạp thêm +200 Suất', discount: 'Tiết kiệm 16%' },
  ];

  const handleOpenBuy = (pack) => {
    sound.playClick();
    setSelectedPack(pack);
    setShowBuyModal(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    sound.playClick();
    setTimeout(() => {
      setIsProcessing(false);
      setShowBuyModal(false);
      setTotalSeats((prev) => prev + selectedPack.seats);
      sound.playVictory();
      fireConfetti();
      alert(`🎉 Thanh toán thành công qua PayOS! Hạn ngạch trường đã tăng thêm +${selectedPack.seats} suất học sinh!`);
    }, 1500);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="biz-page-header">
        <div>
          <h1 className="biz-page-title">
            <span>💳</span>
            <span>Gói Cước & Hạn Ngạch Bản Quyền</span>
          </h1>
          <p className="biz-page-subtitle">
            Quản lý gói hợp đồng niên khóa trường học, số lượng suất học sinh và gia hạn bản quyền
          </p>
        </div>
      </div>

      {/* THẺ GÓI HIỆN TẠI */}
      <div className="biz-card" style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ background: '#0284C7', color: '#FFF', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
              HỢP ĐỒNG NIÊN KHÓA 2026 - 2027
            </span>
            <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '8px' }}>
              MIMO School Enterprise — 500 Suất Học Sinh
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Đơn vị thụ hưởng: <strong>Trường THPT FPT Cần Thơ</strong> • Mã số thuế: <strong>1801642890</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>Thời hạn hợp đồng:</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
              31/12/2026 (Còn 314 ngày)
            </div>
          </div>
        </div>

        {/* TIẾN ĐỘ SUẤT */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            <span>Số suất học sinh đã kích hoạt:</span>
            <strong>{usedSeats} / {totalSeats} Suất ({((usedSeats / totalSeats) * 100).toFixed(1)}%)</strong>
          </div>
          <div style={{ height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(usedSeats / totalSeats) * 100}%`,
                background: '#38BDF8',
                borderRadius: '5px',
              }}
            />
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            💡 Còn trống {totalSeats - usedSeats} suất học. Khi trường tuyển thêm học sinh mới có thể nạp thêm suất bất kỳ lúc nào.
          </div>
        </div>
      </div>

      {/* CÁC GÓI NẠP THÊM SUẤT */}
      <div className="biz-card">
        <div className="biz-card-title">
          <span>➕ Mở Rộng Hạn Ngạch — Nạp Thêm Suất Học</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {packs.map((p) => (
            <div
              key={p.seats}
              style={{
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                padding: '20px',
                background: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '4px' }}>
                  {p.discount}
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0284C7', margin: '8px 0' }}>
                  {p.price.toLocaleString('vi-VN')} đ
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Chỉ ~{(p.price / p.seats).toLocaleString('vi-VN')} đ/học sinh cho toàn bộ niên khóa.
                </div>
              </div>

              <button
                type="button"
                className="biz-btn-primary"
                style={{ marginTop: '16px', justifyContent: 'center' }}
                onClick={() => handleOpenBuy(p)}
              >
                Nạp Thêm Ngay →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL THANH TOÁN VIETQR PAYOS */}
      {showBuyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '24px', width: '450px', maxWidth: '90%', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>
              Quét Mã VietQR Thanh Toán Hạn Ngạch
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: 0 }}>
              Gói mở rộng: <strong>+{selectedPack.seats} Suất học sinh</strong> • Số tiền: <strong style={{ color: '#0284C7' }}>{selectedPack.price.toLocaleString('vi-VN')} đ</strong>
            </p>

            {/* MÃ QR DEMO */}
            <div style={{ margin: '16px auto', padding: '16px', background: '#F8FAFC', borderRadius: '12px', display: 'inline-block', border: '2px dashed #0284C7' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PAYOS_MIMO_SCHOOL_${selectedPack.seats}`}
                alt="QR Code PayOS"
                style={{ width: '180px', height: '180px', display: 'block' }}
              />
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>Cổng PayOS • Tự động kích hoạt sau 3s</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '14px' }}>
              <button
                type="button"
                className="biz-btn-secondary"
                disabled={isProcessing}
                onClick={() => setShowBuyModal(false)}
              >
                Hủy
              </button>

              <button
                type="button"
                className="biz-btn-primary"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
              >
                {isProcessing ? '⏳ Đang xác nhận thanh toán...' : '✅ Giả lập Quét QR Thành Công'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
