import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { curatorService } from '../../services/modules/curatorService';

export default function CuratorAnalyticsPage() {
  const [searchParams] = useSearchParams();
  const selectedScenId = searchParams.get('id') || 'scen_01';

  const [analytics, setAnalytics] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      curatorService.getAnalytics(selectedScenId),
      curatorService.getScenarios(),
    ])
      .then(([anaRes, scenRes]) => {
        setAnalytics(anaRes.data);
        setScenarios(scenRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedScenId]);

  if (loading || !analytics) {
    return <div style={{ color: '#c084fc', padding: '40px' }}>Đang tải dữ liệu phân tích học thuật...</div>;
  }

  return (
    <div className="curator-analytics-page">
      <style>{`
        .curator-analytics-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #150e29;
          border: 1px solid #2e1852;
          padding: 20px 24px;
          border-radius: 16px;
        }

        .analytics-header h1 {
          font-size: 20px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 4px;
        }

        .analytics-header p {
          color: #c084fc;
          font-size: 13px;
          margin: 0;
        }

        .scenario-selector-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .scenario-select-dropdown {
          background: #1f143a;
          border: 1px solid #4a277c;
          border-radius: 10px;
          padding: 9px 14px;
          color: #f8fafc;
          font-size: 13px;
          font-weight: 700;
          outline: none;
        }

        /* ─── 4 CHỈ SỐ LỚN ─── */
        .analytics-kpis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .kpi-stat-card {
          background: #170e2c;
          border: 1px solid #2f1954;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .kpi-lbl {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .kpi-val {
          font-size: 26px;
          font-weight: 900;
          color: #f8fafc;
        }

        .kpi-sub {
          font-size: 11px;
          color: #4ade80;
          font-weight: 600;
        }

        /* ─── AI DATA INSIGHT CALLOUT ─── */
        .ai-insight-box {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(147, 51, 234, 0.12));
          border: 1.5px solid #ef4444;
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          gap: 18px;
          align-items: flex-start;
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.15);
        }

        .ai-insight-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .ai-insight-body h3 {
          font-size: 15px;
          font-weight: 900;
          color: #f87171;
          margin: 0 0 6px;
        }

        .ai-insight-body p {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.5;
          margin: 0 0 10px;
        }

        .ai-insight-recom {
          background: rgba(0, 0, 0, 0.3);
          border-left: 3px solid #facc15;
          padding: 8px 12px;
          border-radius: 0 8px 8px 0;
          font-size: 12.5px;
          color: #fde047;
          font-weight: 600;
        }

        /* ─── PHÂN TÍCH TỪNG CÂU HỎI ─── */
        .questions-breakdown-card {
          background: #140d28;
          border: 1px solid #2b184f;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-headline {
          font-size: 15px;
          font-weight: 800;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .question-stat-row {
          background: #1a1033;
          border: 1px solid #341d59;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .q-header-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .q-title {
          font-size: 14px;
          font-weight: 800;
          color: #f1f5f9;
        }

        .q-rates {
          display: flex;
          gap: 12px;
          font-size: 13px;
          font-weight: 800;
        }

        .rate-correct { color: #4ade80; }
        .rate-wrong { color: #f87171; }

        .progress-bar-stack {
          width: 100%;
          height: 12px;
          background: #ef4444;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
        }

        .bar-correct-fill {
          height: 100%;
          background: #22c55e;
          border-radius: 10px 0 0 10px;
        }

        .q-misconception {
          font-size: 12px;
          color: #a78bfa;
          background: #120924;
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1>📈 Phân Tích Hiệu Quả Nội Dung & Độ Khó (Content Analytics)</h1>
          <p>Dữ liệu phản hồi thực tế từ học sinh giúp phát hiện điểm nghẽn nhận thức</p>
        </div>

        <div className="scenario-selector-wrap">
          <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '700' }}>Chọn kịch bản:</span>
          <select
            className="scenario-select-dropdown"
            value={selectedScenId}
            onChange={(e) => window.location.href = `/studio/analytics?id=${e.target.value}`}
          >
            {scenarios.map((scen) => (
              <option key={scen.id} value={scen.id}>
                {scen.lessonCode} — {scen.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="analytics-kpis-grid">
        <div className="kpi-stat-card">
          <span className="kpi-lbl">👥 Tổng lượt học sinh tham gia</span>
          <span className="kpi-val">{analytics.totalAttempts.toLocaleString()}</span>
          <span className="kpi-sub">↑ 18% so với tuần trước</span>
        </div>

        <div className="kpi-stat-card">
          <span className="kpi-lbl">⭐ Đánh giá độ hữu ích</span>
          <span className="kpi-val">{analytics.ratingScore} / 5.0</span>
          <span className="kpi-sub">Dựa trên 3.420 đánh giá</span>
        </div>

        <div className="kpi-stat-card">
          <span className="kpi-lbl">🎯 Tỷ lệ hoàn thành trọn bài</span>
          <span className="kpi-val">{analytics.completionRate}%</span>
          <span className="kpi-sub">Tỷ lệ giữ chân rất cao</span>
        </div>

        <div className="kpi-stat-card">
          <span className="kpi-lbl">⏱️ Thời gian phản xạ TB</span>
          <span className="kpi-val">{analytics.avgResponseTime} giây</span>
          <span className="kpi-sub">Phản xạ nhanh đạt chuẩn</span>
        </div>
      </div>

      {/* AI Data Insights Alert */}
      <div className="ai-insight-box">
        <div className="ai-insight-icon">💡</div>
        <div className="ai-insight-body">
          <h3>{analytics.aiInsight.title}</h3>
          <p>{analytics.aiInsight.description}</p>
          <div className="ai-insight-recom">
            {analytics.aiInsight.recommendation}
          </div>
        </div>
      </div>

      {/* Phân tích tỷ lệ đúng / sai từng câu hỏi */}
      <div className="questions-breakdown-card">
        <div className="section-headline">
          <span>📊 BIỂU ĐỒ TỶ LỆ TRẢ LỜI ĐÚNG / SAI TỪNG CÂU HỎI TRONG BÀI</span>
          <Link
            to={`/studio/builder?id=${selectedScenId}`}
            style={{
              fontSize: '12px',
              color: '#c084fc',
              textDecoration: 'none',
              fontWeight: '700',
            }}
          >
            Chỉnh sửa câu hỏi trong Builder →
          </Link>
        </div>

        {analytics.questionBreakdown.map((q) => (
          <div key={q.questionId} className="question-stat-row">
            <div className="q-header-line">
              <span className="q-title">{q.label}</span>
              <div className="q-rates">
                <span className="rate-correct">ĐÚNG: {q.correctRate}%</span>
                <span className="rate-wrong">SAI: {q.wrongRate}%</span>
              </div>
            </div>

            {/* Progress Stack */}
            <div className="progress-bar-stack">
              <div className="bar-correct-fill" style={{ width: `${q.correctRate}%` }} />
            </div>

            <div className="q-misconception">
              <span>⚠️ Điểm sai phổ biến nhất:</span>
              <strong style={{ color: '#f87171' }}>{q.topMisconception}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
