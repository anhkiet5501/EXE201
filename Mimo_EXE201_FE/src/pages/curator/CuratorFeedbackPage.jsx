import React, { useState, useEffect } from 'react';
import { curatorService } from '../../services/modules/curatorService';

export default function CuratorFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [replyText, setReplyText] = useState({});
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    curatorService.getExpertFeedbacks()
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = (id) => {
    const note = replyText[id] || 'Đã tiếp thu và hiệu chỉnh lại kịch bản bài học.';
    curatorService.resolveFeedback(id, note).then(() => {
      setFeedbacks(feedbacks.map((fb) => (fb.id === id ? { ...fb, status: 'RESOLVED', resolutionNote: note } : fb)));
      setResolvingId(null);
      alert('Đã cập nhật trạng thái tiếp thu góp ý chuyên môn thành công!');
    });
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (selectedRole === 'ALL') return true;
    return fb.senderRole === selectedRole;
  });

  return (
    <div className="curator-feedback-page">
      <style>{`
        .curator-feedback-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #150e29;
          border: 1px solid #2e1852;
          padding: 20px 24px;
          border-radius: 16px;
        }

        .feedback-header h1 {
          font-size: 20px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 4px;
        }

        .feedback-header p {
          color: #c084fc;
          font-size: 13px;
          margin: 0;
        }

        /* ─── ROLE TABS ─── */
        .fb-role-tabs {
          display: flex;
          gap: 10px;
        }

        .fb-role-tab {
          background: #170e2d;
          border: 1px solid #331c57;
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fb-role-tab.active {
          background: #7c3aed;
          border-color: #9333ea;
          color: #ffffff;
        }

        /* ─── FEEDBACK LIST ─── */
        .feedback-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feedback-card {
          background: #140d28;
          border: 1px solid #2b184f;
          border-radius: 16px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .fb-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .fb-sender-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fb-avatar-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #251445;
          color: #c084fc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .fb-sender-name {
          font-size: 14px;
          font-weight: 800;
          color: #f1f5f9;
        }

        .fb-scen-tag {
          font-size: 11px;
          color: #38bdf8;
          font-weight: 600;
        }

        .fb-status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .status-resolved { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        .status-review { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .status-pending { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

        .fb-content-text {
          font-size: 13.5px;
          color: #e2e8f0;
          line-height: 1.5;
          background: #1a1033;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #331b54;
        }

        .fb-resolution-box {
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 12.5px;
          color: #86efac;
        }

        .fb-resolution-box strong {
          color: #4ade80;
          display: block;
          margin-bottom: 2px;
        }

        .fb-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-reply-fb {
          background: #7c3aed;
          color: #ffffff;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
      `}</style>

      {/* Header */}
      <div className="feedback-header">
        <div>
          <h1>💬 Trung Tâm Phản Hồi Chuyên Môn & Peer Review</h1>
          <p>Tiếp nhận góp ý y khoa từ đồng nghiệp, giáo viên và học sinh để cập nhật phác đồ</p>
        </div>
      </div>

      {/* Tabs lọc theo đối tượng gửi */}
      <div className="fb-role-tabs">
        <button
          className={`fb-role-tab ${selectedRole === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedRole('ALL')}
        >
          Tất cả phản hồi ({feedbacks.length})
        </button>
        <button
          className={`fb-role-tab ${selectedRole === 'PEER_CURATOR' ? 'active' : ''}`}
          onClick={() => setSelectedRole('PEER_CURATOR')}
        >
          🩺 Hội đồng Y khoa & Bác sĩ đồng nghiệp
        </button>
        <button
          className={`fb-role-tab ${selectedRole === 'EDUCATOR' ? 'active' : ''}`}
          onClick={() => setSelectedRole('EDUCATOR')}
        >
          👨‍🏫 Giáo viên trường học
        </button>
        <button
          className={`fb-role-tab ${selectedRole === 'LEARNER' ? 'active' : ''}`}
          onClick={() => setSelectedRole('LEARNER')}
        >
          🧑‍🎓 Cộng đồng Học viên
        </button>
      </div>

      {/* Danh sách góp ý */}
      <div className="feedback-list">
        {filteredFeedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <div className="fb-card-top">
              <div className="fb-sender-info">
                <div className="fb-avatar-badge">
                  {fb.senderRole === 'PEER_CURATOR' ? '🩺' : fb.senderRole === 'EDUCATOR' ? '👨‍🏫' : '🧑‍🎓'}
                </div>
                <div>
                  <div className="fb-sender-name">{fb.senderName}</div>
                  <div className="fb-scen-tag">
                    Bài liên quan: <strong>{fb.scenarioTitle}</strong> • {fb.timestamp}
                  </div>
                </div>
              </div>

              <div>
                {fb.status === 'RESOLVED' && (
                  <span className="fb-status-pill status-resolved">✅ Đã tiếp thu & Sửa bài</span>
                )}
                {fb.status === 'UNDER_REVIEW' && (
                  <span className="fb-status-pill status-review">⏳ Đang thẩm định phác đồ</span>
                )}
                {fb.status === 'PENDING' && (
                  <span className="fb-status-pill status-pending">🔴 Chờ giải đáp</span>
                )}
              </div>
            </div>

            <div className="fb-content-text">
              "{fb.content}"
            </div>

            {fb.resolutionNote && (
              <div className="fb-resolution-box">
                <strong>📝 Phản hồi & Xử lý của Chuyên gia biên soạn:</strong>
                {fb.resolutionNote}
              </div>
            )}

            {fb.status !== 'RESOLVED' && (
              <div className="fb-actions-row">
                <button
                  className="btn-reply-fb"
                  onClick={() => handleResolve(fb.id)}
                >
                  ✓ Xác nhận tiếp thu & Cập nhật bài học
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
