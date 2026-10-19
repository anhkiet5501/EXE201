import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { sound, fireConfetti } from '../../utils/audioEffects';
import { learnerService } from '../../services/modules/learnerService';
import TeacherClassroomView from './TeacherClassroomView';

export default function MyClassroomPage() {
  const { data, refreshData } = useOutletContext();
  const { user } = useAuth();
  const [classCodeInput, setClassCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeAssignment, setActiveAssignment] = useState(null);

  // Nhận diện vai trò giáo viên: nếu user là EDUCATOR thì mặc định là góc nhìn Teacher
  const isTeacherUser = user?.role === 'EDUCATOR' || user?.orgRole === 'TEACHER' || user?.email?.includes('educator') || user?.email?.includes('nam') || user?.email?.includes('mai');
  const [viewMode, setViewMode] = useState(isTeacherUser ? 'TEACHER' : 'LEARNER');

  const classroom = data?.classroom || { joined: false };

  // 3 Mã lớp mẫu dành riêng cho các trường đối tác
  const sampleClasses = [
    {
      code: 'FPT-K10',
      name: 'Lớp 10A1 — THPT FPT Cần Thơ',
      teacher: 'Thầy Nguyễn Văn Nam (Kỹ năng PCCC & Thoát hiểm)',
      icon: '🔥',
      color: '#0284C7',
      bg: '#E0F2FE',
      tag: 'PCCC & Giao thông',
    },
    {
      code: 'LHP-11B',
      name: 'Lớp 11 Sinh — THPT Chuyên Lê Hồng Phong TP.HCM',
      teacher: 'Cô BS. Trần Thị Mai (Sơ cấp cứu & Y tế học đường)',
      icon: '🚑',
      color: '#15803D',
      bg: '#DCFCE7',
      tag: 'Cấp cứu CPR & Chấn thương',
    },
    {
      code: 'VSC-12A',
      name: 'Lớp 12A3 — Vinschool Central Park',
      teacher: 'Thầy ThS. Lê Hoàng Quân (An ninh mạng & Chống Scam)',
      icon: '🛡️',
      color: '#7C3AED',
      bg: '#F3E8FF',
      tag: 'An toàn số & Chống Scam',
    },
  ];

  const handleJoinClass = (codeToJoin) => {
    const targetCode = (codeToJoin || classCodeInput).trim().toUpperCase();
    if (!targetCode) return;

    sound.playClick();
    setLoading(true);
    setErrorMsg('');

    learnerService
      .joinClassroom(targetCode)
      .then((res) => {
        sound.playVictory();
        fireConfetti();
        setClassCodeInput('');
        refreshData();
      })
      .catch((err) => {
        sound.playWrong();
        setErrorMsg(err.message || 'Mã lớp không hợp lệ hoặc đã hết hạn. Hãy kiểm tra lại!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLeaveClass = () => {
    sound.playClick();
    learnerService.leaveClassroom().then(() => {
      refreshData();
    });
  };

  const handleCompleteAssignment = (asn) => {
    sound.playVictory();
    fireConfetti();
    alert(`🎉 Xuất sắc! Bạn đã nộp bài tập "${asn.title}" thành công và nhận +${asn.rewardXp} XP vào sổ điểm trường học!`);
    setActiveAssignment(null);
  };

  // Nếu đang ở góc nhìn Giáo viên
  if (viewMode === 'TEACHER') {
    return (
      <TeacherClassroomView
        teacherUser={user}
        onSwitchToLearnerView={() => setViewMode('LEARNER')}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '880px', margin: '0 auto' }}>
      {/* 1. HEADER CHÍNH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>🏫</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Lớp học của tôi (Chương trình Nhà trường)
                </h1>
                <button
                  type="button"
                  onClick={() => setViewMode('TEACHER')}
                  style={{
                    background: '#EFF6FF',
                    color: '#0284C7',
                    border: '1px solid #BFDBFE',
                    borderRadius: '999px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                  title="Xem giao diện dành cho Giáo viên bộ môn"
                >
                  👨‍🏫 Xem góc nhìn Giáo viên
                </button>
              </div>
              <span
                style={{
                  background: '#FEF3C7',
                  color: '#B45309',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  marginTop: '4px',
                  display: 'inline-block',
                }}
              >
                CỔNG B2B DÀNH RIÊNG CHO TRƯỜNG ĐỐI TÁC
              </span>
            </div>
          </div>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '8px 0 0 0' }}>
            Khu vực làm bài tập kỹ năng thực tế do Thầy/Cô giao, chấm điểm tự động và đồng bộ sổ điểm Nhà trường.
          </p>
        </div>

        {classroom.joined && (
          <button
            onClick={handleLeaveClass}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '999px',
              color: '#64748B',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FEE2E2';
              e.currentTarget.style.color = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#64748B';
            }}
            title="Đổi sang lớp học khác"
          >
            <span>⎌</span>
            <span>Đổi mã lớp khác</span>
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2. GIAO DIỆN KHI CHƯA NHẬP MÃ (MẶC ĐỊNH BẮT NHẬP MÃ LỚP MỚI CHO VÀO) */}
      {/* ===================================================================== */}
      {!classroom.joined ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Card Form Nhập mã lớp */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '2px solid #E2E8F0',
              padding: '36px 32px',
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                margin: '0 auto 16px auto',
              }}
            >
              🔐
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>
              Xác thực Mã Lớp học Nhà trường
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
              Phân hệ này dành riêng cho các trường đối tác của MIMO. Vui lòng nhập <strong>Mã lớp (Class Code)</strong> do Thầy/Cô cung cấp để mở khóa:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleJoinClass();
              }}
              style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="VD: FPT-K10"
                  maxLength={12}
                  value={classCodeInput}
                  onChange={(e) => {
                    setClassCodeInput(e.target.value.toUpperCase());
                    if (errorMsg) setErrorMsg('');
                  }}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 900,
                    letterSpacing: '3px',
                    borderRadius: '16px',
                    border: `2px solid ${errorMsg ? '#EF4444' : '#CBD5E1'}`,
                    textTransform: 'uppercase',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#F8FAFC',
                    transition: 'border-color 0.15s ease',
                  }}
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1.5px solid #FECACA',
                    color: '#DC2626',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textAlign: 'left',
                  }}
                >
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !classCodeInput.trim()}
                className={`btn-3d ${classCodeInput.trim() ? 'btn-3d-green' : 'btn-3d-disabled'} btn-3d-lg`}
                style={{ width: '100%', padding: '15px 24px' }}
              >
                {loading ? 'Đang xác thực với Nhà trường...' : 'XÁC NHẬN VÀO LỚP ➔'}
              </button>
            </form>
          </div>

          {/* Gợi ý 3 mã lớp mẫu của 3 trường để xem và trải nghiệm thử */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '18px' }}>💡</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#334155', margin: 0 }}>
                3 Mã Lớp Mẫu Thử Nghiệm (Bấm để điền & vào lớp ngay):
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {sampleClasses.map((sc) => (
                <div
                  key={sc.code}
                  onClick={() => {
                    setClassCodeInput(sc.code);
                    handleJoinClass(sc.code);
                  }}
                  style={{
                    background: '#FFFFFF',
                    border: '2px solid #E2E8F0',
                    borderRadius: '18px',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = sc.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          fontWeight: 900,
                          fontSize: '13px',
                          letterSpacing: '1px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                        }}
                      >
                        MÃ: {sc.code}
                      </span>
                      <span style={{ fontSize: '24px' }}>{sc.icon}</span>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                      {sc.name}
                    </div>

                    <div style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.4, marginBottom: '12px' }}>
                      {sc.teacher}
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: '10px',
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: sc.color,
                      fontWeight: 800,
                      fontSize: '12.5px',
                    }}
                  >
                    <span>Thử mã này</span>
                    <span>➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* 3. GIAO DIỆN CHI TIẾT LỚP HỌC KHI ĐÃ NHẬP ĐÚNG MÃ LỚP */
        /* ===================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Hero Banner Lớp học */}
          <div
            style={{
              background: classroom.classInfo?.bannerGradient || 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              borderRadius: '24px',
              padding: '30px 32px',
              color: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.22)',
                    fontSize: '11px',
                    fontWeight: 900,
                    letterSpacing: '1px',
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}
                >
                  MÃ LỚP: {classroom.classInfo?.code}
                </span>
                {classroom.classInfo?.topic && (
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    {classroom.classInfo?.topic}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '-0.3px' }}>
                {classroom.classInfo?.className}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.95 }}>
                <span style={{ fontSize: '22px' }}>{classroom.classInfo?.teacherAvatar || '👨🏻‍🏫'}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>{classroom.classInfo?.teacher}</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>{classroom.classInfo?.teacherRole}</div>
                </div>
              </div>
            </div>

            {/* Chỉ số xếp hạng lớp */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(10px)',
                borderRadius: '18px',
                padding: '16px 24px',
                textAlign: 'center',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.1 }}>
                Hạng #{classroom.classInfo?.rankInClass}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.95, marginTop: '4px' }}>
                Trên tổng số {classroom.classInfo?.totalStudents} bạn học
              </div>
            </div>
          </div>

          {/* Danh sách Bài tập kỹ năng do Giáo viên giao */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '2px solid #E2E8F0',
              padding: '24px 28px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📝</span>
                <span>Bài tập Kỹ năng sống & Tình huống thực chiến</span>
              </h3>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                {classroom.assignments?.length || 0} bài được giao
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {classroom.assignments?.map((asn) => {
                const isPending = asn.status === 'pending';

                return (
                  <div
                    key={asn.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                        {asn.title}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                        Hạn chót:{' '}
                        <strong style={{ color: isPending ? '#EA580C' : '#15803D' }}>{asn.deadline}</strong>
                      </div>
                    </div>

                    <div>
                      {isPending ? (
                        <button
                          onClick={() => setActiveAssignment(asn)}
                          className="btn-3d btn-3d-green btn-3d-sm"
                        >
                          LÀM BÀI (+{asn.rewardXp} XP) ➔
                        </button>
                      ) : (
                        <span
                          style={{
                            background: '#DCFCE7',
                            color: '#15803D',
                            fontWeight: 800,
                            fontSize: '13px',
                            padding: '8px 16px',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {asn.score}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card B2B Info Box */}
          <div
            style={{
              background: '#F0F9FF',
              border: '2px solid #BAE6FD',
              borderRadius: '20px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '32px' }}>🎓</span>
            <div style={{ fontSize: '13px', color: '#0369A1', lineHeight: 1.5 }}>
              <strong>Lưu ý từ Thầy/Cô Bộ Môn:</strong> Kết quả học tập và các bài tập bạn hoàn thành trên MIMO sẽ tự động được gửi về bảng tổng kết lớp học của Thầy/Cô. Hoàn thành 100% chuyên đề sẽ được cấp <strong>Chứng chỉ Kỹ năng Sinh tồn Chính thức</strong> vào cuối kỳ!
            </div>
          </div>
        </div>
      )}

      {/* MODAL LÀM BÀI TẬP TÌNH HUỐNG NHÀ TRƯỜNG */}
      {activeAssignment && (
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
          onClick={() => setActiveAssignment(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '30px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ background: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '11px', padding: '4px 10px', borderRadius: '999px' }}>
                BÀI TẬP NHÀ TRƯỜNG • +{activeAssignment.rewardXp} XP
              </span>
              <button
                onClick={() => setActiveAssignment(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#94A3B8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0' }}>
              {activeAssignment.title}
            </h3>

            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Bài tập gồm chuỗi 3 câu hỏi tình huống thực tế mô phỏng xử lý sự cố. Bạn cần hoàn thành đạt từ 80% điểm trở lên để nộp vào sổ điểm điện tử của lớp.
            </p>

            <div
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                ⏳ Hạn chót nộp bài: <strong>{activeAssignment.deadline}</strong>
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                Giáo viên phụ trách: {classroom.classInfo?.teacher}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveAssignment(null)}
                style={{
                  flex: 1,
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#64748B',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ĐỂ SAU
              </button>
              <button
                onClick={() => handleCompleteAssignment(activeAssignment)}
                className="btn-3d btn-3d-green"
                style={{ flex: 1.5 }}
              >
                NỘP BÀI THỰC HÀNH ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
