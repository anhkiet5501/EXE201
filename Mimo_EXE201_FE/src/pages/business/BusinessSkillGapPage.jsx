import React, { useState, useEffect } from 'react';
import { businessService } from '../../services/modules/businessService';
import { sound } from '../../utils/audioEffects';

export default function BusinessSkillGapPage() {
  const [skillGaps, setSkillGaps] = useState([]);

  useEffect(() => {
    businessService.getSkillGapAnalysis().then((res) => {
      if (res?.data) setSkillGaps(res.data);
    });
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="biz-page-header">
        <div>
          <h1 className="biz-page-title">
            <span>⚠️</span>
            <span>Bản Đồ Lỗ Hổng Kỹ Năng & Phân Tích Rủi Ro (Red Flags)</span>
          </h1>
          <p className="biz-page-subtitle">
            Phân tích tự động những câu hỏi tình huống học sinh làm sai nhiều nhất để BGH và Giáo viên tập huấn kịp thời
          </p>
        </div>

        <button
          type="button"
          className="biz-btn-secondary"
          onClick={() => {
            sound.playClick();
            alert('📄 Đang xuất Phiếu Hướng Dẫn Khắc Phục Dán Bảng Tin Trường (PDF)...');
          }}
        >
          <span>🖨️</span>
          <span>In Hướng Dẫn Khắc Phục</span>
        </button>
      </div>

      {/* DANH SÁCH LỖ HỔNG KỸ NĂNG */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {skillGaps.map((item, index) => (
          <div
            key={item.id}
            className="biz-card"
            style={{
              margin: 0,
              borderLeft: '5px solid #EF4444',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                    #{index + 1} • {item.topic}
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#DC2626', fontWeight: 700 }}>
                    Tỷ lệ trả lời sai toàn trường:
                  </span>
                </div>

                <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
                  {item.question}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '30px', fontWeight: 900, color: '#DC2626' }}>
                  {item.failRate}%
                </div>
                <div style={{ fontSize: '11.5px', color: '#991B1B', fontWeight: 700 }}>
                  Học sinh chưa đạt chuẩn
                </div>
              </div>
            </div>

            {/* CHI TIẾT LỖI SAI & LỚP YẾU NHẤT */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: '#FFF1F2', border: '1px solid #FFE4E6', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#BE123C', marginBottom: '4px' }}>
                  ❌ LỖI HIỂU SAI PHỔ BIẾN NHẤT:
                </div>
                <div style={{ fontSize: '13px', color: '#4C0519' }}>
                  {item.commonMistake}
                </div>
              </div>

              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', marginBottom: '4px' }}>
                  🏫 LỚP CẦN HỖ TRỢ GẤP:
                </div>
                <div style={{ fontSize: '13px', color: '#78350F', fontWeight: 700 }}>
                  {item.worstClass}
                </div>
              </div>
            </div>

            {/* KHUYẾN NGHỊ SƯ PHẠM */}
            <div
              style={{
                marginTop: '14px',
                padding: '12px 16px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <strong>💡 Khuyến nghị cho Giáo viên:</strong> {item.expertAdvice}
              </div>

              <button
                type="button"
                className="biz-btn-primary"
                style={{ padding: '6px 12px', fontSize: '12px', background: '#16A34A' }}
                onClick={() => {
                  sound.playClick();
                  alert(`📢 Đã gửi bài học tăng cường "${item.topic}" về cho lớp ${item.worstClass}!`);
                }}
              >
                Giao bài tập ôn gấp →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
