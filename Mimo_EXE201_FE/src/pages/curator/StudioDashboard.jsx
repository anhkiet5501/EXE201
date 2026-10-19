import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { curatorService } from '../../services/modules/curatorService';

export default function StudioDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([curatorService.getProfile(), curatorService.getScenarios()])
      .then(([profRes, scenRes]) => {
        setProfile(profRes.data);
        setScenarios(scenRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Bộ lọc
  const filteredScenarios = scenarios.filter((scen) => {
    const matchDomain = selectedDomain === 'ALL' || scen.domain === selectedDomain;
    const matchStatus = selectedStatus === 'ALL' || scen.status === selectedStatus;
    const matchSearch =
      scen.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scen.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scen.lessonCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDomain && matchStatus && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="scen-badge badge-green">🟢 Đã xuất bản (Live)</span>;
      case 'PENDING':
        return <span className="scen-badge badge-orange">🟠 Chờ kiểm duyệt</span>;
      case 'DRAFT':
        return <span className="scen-badge badge-yellow">🟡 Bản nháp</span>;
      case 'REVISION':
        return <span className="scen-badge badge-red">🔴 Cần cập nhật</span>;
      default:
        return <span className="scen-badge badge-gray">{status}</span>;
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'EASY':
        return <span className="diff-badge diff-easy">Dễ (Cơ bản)</span>;
      case 'MEDIUM':
        return <span className="diff-badge diff-medium">Vừa (Phổ biến)</span>;
      case 'HARD':
        return <span className="diff-badge diff-hard">Khó (Khẩn cấp)</span>;
      default:
        return null;
    }
  };

  return (
    <div className="scen-repo-page">
      <style>{`
        .scen-repo-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ─── BANNER CHUYÊN GIA ─── */
        .curator-hero-card {
          background: linear-gradient(135deg, #1f1238, #160c2b);
          border: 1px solid #3b1d6e;
          border-radius: 20px;
          padding: 28px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .curator-hero-card::after {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.25), transparent 70%);
          pointer-events: none;
        }

        .curator-hero-left {
          display: flex;
          align-items: center;
          gap: 20px;
          z-index: 1;
        }

        .curator-avatar-large {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 3px solid #a855f7;
          object-fit: cover;
          box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
        }

        .curator-hero-info h1 {
          font-size: 24px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 6px 0;
        }

        .curator-hero-info p {
          color: #c084fc;
          font-size: 13.5px;
          margin: 0 0 10px 0;
        }

        .curator-tags-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .curator-tag-pill {
          background: rgba(147, 51, 234, 0.2);
          border: 1px solid #7c3aed;
          color: #e9d5ff;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 600;
        }

        .curator-hero-actions {
          display: flex;
          gap: 12px;
          z-index: 1;
        }

        .btn-create-scenario {
          background: linear-gradient(135deg, #9333ea, #7c3aed);
          color: #ffffff;
          padding: 12px 22px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(147, 51, 234, 0.4);
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-create-scenario:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(147, 51, 234, 0.6);
        }

        /* ─── GRID THỐNG KÊ NHANH ─── */
        .stats-grid-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-mini-card {
          background: #170e2c;
          border: 1px solid #2d1852;
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-mini-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .stat-icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
        .stat-icon-green { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        .stat-icon-blue { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
        .stat-icon-yellow { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }

        .stat-mini-val {
          font-size: 22px;
          font-weight: 800;
          color: #f8fafc;
        }

        .stat-mini-lbl {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        /* ─── THANH LỌC VÀ TÌM KIẾM ─── */
        .filter-controls-bar {
          background: #140d28;
          border: 1px solid #2b184f;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .domain-tabs-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .domain-tab-btn {
          background: #1c1136;
          border: 1px solid #361f5c;
          color: #cbd5e1;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .domain-tab-btn:hover {
          border-color: #7c3aed;
          color: #f1f5f9;
        }

        .domain-tab-btn.active {
          background: #7c3aed;
          border-color: #9333ea;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.4);
        }

        .status-and-search-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .status-pills-row {
          display: flex;
          gap: 8px;
        }

        .status-pill-btn {
          background: transparent;
          border: 1px solid #361f5c;
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-pill-btn.active {
          background: #2b1552;
          border-color: #a855f7;
          color: #e9d5ff;
        }

        .search-input-wrapper {
          position: relative;
          width: 280px;
        }

        .search-input-wrapper input {
          width: 100%;
          background: #1c1136;
          border: 1px solid #361f5c;
          border-radius: 8px;
          padding: 7px 12px 7px 32px;
          color: #f1f5f9;
          font-size: 12.5px;
          outline: none;
        }

        .search-input-wrapper .icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 13px;
        }

        /* ─── GRID DANH SÁCH KỊCH BẢN ─── */
        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 20px;
        }

        .scenario-card {
          background: #170e2c;
          border: 1px solid #2f1954;
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: all 0.25s ease;
          position: relative;
        }

        .scenario-card:hover {
          transform: translateY(-3px);
          border-color: #7c3aed;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
        }

        .scen-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .scen-code {
          font-size: 11px;
          font-weight: 800;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          padding: 2px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .scen-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 20px;
        }
        .badge-green { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        .badge-orange { background: rgba(249, 115, 22, 0.15); color: #fb923c; border: 1px solid rgba(249, 115, 22, 0.3); }
        .badge-yellow { background: rgba(234, 179, 8, 0.15); color: #fde047; border: 1px solid rgba(234, 179, 8, 0.3); }
        .badge-red { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

        .scen-unit-name {
          font-size: 12px;
          color: #a78bfa;
          font-weight: 600;
        }

        .scen-card-title {
          font-size: 16.5px;
          font-weight: 800;
          color: #f8fafc;
          line-height: 1.4;
          margin: 0;
        }

        .scen-metrics-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #110920;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid #23123f;
        }

        .metric-col {
          display: flex;
          flex-direction: column;
        }

        .metric-col .val {
          font-size: 13.5px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .metric-col .lbl {
          font-size: 10.5px;
          color: #94a3b8;
        }

        .diff-badge {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 700;
        }
        .diff-easy { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .diff-medium { background: rgba(234, 179, 8, 0.15); color: #facc15; }
        .diff-hard { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        .scen-card-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #261445;
        }

        .btn-edit-scen {
          flex: 1;
          background: #7c3aed;
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          transition: background 0.2s;
        }

        .btn-edit-scen:hover {
          background: #6d28d9;
        }

        .btn-test-sim {
          background: #1f1338;
          border: 1px solid #4a287c;
          color: #cbd5e1;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-test-sim:hover {
          background: #2e1754;
          border-color: #a855f7;
          color: #ffffff;
        }

        .btn-analytics-scen {
          width: 36px;
          height: 36px;
          background: #1f1338;
          border: 1px solid #4a287c;
          color: #cbd5e1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-analytics-scen:hover {
          border-color: #38bdf8;
          color: #38bdf8;
        }
      `}</style>

      {/* ─── BANNER CHUYÊN GIA ─── */}
      <div className="curator-hero-card">
        <div className="curator-hero-left">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
            alt="BS. Trần Hoàng Nam"
            className="curator-avatar-large"
          />
          <div className="curator-hero-info">
            <h1>Xưởng Biên Soạn Kịch Bản An Toàn (Curator Studio)</h1>
            <p>
              Chuyên gia: <strong>BS.CKI Trần Hoàng Nam</strong> • Hội Chữ Thập Đỏ & Viện Bỏng Quốc Gia
            </p>
            <div className="curator-tags-row">
              <span className="curator-tag-pill">🩺 Sơ cấp cứu ban đầu</span>
              <span className="curator-tag-pill">🔥 Bỏng nhiệt & dầu ăn</span>
              <span className="curator-tag-pill">🫀 Phác đồ CPR 2025</span>
              <span className="curator-tag-pill">✨ Chuẩn Y khoa 100%</span>
            </div>
          </div>
        </div>

        <div className="curator-hero-actions">
          <Link to="/studio/builder" className="btn-create-scenario">
            <span>✍️</span>
            <span>+ Soạn Kịch Bản Mới</span>
          </Link>
        </div>
      </div>

      {/* ─── 4 CHỈ SỐ NHANH ─── */}
      <div className="stats-grid-row">
        <div className="stat-mini-card">
          <div className="stat-mini-icon stat-icon-purple">📚</div>
          <div>
            <div className="stat-mini-val">{scenarios.length} Kịch bản</div>
            <div className="stat-mini-lbl">Tổng cây học liệu quản lý</div>
          </div>
        </div>

        <div className="stat-mini-card">
          <div className="stat-mini-icon stat-icon-green">🟢</div>
          <div>
            <div className="stat-mini-val">
              {scenarios.filter((s) => s.status === 'PUBLISHED').length} Đang Live
            </div>
            <div className="stat-mini-lbl">Đã phát hành trên App</div>
          </div>
        </div>

        <div className="stat-mini-card">
          <div className="stat-mini-icon stat-icon-blue">🧑‍🎓</div>
          <div>
            <div className="stat-mini-val">
              {scenarios.reduce((acc, s) => acc + (s.learnersCount || 0), 0).toLocaleString()}
            </div>
            <div className="stat-mini-lbl">Lượt học sinh đã luyện tập</div>
          </div>
        </div>

        <div className="stat-mini-card">
          <div className="stat-mini-icon stat-icon-yellow">⭐</div>
          <div>
            <div className="stat-mini-val">4.92 / 5.0</div>
            <div className="stat-mini-lbl">Đánh giá chất lượng y khoa</div>
          </div>
        </div>
      </div>

      {/* ─── BỘ LỌC VÀ TÌM KIẾM THEO 5 TRỤ CỘT ─── */}
      <div className="filter-controls-bar">
        {/* Tabs 5 trụ cột */}
        <div className="domain-tabs-row">
          {[
            { id: 'ALL', label: 'Tất cả lĩnh vực (All)' },
            { id: 'FIRST_AID', label: '🚑 Sơ cấp cứu ban đầu' },
            { id: 'FIRE_SAFETY', label: '🚒 PCCC & Thoát hiểm' },
            { id: 'CYBER_SAFETY', label: '💻 An toàn số & Lừa đảo' },
            { id: 'ANTI_BULLYING', label: '🛡️ Chống BLHĐ & Xâm hại' },
            { id: 'SURVIVAL', label: '🚦 Sinh tồn & Giao thông' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`domain-tab-btn ${selectedDomain === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedDomain(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trạng thái & Search */}
        <div className="status-and-search-row">
          <div className="status-pills-row">
            {[
              { id: 'ALL', label: 'Tất cả trạng thái' },
              { id: 'PUBLISHED', label: '🟢 Live' },
              { id: 'PENDING', label: '🟠 Chờ duyệt' },
              { id: 'DRAFT', label: '🟡 Bản nháp' },
              { id: 'REVISION', label: '🔴 Cần cập nhật' },
            ].map((st) => (
              <button
                key={st.id}
                className={`status-pill-btn ${selectedStatus === st.id ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st.id)}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="search-input-wrapper">
            <span className="icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm theo tên bài, mã bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ─── DANH SÁCH THẺ KỊCH BẢN ─── */}
      <div className="scenarios-grid">
        {filteredScenarios.map((scen) => (
          <div key={scen.id} className="scenario-card">
            <div className="scen-card-top">
              <span className="scen-code">{scen.lessonCode}</span>
              {getStatusBadge(scen.status)}
            </div>

            <div>
              <div className="scen-unit-name">{scen.domainName} • {scen.unit}</div>
              <h3 className="scen-card-title">{scen.title}</h3>
            </div>

            <div className="scen-metrics-row">
              <div className="metric-col">
                <span className="val">{scen.scenariosCount} lát cắt</span>
                <span className="lbl">Tình huống</span>
              </div>
              <div className="metric-col">
                <span className="val">{scen.learnersCount ? scen.learnersCount.toLocaleString() : '0'}</span>
                <span className="lbl">Lượt học</span>
              </div>
              <div className="metric-col">
                <span className="val" style={{ color: scen.accuracyRate >= 80 ? '#4ade80' : '#fb923c' }}>
                  {scen.accuracyRate ? `${scen.accuracyRate}%` : '---'}
                </span>
                <span className="lbl">Tỷ lệ đúng</span>
              </div>
              <div className="metric-col">
                {getDifficultyBadge(scen.difficulty)}
                <span className="lbl" style={{ textAlign: 'center' }}>Độ khó</span>
              </div>
            </div>

            <div className="scen-card-actions">
              <Link to={`/studio/builder?id=${scen.id}`} className="btn-edit-scen">
                <span>✍️</span>
                <span>Soạn bài</span>
              </Link>

              <Link to={`/studio/builder?id=${scen.id}&sim=true`} className="btn-test-sim" title="Chạy thử trên Simulator">
                <span>📱</span>
                <span>Chơi thử</span>
              </Link>

              <Link to={`/studio/analytics?id=${scen.id}`} className="btn-analytics-scen" title="Xem phân tích độ khó">
                <span>📈</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
