import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { curatorService } from '../../services/modules/curatorService';

export default function CuratorGuidelinesPage() {
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    curatorService.getGuidelines()
      .then((res) => setGuidelines(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="curator-guidelines-page">
      <style>{`
        .curator-guidelines-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .guide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #150e29;
          border: 1px solid #2e1852;
          padding: 20px 24px;
          border-radius: 16px;
        }

        .guide-header h1 {
          font-size: 20px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 4px;
        }

        .guide-header p {
          color: #c084fc;
          font-size: 13px;
          margin: 0;
        }

        .btn-start-writing {
          background: linear-gradient(135deg, #9333ea, #7c3aed);
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(147, 51, 234, 0.35);
        }

        /* ─── WORKFLOW STEPS ─── */
        .workflow-card {
          background: #140d28;
          border: 1px solid #2b184f;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .workflow-title {
          font-size: 16px;
          font-weight: 800;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .workflow-steps-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .wf-step-box {
          background: #1c1136;
          border: 1px solid #381f5e;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        .wf-step-num {
          font-size: 11px;
          font-weight: 800;
          color: #c084fc;
          background: rgba(147, 51, 234, 0.2);
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wf-step-heading {
          font-size: 13px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .wf-step-desc {
          font-size: 11.5px;
          color: #94a3b8;
          line-height: 1.4;
        }

        /* ─── GUIDELINE DETAIL CARDS ─── */
        .guidelines-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .guideline-card {
          background: #140d28;
          border: 1px solid #2b184f;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .gl-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(147, 51, 234, 0.2);
          border: 1px solid #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .gl-title {
          font-size: 16px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0;
        }

        .gl-desc {
          font-size: 12.5px;
          color: #cbd5e1;
          line-height: 1.5;
          margin: 0;
        }

        .gl-points-list {
          margin: 0;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
          color: #a78bfa;
          line-height: 1.45;
        }
      `}</style>

      {/* Header */}
      <div className="guide-header">
        <div>
          <h1>📜 Quy Chuẩn & Cẩm Nang Biên Soạn (Curator Guidelines)</h1>
          <p>Bộ tiêu chuẩn tạo dựng kịch bản micro-learning chuẩn y khoa & giáo dục sinh tồn của MIMO</p>
        </div>

        <Link to="/studio/builder" className="btn-start-writing">
          <span>✍️</span>
          <span>Bắt đầu Soạn Bài Ngay</span>
        </Link>
      </div>

      {/* Quy trình biên soạn & phê duyệt */}
      <div className="workflow-card">
        <div className="workflow-title">
          <span>🔄 QUY TRÌNH BIÊN SOẠN & PHÊ DUYỆT BÀI HỌC 5 BƯỚC (CONTENT WORKFLOW)</span>
        </div>

        <div className="workflow-steps-row">
          <div className="wf-step-box">
            <div className="wf-step-num">1</div>
            <div className="wf-step-heading">Tạo Chặng & Tình huống</div>
            <div className="wf-step-desc">
              Phân định rõ ngữ cảnh khẩn cấp đời thực 2-3 câu ngắn gọn.
            </div>
          </div>

          <div className="wf-step-box">
            <div className="wf-step-num">2</div>
            <div className="wf-step-heading">Soạn Đáp Án Y Khoa</div>
            <div className="wf-step-desc">
              Viết giải thích khoa học khi đúng & cảnh báo hiểm họa khi sai.
            </div>
          </div>

          <div className="wf-step-box">
            <div className="wf-step-num">3</div>
            <div className="wf-step-heading">Chơi Thử Mobile Sim</div>
            <div className="wf-step-desc">
              Trực tiếp bấm thử nghiệm xem giao diện và câu chữ có vừa vặn không.
            </div>
          </div>

          <div className="wf-step-box">
            <div className="wf-step-num">4</div>
            <div className="wf-step-heading">Hội Đồng Y Khoa Duyệt</div>
            <div className="wf-step-desc">
              Thẩm định chéo phác đồ và Super Admin ký duyệt xuất bản.
            </div>
          </div>

          <div className="wf-step-box" style={{ borderColor: '#22c55e', background: 'rgba(34, 197, 94, 0.08)' }}>
            <div className="wf-step-num" style={{ background: '#22c55e', color: '#fff' }}>5</div>
            <div className="wf-step-heading" style={{ color: '#4ade80' }}>Xuất Bản Live</div>
            <div className="wf-step-desc">
              Hàng vạn học sinh trường học nhận thông báo và bắt đầu luyện phản xạ!
            </div>
          </div>
        </div>
      </div>

      {/* 3 Nguyên tắc then chốt */}
      <div className="guidelines-grid">
        {guidelines.map((gl, idx) => (
          <div key={gl.id} className="guideline-card">
            <div className="gl-icon-badge">
              {idx === 0 ? '⏱️' : idx === 1 ? '🛡️' : '🧠'}
            </div>

            <h3 className="gl-title">{gl.title}</h3>
            <p className="gl-desc">{gl.description}</p>

            <ul className="gl-points-list">
              {gl.keyPoints.map((pt, pIdx) => (
                <li key={pIdx}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
