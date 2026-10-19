import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/modules/adminService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function AdminGamificationPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    adminService.getGamificationSettings()
      .then((res) => setSettings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof value === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playVictory();
    fireConfetti();
    adminService.saveGamificationSettings(settings).then((res) => {
      setSettings(res.data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    });
  };

  const handleReset = () => {
    if (!window.confirm('Khôi phục toàn bộ tham số Game hóa về mặc định ban đầu của MIMO?')) return;
    sound.playClick();
    adminService.resetGamificationSettings().then((res) => {
      setSettings(res.data);
      alert('🔄 Đã khôi phục cài đặt mặc định thành công!');
    });
  };

  if (loading || !settings) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Đang tải bộ cấu hình game hóa...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#0F172A', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
              MODULE 3
            </span>
            <span style={{ color: '#0284C7', fontWeight: 700, fontSize: '13px' }}>
              Gamification Behavioral Balancing Engine
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            🎮 Cân Bằng Cơ Chế Game Hóa (System Tuning)
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0' }}>
            Tinh chỉnh động lực giữ chân người học: Tần suất hồi Tim, giá bùa Streak và độ khắc nghiệt của Giải đấu tuần.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          style={{
            background: '#FFFFFF',
            color: '#64748B',
            border: '1.5px solid #CBD5E1',
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Khôi phục Mặc định
        </button>
      </div>

      {savedSuccess && (
        <div style={{
          background: '#DCFCE7',
          border: '1.5px solid #86EFAC',
          borderRadius: '16px',
          padding: '16px 20px',
          color: '#15803D',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span>🎉</span>
          <span>Đã cập nhật toàn bộ tham số Game hóa thành công! Áp dụng ngay lập tức cho 14.850 người học.</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KHỐI 1: CƠ CHẾ TIM (HEARTS SYSTEM) */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>❤️</span>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                1. Cơ Chế Trái Tim Sinh Tồn (Hearts System)
              </h3>
              <p style={{ color: '#64748B', fontSize: '13px', margin: '2px 0 0' }}>
                Kiểm soát sự cẩn trọng của người học khi đối mặt với tình huống nguy hiểm.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số tim tối đa:
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={settings.maxHearts}
                onChange={(e) => handleChange('maxHearts', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Mặc định: 5 quả</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Thời gian tự hồi phục 1 tim:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min={30}
                  max={720}
                  step={10}
                  value={settings.heartRefillMinutes}
                  onChange={(e) => handleChange('heartRefillMinutes', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>phút (4h)</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số câu ôn tập đúng để hồi 1 tim:
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={settings.practiceQuestionsToRefill}
                onChange={(e) => handleChange('practiceQuestionsToRefill', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Mặc định: 3 câu (Khuyến khích học viên ôn lại)</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Giá hồi đầy 5 tim bằng XP:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min={50}
                  max={500}
                  step={10}
                  value={settings.heartRefillPriceXP}
                  onChange={(e) => handleChange('heartRefillPriceXP', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B', whiteSpace: 'nowrap' }}>XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI 2: CƠ CHẾ CHUỖI NGÀY (DAILY STREAK) */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                2. Cơ Chế Chuỗi Ngày (Daily Streak &amp; Freeze)
              </h3>
              <p style={{ color: '#64748B', fontSize: '13px', margin: '2px 0 0' }}>
                Động lực lớn nhất giữ chân người học quay lại app mỗi ngày.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số bài tối thiểu để thắp lửa ngày:
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={settings.streakMinLessonsDaily}
                onChange={(e) => handleChange('streakMinLessonsDaily', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Mặc định: 1 bài/ngày</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Giá mua Bùa Đóng Băng Chuỗi:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min={100}
                  max={1000}
                  step={50}
                  value={settings.freezePriceXP}
                  onChange={(e) => handleChange('freezePriceXP', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0284C7', whiteSpace: 'nowrap' }}>XP / bùa</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số bùa tối đa được trữ:
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={settings.maxFreezeHolding}
                onChange={(e) => handleChange('maxFreezeHolding', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Tránh việc lạm dụng bùa không chịu học</span>
            </div>
          </div>
        </div>

        {/* KHỐI 3: CƠ CHẾ GIẢI ĐẤU (LEAGUES) */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                3. Cơ Chế Giải Đấu Hàng Tuần (Weekly Leagues)
              </h3>
              <p style={{ color: '#64748B', fontSize: '13px', margin: '2px 0 0' }}>
                Chia bảng ngẫu nhiên 30 học viên cùng trình độ để thi đua điểm XP.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Quy mô 1 bảng đấu:
              </label>
              <input
                type="number"
                value={settings.cohortSize}
                onChange={(e) => handleChange('cohortSize', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>30 người / bảng đấu</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số người được Thăng Hạng:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#16A34A', fontWeight: 900 }}>Top</span>
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={settings.promotionCount}
                  onChange={(e) => handleChange('promotionCount', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số người Rớt Hạng (Vùng nguy hiểm):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#DC2626', fontWeight: 900 }}>Bottom</span>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={settings.demotionCount}
                  onChange={(e) => handleChange('demotionCount', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Thưởng Top 1 Tuần:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  step={50}
                  value={settings.top1RewardXP}
                  onChange={(e) => handleChange('top1RewardXP', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800, boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B', whiteSpace: 'nowrap' }}>XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* NÚT SUBMIT */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button
            type="submit"
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              padding: '14px 28px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>💾</span>
            <span>Lưu &amp; Cập Nhật Toàn Hệ Thống</span>
          </button>
        </div>
      </form>
    </div>
  );
}
