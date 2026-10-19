import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/modules/adminService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Resolution modal state
  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [rewardXP, setRewardXP] = useState(50);
  const [thankYouNote, setThankYouNote] = useState('Cảm ơn bạn đã đóng góp giúp kịch bản an toàn của MIMO ngày càng chuẩn xác!');

  useEffect(() => {
    adminService.getFeedbacks()
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenResolve = (item) => {
    sound.playClick();
    setResolvingTicket(item);
  };

  const handleConfirmResolve = (e) => {
    e.preventDefault();
    sound.playVictory();
    fireConfetti();
    adminService.resolveFeedback(resolvingTicket.id, rewardXP).then((res) => {
      setFeedbacks(res.data);
      alert(`🎉 Đã xử lý thành công ticket! Hệ thống đã gửi thư cảm ơn kèm +${rewardXP} XP tri ân đến hòm thư của ${resolvingTicket.userName}.`);
      setResolvingTicket(null);
    });
  };

  const filtered = feedbacks.filter((f) => filterType === 'ALL' || f.type === filterType);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Đang tải trung tâm báo lỗi...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#0F172A', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
              MODULE 6
            </span>
            <span style={{ color: '#0284C7', fontWeight: 700, fontSize: '13px' }}>
              Incidents &amp; Content Feedback Tickets
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            💬 Trung Tâm Tiếp Nhận Báo Lỗi &amp; Góp Ý Chuyên Môn
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0' }}>
            Lắng nghe phản hồi từ học sinh và bác sĩ khi chơi tình huống, sửa lỗi nhanh và gửi quà tri ân điểm XP.
          </p>
        </div>

        {/* BỘ LỌC PHÂN LOẠI */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Tất cả phiếu' },
            { id: 'BUG_UI', label: '🐛 Lỗi Kỹ thuật' },
            { id: 'MEDICAL_FEEDBACK', label: '🩺 Góp ý Chuyên môn' },
            { id: 'TYPO', label: '🔤 Lỗi Chính tả' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { sound.playClick(); setFilterType(tab.id); }}
              style={{
                background: filterType === tab.id ? '#0F172A' : '#FFFFFF',
                color: filterType === tab.id ? '#FFFFFF' : '#475569',
                border: '1.5px solid #CBD5E1',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH TICKETS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: item.status === 'OPEN' ? '1.5px solid #CBD5E1' : '1.5px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              opacity: item.status === 'RESOLVED' ? 0.75 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  background: item.typeBg,
                  color: item.typeColor,
                  fontWeight: 800,
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}>
                  {item.typeBadge}
                </span>

                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  Bài học: <strong style={{ color: '#0F172A' }}>{item.targetLesson}</strong> (Câu: {item.targetQuestionId})
                </span>

                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  • {item.submittedAt}
                </span>
              </div>

              <div>
                {item.status === 'OPEN' ? (
                  <span style={{ background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                    ⏳ Đang chờ xử lý
                  </span>
                ) : (
                  <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                    ✓ Đã giải quyết (+{item.giftSentXP || 50} XP)
                  </span>
                )}
              </div>
            </div>

            {/* NỘI DUNG GÓP Ý */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '13.5px', lineHeight: 1.5, color: '#334155' }}>
              "{item.content}"
            </div>

            {/* THÔNG TIN NGƯỜI GỬI & HÀNH ĐỘNG */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                Người báo cáo: <strong style={{ color: '#0F172A' }}>{item.userName}</strong> ({item.userEmail})
              </div>

              {item.status === 'OPEN' && (
                <button
                  type="button"
                  onClick={() => handleOpenResolve(item)}
                  style={{
                    background: '#15803D',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)',
                  }}
                >
                  <span>✅</span>
                  <span>Đã Sửa Xong &amp; Tặng +50 XP Tri Ân</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL GIẢI QUYẾT TICKET & GỬI QUÀ */}
      {resolvingTicket && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(5px)',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '520px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px' }}>
              🎁 Đóng Phiếu &amp; Gửi Quà Tri Ân Người Học
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
              Gửi quà tri ân đến: <strong>{resolvingTicket.userName}</strong> ({resolvingTicket.userEmail})
            </p>

            <form onSubmit={handleConfirmResolve} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Số điểm XP tri ân đền bù:
                </label>
                <select
                  value={rewardXP}
                  onChange={(e) => setRewardXP(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 700 }}
                >
                  <option value={50}>+50 XP (Lỗi chính tả / góp ý nhỏ)</option>
                  <option value={100}>+100 XP (Lỗi kỹ thuật UI / giao diện)</option>
                  <option value={200}>+200 XP (Phát hiện sai sót y khoa quan trọng)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Lời nhắn gửi vào hòm thư học viên:
                </label>
                <textarea
                  rows={3}
                  value={thankYouNote}
                  onChange={(e) => setThankYouNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ background: '#15803D', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Xác Nhận Đóng Phiếu &amp; Tặng Quà
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
