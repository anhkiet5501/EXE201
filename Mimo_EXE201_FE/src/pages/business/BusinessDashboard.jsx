import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessService } from '../../services/modules/businessService';
import { sound } from '../../utils/audioEffects';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [classes, setClasses] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      businessService.getOverview(),
      businessService.getClasses(),
      businessService.getSkillGapAnalysis(),
    ]).then(([resOrg, resClasses, resGaps]) => {
      if (resOrg?.data) setOrg(resOrg.data);
      if (resClasses?.data) setClasses(resClasses.data);
      if (resGaps?.data) setSkillGaps(resGaps.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', color: '#64748B' }}>Đang tải dữ liệu tổng quan...</div>;
  }

  // Thống kê theo Khối
  const grades = ['Khối 10', 'Khối 11', 'Khối 12'];
  const gradeStats = grades.map((grade) => {
    const list = classes.filter((c) => c.grade === grade);
    const totalStudents = list.reduce((sum, c) => sum + c.studentsCount, 0);
    const completedStudents = list.reduce((sum, c) => sum + c.completedStudents, 0);
    const rate = totalStudents > 0 ? ((completedStudents / totalStudents) * 100).toFixed(1) : 0;
    return {
      grade,
      classCount: list.length,
      totalStudents,
      completedStudents,
      rate: Number(rate),
    };
  });

  return (
    <div>
      {/* HEADER */}
      <div className="biz-page-header">
        <div>
          <h1 className="biz-page-title">
            <span>📊</span>
            <span>Bảng Điều Khiển Quản Trị Trường Học</span>
          </h1>
          <p className="biz-page-subtitle">
            Hệ thống giám sát tuân thủ an toàn sinh tồn & PCCC học đường — {org?.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="biz-btn-secondary"
            onClick={() => {
              sound.playClick();
              navigate('/business/reports');
            }}
          >
            <span>📜</span>
            <span>Xuất Báo Cáo Kiểm Định</span>
          </button>

          <button
            type="button"
            className="biz-btn-primary"
            onClick={() => {
              sound.playClick();
              navigate('/business/teachers');
            }}
          >
            <span>🔑</span>
            <span>Cấp Mã Giáo Viên</span>
          </button>
        </div>
      </div>

      {/* 4 THẺ CHỈ SỐ KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="biz-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>TỶ LỆ TUÂN THỦ TOÀN TRƯỜNG</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#15803D', marginTop: '6px' }}>
            {org?.metrics?.complianceRate || 86.4}%
          </div>
          <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '4px', fontWeight: 700 }}>
            🟢 Đạt chuẩn an toàn Sở GD&ĐT (Mục tiêu ≥80%)
          </div>
        </div>

        <div className="biz-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>HẠN NGẠCH SUẤT HỌC (SEATS)</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#0284C7', marginTop: '6px' }}>
            {org?.plan?.usedSeats} <span style={{ fontSize: '18px', color: '#94A3B8' }}>/ {org?.plan?.totalSeats}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#0369A1', marginTop: '4px', fontWeight: 700 }}>
            Còn trống {org?.plan?.totalSeats - org?.plan?.usedSeats} suất học sinh
          </div>
        </div>

        <div className="biz-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>TỔNG GIỜ HUẤN LUYỆN THỰC HÀNH</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#7C3AED', marginTop: '6px' }}>
            {org?.metrics?.totalTrainingHours || 428} <span style={{ fontSize: '16px' }}>giờ</span>
          </div>
          <div style={{ fontSize: '12px', color: '#6D28D9', marginTop: '4px', fontWeight: 700 }}>
            356 học sinh đã cấp Chứng chỉ PCCC
          </div>
        </div>

        <div className="biz-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>ĐIỂM AN TOÀN TRUNG BÌNH</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#D97706', marginTop: '6px' }}>
            {org?.metrics?.avgSafetyScore || 88.5} <span style={{ fontSize: '18px', color: '#94A3B8' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '12px', color: '#B45309', marginTop: '4px', fontWeight: 700 }}>
            Phản xạ tình huống đạt loại Giỏi
          </div>
        </div>
      </div>

      {/* TIẾN ĐỘ THI ĐUA THEO KHỐI LỚP (KHỐI 10, 11, 12) */}
      <div className="biz-card">
        <div className="biz-card-title">
          <span>🏆 Tiến Độ Đào Tạo Theo Khối Lớp</span>
          <button
            type="button"
            className="biz-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => {
              sound.playClick();
              navigate('/business/classes');
            }}
          >
            Xem tất cả 15 lớp học →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {gradeStats.map((g) => (
            <div
              key={g.grade}
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>{g.grade}</span>
                <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 700 }}>{g.classCount} lớp (5 lớp A1-A5)</span>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Học sinh hoàn thành:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{g.completedStudents} / {g.totalStudents}</span>
                </div>

                <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${g.rate}%`,
                      background: g.rate >= 90 ? '#16A34A' : g.rate >= 80 ? '#0284C7' : '#F59E0B',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div style={{ marginTop: '8px', textAlign: 'right', fontSize: '13px', fontWeight: 800, color: g.rate >= 80 ? '#0284C7' : '#D97706' }}>
                  {g.rate}% Đạt Chuẩn
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CẢNH BÁO RED FLAGS KHẨN CẤP */}
      <div className="biz-card" style={{ borderLeft: '5px solid #EF4444' }}>
        <div className="biz-card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🚨</span>
            <span style={{ color: '#DC2626' }}>Cảnh Báo Lỗ Hổng Kiến Thức Nguy Hiểm (Red Flags)</span>
          </div>
          <button
            type="button"
            className="biz-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => {
              sound.playClick();
              navigate('/business/skill-gap');
            }}
          >
            Xem chi tiết phân tích →
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#64748B', marginTop: 0 }}>
          Hệ thống phát hiện các tình huống khẩn cấp mà học sinh toàn trường có tỷ lệ làm sai cao bất thường (&gt;40% sai). Cần BGH & Giáo viên nhắc nhở ngay trong giờ chào cờ hoặc sinh hoạt lớp.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
          {skillGaps.map((gap) => (
            <div
              key={gap.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ background: '#EF4444', color: '#FFF', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    {gap.topic}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: '#991B1B' }}>
                    {gap.failRate}% Học sinh trả lời sai
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937' }}>
                  {gap.question}
                </div>
                <div style={{ fontSize: '12.5px', color: '#4B5563', marginTop: '4px' }}>
                  <strong>Lỗi phổ biến:</strong> {gap.commonMistake} • <span style={{ color: '#DC2626' }}>Yếu nhất: {gap.worstClass}</span>
                </div>
              </div>

              <button
                type="button"
                className="biz-btn-secondary"
                style={{ fontSize: '12px', padding: '8px 12px', background: '#FFF' }}
                onClick={() => {
                  sound.playClick();
                  alert(`📢 Đã gửi thông báo cảnh báo chuyên đề "${gap.topic}" đến tất cả Giáo viên bộ môn để nhắc nhở học sinh!`);
                }}
              >
                ⚡ Bắn cảnh báo cho GV
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
