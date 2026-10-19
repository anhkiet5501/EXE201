import React, { useState, useEffect } from 'react';
import { businessService } from '../../services/modules/businessService';
import { sound } from '../../utils/audioEffects';

export default function BusinessReportsPage() {
  const [reports, setReports] = useState([]);
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    businessService.getAuditReports().then((res) => {
      if (res?.data) setReports(res.data);
    });
  }, []);

  const sampleCertificates = [
    { id: 'cert_1', studentName: 'Nguyễn Văn Học', classCode: 'FPT-10A1', score: 95, date: '2026-10-18', qrCode: 'MIMO-CERT-88419' },
    { id: 'cert_2', studentName: 'Lê Gia Huy', classCode: 'FPT-10A1', score: 100, date: '2026-10-18', qrCode: 'MIMO-CERT-88420' },
    { id: 'cert_3', studentName: 'Đoàn Nhật Nam', classCode: 'FPT-10TIN', score: 98, date: '2026-10-17', qrCode: 'MIMO-CERT-88421' },
    { id: 'cert_4', studentName: 'Bùi Kim Ngân', classCode: 'FPT-11A1', score: 92, date: '2026-10-16', qrCode: 'MIMO-CERT-88422' },
    { id: 'cert_5', studentName: 'Trần Bảo An', classCode: 'FPT-10A1', score: 90, date: '2026-10-15', qrCode: 'MIMO-CERT-88423' },
  ];

  const handleExportPDF = () => {
    sound.playVictory();
    alert('📥 Đang tải xuống Báo Cáo Kiểm Định Tuân Thủ PCCC Học Đường (PDF) có đóng dấu số...');
  };

  const handleExportExcel = () => {
    sound.playVictory();
    alert('📥 Đang tải xuống Danh sách 356 học sinh đạt chuẩn kiểm định an toàn (Excel)...');
  };

  const handleViewCert = (cert) => {
    sound.playClick();
    setSelectedStudent(cert);
    setShowCertModal(true);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="biz-page-header">
        <div>
          <h1 className="biz-page-title">
            <span>📜</span>
            <span>Báo Cáo Kiểm Định & Chứng Chỉ Số</span>
          </h1>
          <p className="biz-page-subtitle">
            Hồ sơ kiểm định tuân thủ an toàn PCCC học đường nộp Sở GD&ĐT, Phòng GD và Công an PCCC
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="biz-btn-secondary" onClick={handleExportExcel}>
            <span>📊</span>
            <span>Xuất Excel Danh Sách</span>
          </button>

          <button type="button" className="biz-btn-primary" onClick={handleExportPDF}>
            <span>📄</span>
            <span>Xuất Báo Cáo Kiểm Định (PDF)</span>
          </button>
        </div>
      </div>

      {/* BÁO CÁO KIỂM ĐỊNH NIÊN KHÓA */}
      <div className="biz-card">
        <div className="biz-card-title">
          <span>🏛️ Báo Cáo Kiểm Định Tuân Thủ Chính Thức</span>
          <span style={{ fontSize: '12px', background: '#DCFCE7', color: '#15803D', padding: '4px 8px', borderRadius: '6px', fontWeight: 800 }}>
            ĐÃ KÝ DUYỆT SỐ
          </span>
        </div>

        {reports.map((rep) => (
          <div key={rep.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              {rep.title}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px', fontSize: '13px' }}>
              <div>📅 Ngày phát hành: <strong>{rep.issuedDate}</strong></div>
              <div>🎓 Tổng học sinh đạt chuẩn: <strong style={{ color: '#15803D' }}>{rep.certifiedCount} em</strong></div>
              <div>📈 Tỷ lệ hoàn thành: <strong style={{ color: '#0284C7' }}>{rep.passRate}</strong></div>
              <div>⚖️ Đơn vị kiểm định: <strong>{rep.verifier}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* KHO CHỨNG CHỈ SỐ CỦA HỌC SINH */}
      <div className="biz-card">
        <div className="biz-card-title">
          <span>🎓 Kho Chứng Chỉ An Toàn Số (Mã QR Định Danh)</span>
          <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>
            Hiển thị 5 / 356 chứng chỉ mới nhất
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '10px 12px' }}>HỌ TÊN HỌC SINH</th>
                <th style={{ padding: '10px 12px' }}>LỚP</th>
                <th style={{ padding: '10px 12px' }}>ĐIỂM AN TOÀN</th>
                <th style={{ padding: '10px 12px' }}>NGÀY CẤP</th>
                <th style={{ padding: '10px 12px' }}>MÃ QR ĐỊNH DANH</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {sampleCertificates.map((cert) => (
                <tr key={cert.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0F172A' }}>
                    {cert.studentName}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                      {cert.classCode}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#15803D' }}>
                    {cert.score} / 100 điểm
                  </td>
                  <td style={{ padding: '10px 12px', color: '#64748B' }}>
                    {cert.date}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <code style={{ background: '#F1F5F9', color: '#0F172A', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                      {cert.qrCode}
                    </code>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <button
                      type="button"
                      className="biz-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                      onClick={() => handleViewCert(cert)}
                    >
                      👁️ Xem Bằng Khen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL XEM BẰNG KHEN / CHỨNG CHỈ */}
      {showCertModal && selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '28px', width: '560px', maxWidth: '95%', textAlign: 'center', border: '6px double #0284C7' }}>
            <div style={{ fontSize: '36px' }}>🎖️</div>
            <h2 style={{ margin: '8px 0 4px', fontSize: '20px', fontWeight: 900, color: '#0284C7', textTransform: 'uppercase' }}>
              CHỨNG NHẬN KỸ NĂNG SINH TỒN & PCCC
            </h2>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
              TRƯỜNG THPT FPT CẦN THƠ • HỆ THỐNG MIMO
            </div>

            <div style={{ margin: '20px 0', padding: '14px', background: '#F8FAFC', borderRadius: '10px' }}>
              <div style={{ fontSize: '14px', color: '#475569' }}>Chứng nhận em:</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '4px 0' }}>
                {selectedStudent.studentName}
              </div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>
                Học sinh lớp: <strong>{selectedStudent.classCode}</strong> • Đạt kết quả xuất sắc: <strong>{selectedStudent.score}/100 điểm</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#EFF6FF', borderRadius: '8px', fontSize: '12px', color: '#1E40AF', textAlign: 'left' }}>
              <div>
                <div>Mã chứng nhận: <strong>{selectedStudent.qrCode}</strong></div>
                <div>Ngày ký phát hành: {selectedStudent.date}</div>
              </div>
              <div style={{ fontSize: '32px' }}>📱</div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                type="button"
                className="biz-btn-secondary"
                onClick={() => setShowCertModal(false)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="biz-btn-primary"
                onClick={() => {
                  sound.playVictory();
                  alert('🖨️ Đang in chứng chỉ PDF...');
                }}
              >
                🖨️ In Chứng Chỉ Này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
