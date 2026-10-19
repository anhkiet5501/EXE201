import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { sound, fireConfetti } from '../../utils/audioEffects';
import { businessService } from '../../services/modules/businessService';
import { useNavigate } from 'react-router-dom';

export default function ProfileLearnerPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentAvatar, setCurrentAvatar] = useState('🧑🏻');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [fullName, setFullName] = useState(user?.name || 'Nguyễn Văn Học');
  const [bio, setBio] = useState('Học sinh yêu thích kỹ năng sinh tồn, an toàn giao thông và sơ cấp cứu.');
  const [teacherCodeInput, setTeacherCodeInput] = useState('');
  const [teacherCodeError, setTeacherCodeError] = useState('');
  const [teacherSuccessData, setTeacherSuccessData] = useState(null);

  const avatarChoices = ['🧑🏻', '👦🏻', '👧🏻', '🤖', '🦸🏻', '👨🏻‍🚒', '👩🏻‍⚕️', '🕵🏻'];

  // Dữ liệu biểu đồ thời gian học 7 ngày qua
  const weeklyStudyData = [
    { day: 'T2', minutes: 25, xp: 45 },
    { day: 'T3', minutes: 40, xp: 70 },
    { day: 'T4', minutes: 35, xp: 60 },
    { day: 'T5', minutes: 50, xp: 95 },
    { day: 'T6', minutes: 45, xp: 80 },
    { day: 'T7', minutes: 60, xp: 120 },
    { day: 'CN', minutes: 30, xp: 50 },
  ];

  // Danh sách bạn học
  const studyBuddies = [
    { id: 'sb1', name: 'Nguyễn Minh Quân', school: 'THPT FPT Cần Thơ', xp: 3250, avatar: '👦🏻', status: 'Đang online' },
    { id: 'sb2', name: 'Trần Phương Anh', school: 'THPT Chuyên Lê Hồng Phong', xp: 2980, avatar: '👧🏻', status: 'Học 2h trước' },
    { id: 'sb3', name: 'Lê Hoàng Bảo', school: 'THPT Lê Quý Đôn', xp: 2760, avatar: '👦🏽', status: 'Học hôm qua' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '960px', margin: '0 auto' }}>
      {/* 1. HEADER TRANG HỒ SƠ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>👤</span>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Hồ Sơ Cá Nhân & Tài Khoản Học Sinh
              </h1>
              <span
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  marginTop: '4px',
                  display: 'inline-block',
                }}
              >
                TÀI KHOẢN ĐỊNH DANH HỌC VIÊN
              </span>
            </div>
          </div>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '8px 0 0 0' }}>
            Quản lý thông tin cá nhân, theo dõi thói quen học tập hàng tuần và mạng lưới bạn bè thi đua.
          </p>
        </div>

        <button
          onClick={() => setShowEditProfileModal(true)}
          className="btn-3d btn-3d-white btn-3d-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>✏️</span>
          <span>CHỈNH SỬA HỒ SƠ</span>
        </button>
      </div>

      {/* 2. THẺ HỌC SINH ĐIỆN TỬ (DIGITAL STUDENT ID CARD) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          padding: '28px 32px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {/* Avatar tương tác cho phép chọn */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                sound.playClick();
                setShowAvatarPicker(!showAvatarPicker);
              }}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: '#F0F9FF',
                border: '3.5px solid #0EA5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '46px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.25)',
                transition: 'transform 0.15s ease',
              }}
              title="Nhấn để đổi hình đại diện"
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {currentAvatar}
            </div>
            <span
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                background: '#0EA5E9',
                color: '#FFFFFF',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                border: '2px solid #FFFFFF',
              }}
            >
              📷
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                {fullName}
              </h2>
              <span
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                ĐÃ XÁC THỰC
              </span>
            </div>

            <div style={{ fontSize: '13.5px', color: '#64748B', margin: '4px 0 10px 0' }}>
              {user?.email || 'learner@mimo.com'} • Mã học sinh: <strong>MIMO-HS-2026</strong>
            </div>

            <p style={{ fontSize: '13px', color: '#334155', margin: 0, fontStyle: 'italic', maxWidth: '480px' }}>
              "{bio}"
            </p>
          </div>
        </div>

        {/* Khối lớp học trường học */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '18px',
            padding: '16px 20px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>ĐƠN VỊ ĐÀO TẠO</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>
            🏫 THPT FPT Cần Thơ
          </div>
          <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 700, marginTop: '2px' }}>
            Lớp 10A1 • Niên khóa 2026-2027
          </div>
        </div>
      </div>

      {/* POPUP CHỌN AVATAR */}
      {showAvatarPicker && (
        <div
          style={{
            background: '#F8FAFC',
            border: '2px solid #E2E8F0',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
            Chọn hình đại diện mới:
          </span>
          {avatarChoices.map((av) => (
            <button
              key={av}
              onClick={() => {
                sound.playClick();
                setCurrentAvatar(av);
                setShowAvatarPicker(false);
              }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                fontSize: '24px',
                background: currentAvatar === av ? '#DCFCE7' : '#FFFFFF',
                border: `2px solid ${currentAvatar === av ? '#22C55E' : '#E2E8F0'}`,
                cursor: 'pointer',
              }}
            >
              {av}
            </button>
          ))}
          <button
            onClick={() => setShowAvatarPicker(false)}
            style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}
          >
            Đóng ✕
          </button>
        </div>
      )}

      {/* 3. THỐNG KÊ THỜI LƯỢNG HỌC & BIỂU ĐỒ 7 NGÀY (LEARNING ANALYTICS) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊</span>
              <span>Thời Lượng Học Tập & Biểu Đồ 7 Ngày</span>
            </h2>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
              Tổng thời gian rèn luyện tuần này: <strong>4 giờ 45 phút</strong> (+18% so với tuần trước)
            </div>
          </div>
        </div>

        {/* 4 Thẻ KPI học tập */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginBottom: '26px',
          }}
        >
          <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>⏱️</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>6h 45m</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Tổng thời lượng đã học</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📚</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#16A34A' }}>18 Bài</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Tình huống đã vượt qua</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎯</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563EB' }}>94%</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Đúng ngay lần đầu</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔥</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#EA580C' }}>7 Ngày</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Chuỗi học kiên trì</div>
          </div>
        </div>

        {/* Biểu đồ cột thời lượng học 7 ngày qua */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '14px' }}>
            Thời lượng học từng ngày trong tuần (Phút):
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px', padding: '0 10px', borderBottom: '2px solid #E2E8F0' }}>
            {weeklyStudyData.map((d) => {
              const heightPercent = (d.minutes / 60) * 100;
              const isToday = d.day === 'T6';

              return (
                <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: isToday ? '#15803D' : '#64748B' }}>
                    {d.minutes}p
                  </div>
                  <div
                    style={{
                      width: '32px',
                      height: `${heightPercent}%`,
                      background: isToday
                        ? 'linear-gradient(180deg, #22C55E 0%, #15803D 100%)'
                        : '#CBD5E1',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <div style={{ fontSize: '12px', fontWeight: isToday ? 900 : 700, color: isToday ? '#15803D' : '#64748B', marginTop: '4px' }}>
                    {d.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. KÍCH HOẠT MÃ BẢN QUYỀN GIÁO VIÊN (DÀNH CHO THẦY/CÔ DO TRƯỜNG CỬ) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
          borderRadius: '24px',
          border: '2px solid #86EFAC',
          padding: '28px',
          boxShadow: '0 8px 20px rgba(22, 163, 74, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '32px' }}>🔑</span>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#14532D', margin: 0 }}>
              Kích Hoạt Quyền Giáo Viên Bộ Môn
            </h2>
            <div style={{ fontSize: '13px', color: '#166534', marginTop: '2px' }}>
              Nhập mã bản quyền do Nhà trường / Ban Giám Hiệu cấp để mở khóa quyền quản lý lớp học và giao bài tập.
            </div>
          </div>
        </div>

        {teacherSuccessData ? (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #22C55E' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803D', marginBottom: '6px' }}>
              🎉 Chúc mừng Thầy/Cô đã trở thành Giáo Viên của {teacherSuccessData.school}!
            </div>
            <div style={{ fontSize: '13.5px', color: '#334155', marginBottom: '16px' }}>
              Thầy/Cô đã được cấp quyền quản lý các lớp học: <strong>{teacherSuccessData.assignedClasses?.join(', ')}</strong>.
            </div>
            <button
              type="button"
              className="btn-3d btn-3d-green"
              onClick={() => {
                sound.playClick();
                navigate('/learn/classroom');
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 800 }}
            >
              <span>👨‍🏫</span>
              <span>VÀO BẢNG QUẢN LÝ LỚP HỌC NGAY</span>
            </button>
          </div>
        ) : (
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!teacherCodeInput.trim()) return;
                sound.playClick();
                businessService.activateTeacherKey(teacherCodeInput, user).then((res) => {
                  if (res?.success) {
                    sound.playVictory();
                    fireConfetti();
                    setTeacherSuccessData(res.data);
                    setTeacherCodeError('');
                  } else {
                    sound.playWrong();
                    setTeacherCodeError(res?.error || 'Mã không hợp lệ!');
                  }
                });
              }}
              style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}
            >
              <input
                type="text"
                placeholder="Nhập mã trường cấp (Ví dụ: GV-FPT-K10)"
                value={teacherCodeInput}
                onChange={(e) => {
                  setTeacherCodeInput(e.target.value.toUpperCase());
                  setTeacherCodeError('');
                }}
                style={{
                  flex: 1,
                  minWidth: '260px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: teacherCodeError ? '2px solid #EF4444' : '1.5px solid #86EFAC',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  background: '#FFFFFF',
                  outline: 'none',
                }}
              />

              <button
                type="submit"
                className="btn-3d btn-3d-green"
                style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>⚡</span>
                <span>KÍCH HOẠT QUYỀN GIÁO VIÊN</span>
              </button>
            </form>

            {teacherCodeError && (
              <div style={{ color: '#DC2626', fontSize: '13px', fontWeight: 700, marginTop: '8px' }}>
                ⚠️ {teacherCodeError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#166534', fontWeight: 700 }}>Thử nhanh mã mẫu:</span>
              <button
                type="button"
                onClick={() => setTeacherCodeInput('GV-FPT-K11')}
                style={{ background: '#FFFFFF', border: '1px solid #86EFAC', borderRadius: '6px', padding: '3px 8px', fontSize: '11.5px', fontWeight: 800, color: '#15803D', cursor: 'pointer' }}
              >
                GV-FPT-K11 (Khối 11)
              </button>
              <button
                type="button"
                onClick={() => setTeacherCodeInput('GV-FPT-NEW')}
                style={{ background: '#FFFFFF', border: '1px solid #86EFAC', borderRadius: '6px', padding: '3px 8px', fontSize: '11.5px', fontWeight: 800, color: '#15803D', cursor: 'pointer' }}
              >
                GV-FPT-NEW (Khối 12)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. MẠNG LƯỚI BẠN HỌC & THI ĐUA (STUDY BUDDIES) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👥</span>
              <span>Bạn Học Cùng Lớp & Thi Đua</span>
            </h2>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
              Kết nối và so tài kỹ năng an toàn với các bạn cùng khóa
            </div>
          </div>

          <button
            onClick={() => alert('Đã sao chép mã kết bạn: MIMO-NAM-2026. Gửi cho bạn bè để cùng học!')}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '999px',
              padding: '8px 16px',
              color: '#3B82F6',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            + THÊM BẠN HỌC
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {studyBuddies.map((buddy) => (
            <div
              key={buddy.id}
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{buddy.avatar}</span>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A' }}>{buddy.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{buddy.school}</div>
                  <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>
                    ● {buddy.status}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '13px', fontWeight: 800, color: '#B45309' }}>
                {buddy.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CHỈNH SỬA HỒ SƠ */}
      {showEditProfileModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowEditProfileModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '30px',
              maxWidth: '440px',
              width: '90%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 16px 0' }}>
              Chỉnh Sửa Thông Tin Học Sinh
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Họ và tên hiển thị:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Lời giới thiệu (Bio):
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowEditProfileModal(false)}
                style={{
                  flex: 1,
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#64748B',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                HỦY
              </button>
              <button
                onClick={() => {
                  sound.playVictory();
                  alert('Đã cập nhật thông tin hồ sơ học sinh thành công!');
                  setShowEditProfileModal(false);
                }}
                className="btn-3d btn-3d-green"
                style={{ flex: 1.5 }}
              >
                LƯU THAY ĐỔI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
