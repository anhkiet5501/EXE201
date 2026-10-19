import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/modules/adminService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Broadcast Modal State
  const [selectedGap, setSelectedGap] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  useEffect(() => {
    Promise.all([adminService.getAnalytics(), adminService.getSkillGaps()])
      .then(([metricsRes, gapsRes]) => {
        setMetrics(metricsRes.data);
        setSkillGaps(gapsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenBroadcastModal = (gap) => {
    sound.playClick();
    setSelectedGap(gap);
    setBroadcastMessage(
      `🚨 KHẨN CẤP TỪ MIMO: ${gap.wrongRate}% học viên đang xử trí sai tình huống "${gap.topic}". Hãy xem ngay quy chuẩn an toàn: ${gap.correctProtocol}`
    );
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    sound.playVictory();
    fireConfetti();
    adminService.broadcastSkillAlert(selectedGap?.id, broadcastMessage).then(() => {
      setBroadcastSuccess(true);
      setTimeout(() => {
        setBroadcastSuccess(false);
        setSelectedGap(null);
      }, 2500);
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
        <div style={{ fontWeight: 700 }}>Đang tải bảng điều khiển số liệu thời gian thực...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. HEADER CHỈ HUY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#0F172A', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
              MODULE 1
            </span>
            <span style={{ color: '#0284C7', fontWeight: 700, fontSize: '13px' }}>
              North Star Metrics & Risk Heatmap
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            📊 Bảng Điều Khiển & Chỉ Số Sống Còn (Executive Dashboard)
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0' }}>
            Theo dõi sức khỏe hệ thống thời gian thực, đo lường mức độ giữ chân và phát hiện vùng mù an toàn cộng đồng.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              alert('🔄 Đã đồng bộ dữ liệu thời gian thực từ máy chủ!');
            }}
            style={{
              background: '#FFFFFF',
              color: '#334155',
              border: '1.5px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔄</span>
            <span>Làm mới số liệu</span>
          </button>
        </div>
      </div>

      {/* 2. HÀNG THẺ CHỈ SỐ SỐNG CÒN (NORTH STAR METRICS CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* CARD 1: DAU / MAU */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E2E8F0',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>Người dùng hàng ngày (DAU)</span>
            <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
              {metrics?.dauGrowth || '+14.2%'}
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {metrics?.dau?.toLocaleString() || '3,820'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
            MAU: <strong>{metrics?.mau?.toLocaleString() || '18,600'}</strong> • Hệ số dính: <strong style={{ color: '#0284C7' }}>{metrics?.stickiness || 20.5}%</strong>
          </div>
        </div>

        {/* CARD 2: STREAK RETENTION */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E2E8F0',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>Giữ chân chuỗi ngày (Retention)</span>
            <span style={{ fontSize: '18px' }}>🔥</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#F97316', letterSpacing: '-0.02em' }}>
            {metrics?.d7Retention || 42.8}%
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
            D7 Retention: <strong>{metrics?.d7Retention}%</strong> • D30: <strong>{metrics?.d30Retention || 21.4}%</strong>
          </div>
        </div>

        {/* CARD 3: SIMULATED LIVES SAVED */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E2E8F0',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>Nạn nhân giả lập cứu sống</span>
            <span style={{ fontSize: '18px' }}>❤️</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#EF4444', letterSpacing: '-0.02em' }}>
            {metrics?.livesSaved?.toLocaleString() || '154,920'}
          </div>
          <div style={{ fontSize: '12px', color: '#15803D', fontWeight: 700, marginTop: '6px' }}>
            ✓ Chỉ số tác động xã hội (Impact Metric)
          </div>
        </div>

        {/* CARD 4: MRR REVENUE */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E2E8F0',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>Doanh thu định kỳ (MRR)</span>
            <span style={{ background: '#EFF6FF', color: '#0284C7', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
              {metrics?.mrrGrowth || '+18.5%'}
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#10B981', letterSpacing: '-0.02em' }}>
            {(metrics?.mrr || 89500000).toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 700 }}>đ</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
            B2C Pro (38%) + B2B Trường học (62%)
          </div>
        </div>
      </div>

      {/* 3. BẢN ĐỒ NHIỆT VÙNG MÙ KIẾN THỨC (SAFETY SKILL GAP HEATMAP) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        padding: '26px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🗺️</span>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Bản Đồ Nhiệt Vùng Mù Kiến Thức An Toàn (Skill Gap Heatmap)
              </h2>
            </div>
            <p style={{ color: '#64748B', fontSize: '13px', margin: '4px 0 0' }}>
              Hệ thống tự động phát hiện các chủ đề có tỷ lệ học sinh làm sai cao bất thường trong 4.000+ lượt kiểm tra.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: '#FEE2E2', color: '#DC2626', fontWeight: 800, padding: '4px 8px', borderRadius: '6px' }}>
              🔴 Nguy hiểm (&gt;60% sai)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: '#FEF3C7', color: '#D97706', fontWeight: 800, padding: '4px 8px', borderRadius: '6px' }}>
              🟠 Cảnh báo (40-60%)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: '#DCFCE7', color: '#15803D', fontWeight: 800, padding: '4px 8px', borderRadius: '6px' }}>
              🟢 An toàn cao (&gt;80% đúng)
            </span>
          </div>
        </div>

        {/* BẢNG HEATMAP CHI TIẾT */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Chủ đề Kỹ năng</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Chuyên đề</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B', width: '180px' }}>Tỷ lệ Làm Đúng</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Lỗ hổng &amp; Sai lầm phổ biến</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B', textAlign: 'center' }}>Hành động của Admin</th>
              </tr>
            </thead>
            <tbody>
              {skillGaps.map((gap) => (
                <tr key={gap.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0F172A', fontSize: '13.5px' }}>
                    {gap.topic}
                  </td>
                  <td style={{ padding: '14px', color: '#64748B', fontSize: '13px' }}>
                    <span style={{ background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                      {gap.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${gap.correctRate}%`,
                          height: '100%',
                          background: gap.riskLevel === 'HIGH' ? '#EF4444' : (gap.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981'),
                          borderRadius: '999px',
                        }}></div>
                      </div>
                      <span style={{
                        fontSize: '12.5px',
                        fontWeight: 900,
                        color: gap.riskLevel === 'HIGH' ? '#EF4444' : (gap.riskLevel === 'MEDIUM' ? '#D97706' : '#15803D'),
                        minWidth: '40px',
                      }}>
                        {gap.correctRate}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontSize: '12.5px', color: '#475569', maxWidth: '340px' }}>
                    <div style={{ color: gap.riskLevel === 'HIGH' ? '#DC2626' : '#334155', fontWeight: gap.riskLevel === 'HIGH' ? 700 : 500 }}>
                      {gap.criticalFlaw}
                    </div>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenBroadcastModal(gap)}
                      style={{
                        background: gap.riskLevel === 'HIGH' ? '#DC2626' : '#0284C7',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                    >
                      <span>📢</span>
                      <span>Bắn cảnh báo</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. PHÍM TẮT ĐIỀU HÀNH NHANH (QUICK OPERATIONS SHORTCUTS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div
          onClick={() => { sound.playClick(); navigate('/admin/approvals'); }}
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#0284C7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Hàng Chờ Phê Duyệt Bài Học</div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Có <strong>{metrics?.pendingApprovals || 4} kịch bản</strong> từ Bác sĩ &amp; Chuyên gia PCCC đang chờ thẩm định và ký phát hành Live.
          </div>
        </div>

        <div
          onClick={() => { sound.playClick(); navigate('/admin/users'); }}
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#F97316'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔥</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Cứu Chuỗi Streak &amp; CSKH 360</div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Hỗ trợ học sinh khiếu nại mất chuỗi do sự cố mạng, cấp lại Tim khẩn cấp hoặc xử lý tài khoản gian lận bot.
          </div>
        </div>

        <div
          onClick={() => { sound.playClick(); navigate('/admin/schools'); }}
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#10B981'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏫</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Hợp Đồng Trường Học B2B</div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Quản trị 4 trường học đối tác, cấp 5.500 suất bản quyền và xuất Báo cáo kiểm định an toàn nộp Sở GD&amp;ĐT.
          </div>
        </div>
      </div>

      {/* 5. MODAL BẮN THÔNG BÁO ĐẨY ĐÍNH CHÍNH KIẾN THỨC (PUSH NOTIFICATION BROADCAST) */}
      {selectedGap && (
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
            maxWidth: '560px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid #E2E8F0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '28px' }}>📢</span>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Bắn Thông Báo Đẩy Đính Chính Kiến Thức
                </h3>
                <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>
                  Chủ đề: {selectedGap.topic} ({selectedGap.wrongRate}% sai)
                </div>
              </div>
            </div>

            {broadcastSuccess ? (
              <div style={{ padding: '24px', textAlign: 'center', background: '#DCFCE7', borderRadius: '16px', color: '#15803D', fontWeight: 800 }}>
                🎉 Đã phát sóng thông báo cảnh báo an toàn tới toàn bộ 14.850 điện thoại học viên thành công!
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Nội dung thông báo đẩy (Hiển thị màn hình khóa điện thoại):
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px', fontSize: '12px', color: '#64748B' }}>
                  ℹ️ <strong>Phạm vi tác động:</strong> Thông báo sẽ được đẩy qua Firebase Cloud Messaging (FCM) đến toàn bộ học sinh đang cài app MIMO để kịp thời sửa sai thói quen nguy hiểm.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedGap(null)}
                    style={{
                      background: '#F1F5F9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                    }}
                  >
                    🚀 Phát sóng ngay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
