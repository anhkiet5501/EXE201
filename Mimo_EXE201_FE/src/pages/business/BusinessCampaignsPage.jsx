import React, { useState, useEffect } from 'react';
import { businessService } from '../../services/modules/businessService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function BusinessCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('Toàn bộ Khối 10 & Khối 11');
  const [topic, setTopic] = useState('PCCC & Thoát hiểm khói độc chung cư cao tầng');
  const [deadline, setDeadline] = useState('2026-11-15 17:00');
  const [passingScore, setPassingScore] = useState(80);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    businessService.getCampaigns().then((res) => {
      if (res?.data) setCampaigns(res.data);
    });
  };

  const handleNudge = (camp) => {
    sound.playClick();
    businessService.nudgeCampaign(camp.id).then((res) => {
      alert(`🔔 Đã rung chuông gửi thông báo khẩn đến các học sinh chưa hoàn thành chiến dịch "${camp.title}"!`);
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    sound.playVictory();
    fireConfetti();
    businessService.createCampaign({
      title,
      target,
      assignedTopic: topic,
      deadline,
      passingScore,
    }).then(() => {
      alert('🎉 Đã phát động chiến dịch đào tạo an toàn mới thành công!');
      setShowCreateModal(false);
      setTitle('');
      loadCampaigns();
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="biz-page-header">
        <div>
          <h1 className="biz-page-title">
            <span>🎯</span>
            <span>Chiến Dịch Đào Tạo An Toàn Bắt Buộc</span>
          </h1>
          <p className="biz-page-subtitle">
            Giao chuyên đề kiểm tra định kỳ cho toàn trường hoặc từng khối lớp, cài đặt hạn chót và rung chuông nhắc nhở
          </p>
        </div>

        <button
          type="button"
          className="biz-btn-primary"
          onClick={() => {
            sound.playClick();
            setShowCreateModal(true);
          }}
        >
          <span>➕</span>
          <span>Phát Động Chiến Dịch Mới</span>
        </button>
      </div>

      {/* DANH SÁCH CHIẾN DỊCH */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {campaigns.map((camp) => (
          <div key={camp.id} className="biz-card" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      background: camp.status === 'RUNNING' ? '#DCFCE7' : '#E2E8F0',
                      color: camp.status === 'RUNNING' ? '#15803D' : '#64748B',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {camp.status === 'RUNNING' ? '🟢 ĐANG DIỄN RA' : '⚪ ĐÃ HOÀN TẤT'}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 700 }}>
                    Hạn chót: <strong>{camp.deadline}</strong>
                  </span>
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>
                  {camp.title}
                </div>

                <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                  🎯 Chuyên đề: <strong>{camp.assignedTopic}</strong> • 👥 Đối tượng: <strong>{camp.target}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#0284C7' }}>
                  {camp.completedCount} <span style={{ fontSize: '15px', color: '#94A3B8' }}>/ {camp.totalAssigned}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 700 }}>
                  {camp.complianceRate}% Đã nộp bài
                </div>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', margin: '16px 0 12px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${camp.complianceRate}%`,
                  background: camp.complianceRate >= 80 ? '#16A34A' : '#F59E0B',
                  borderRadius: '4px',
                }}
              />
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="biz-btn-secondary"
                style={{ fontSize: '12.5px' }}
                onClick={() => {
                  sound.playClick();
                  alert(`📋 Đang xuất bảng điểm chi tiết của chiến dịch "${camp.title}"...`);
                }}
              >
                📊 Xem Bảng Điểm
              </button>

              {camp.status === 'RUNNING' && (
                <button
                  type="button"
                  className="biz-btn-primary"
                  style={{ fontSize: '12.5px', background: '#E11D48' }}
                  onClick={() => handleNudge(camp)}
                >
                  🔔 Rung Chuông Nhắc Nhở ({camp.totalAssigned - camp.completedCount} em chưa nộp)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PHÁT ĐỘNG MỚI */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '24px', width: '500px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800 }}>
              🎯 Phát Động Chiến Dịch Đào Tạo Mới
            </h3>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Tiêu Đề Chiến Dịch:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kiểm tra định kỳ An toàn PCCC Học kỳ 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Chuyên Đề Đào Tạo:
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="PCCC & Thoát hiểm khói độc chung cư cao tầng">PCCC & Thoát hiểm khói độc chung cư cao tầng</option>
                  <option value="Sơ cứu ngừng tim CPR & Dị vật đường thở Heimlich">Sơ cứu ngừng tim CPR & Dị vật đường thở Heimlich</option>
                  <option value="An toàn thiết bị điện & Ngắt chập cháy nổ">An toàn thiết bị điện & Ngắt chập cháy nổ</option>
                  <option value="An toàn số: Chống lừa đảo và bạo lực mạng">An toàn số: Chống lừa đảo và bạo lực mạng</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Đối Tượng Áp Dụng:
                  </label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="Toàn bộ học sinh (Khối 10, 11, 12)">Toàn bộ học sinh (Khối 10, 11, 12)</option>
                    <option value="Toàn bộ Khối 10 (10A1 đến 10A5)">Toàn bộ Khối 10 (10A1 đến 10A5)</option>
                    <option value="Toàn bộ Khối 11 (11A1 đến 11A5)">Toàn bộ Khối 11 (11A1 đến 11A5)</option>
                    <option value="Toàn bộ Khối 12 (12A1 đến 12A5)">Toàn bộ Khối 12 (12A1 đến 12A5)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Điểm Đạt Chuẩn (%):
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="100"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Hạn Chót Nộp Bài:
                </label>
                <input
                  type="text"
                  placeholder="2026-11-20 17:00"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="biz-btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="biz-btn-primary">
                  Phát Động Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
