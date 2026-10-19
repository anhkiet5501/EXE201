import React, { useState } from 'react';
import { sound, fireConfetti } from '../../utils/audioEffects';

/**
 * TeacherClassroomView:
 * Giao diện Quản Lý Lớp Học & Sư Phạm dành riêng cho GIÁO VIÊN
 * Hỗ trợ 1 Giáo viên quản lý NHIỀU LỚP:
 * - Màn hình 1: Danh sách tất cả các lớp của Giáo viên
 * - Màn hình 2: Đi sâu vào chi tiết 1 lớp (Sổ điểm, Red Flags, Chiếu QR, Nhắc nhở)
 */
export default function TeacherClassroomView({
  teacherUser,
  onSwitchToLearnerView = () => {},
}) {
  const isLHP = teacherUser?.email?.includes('mai');

  // Danh sách các lớp học mẫu của Giáo viên (Thầy Nam hoặc Cô Mai)
  const [teacherClasses, setTeacherClasses] = useState([
    {
      id: isLHP ? 'cls_lhp_11b' : 'cls_fpt_10a1',
      code: isLHP ? 'LHP-11B' : 'FPT-K10',
      name: isLHP ? 'Lớp 11 Sinh — THPT Chuyên Lê Hồng Phong' : 'Lớp 10A1 — THPT FPT Cần Thơ',
      room: isLHP ? 'Phòng Lab Sinh học 2' : 'Phòng 302 - Toà Alpha',
      totalStudents: isLHP ? 39 : 42,
      completionRate: isLHP ? 94 : 88,
      avgStreak: isLHP ? 7.8 : 6.4,
      icon: isLHP ? '🚑' : '🔥',
      color: isLHP ? '#15803D' : '#0284C7',
      bg: isLHP ? '#DCFCE7' : '#E0F2FE',
      topicFocus: isLHP ? 'Sơ cấp cứu CPR & Dị vật Heimlich' : 'Thoát hiểm khẩn cấp khi cháy chung cư cao tầng',
      redFlag: {
        question: isLHP
          ? 'Tần số ép tim ngoài lồng ngực chuẩn khi hồi sức CPR cho người lớn?'
          : 'Khi chập điện gây cháy trong phòng, bước đầu tiên cần làm là gì?',
        wrongRate: isLHP ? 48 : 62,
        note: isLHP
          ? '48% chọn 60 - 80 lần/phút (chuẩn là 100 - 120 lần/phút).'
          : '62% học sinh chọn hắt ngay xô nước vào ổ điện.',
        tip: isLHP
          ? 'Mở bài nhạc Stayin\' Alive (100-120 bpm) trong buổi thực hành.'
          : 'Thầy/Cô hãy dành 3 phút đầu tiết sinh hoạt nhấn mạnh quy tắc ngắt aptomat tổng.',
      },
      students: [
        { id: 'st_1', name: 'Nguyễn Văn Học', email: 'learner@mimo.com', streak: 12, xp: 2450, status: 'Đã nộp bài', score: 95 },
        { id: 'st_2', name: 'Trần Bảo An', email: 'an.tb@student.edu.vn', streak: 8, xp: 1980, status: 'Đã nộp bài', score: 90 },
        { id: 'st_3', name: 'Lê Gia Huy', email: 'huy.lg@student.edu.vn', streak: 15, xp: 3200, status: 'Đã nộp bài', score: 100 },
        { id: 'st_4', name: 'Phạm Quỳnh Chi', email: 'chi.pq@student.edu.vn', streak: 0, xp: 450, status: 'Chưa làm bài', score: 0 },
        { id: 'st_5', name: 'Hoàng Nhật Minh', email: 'minh.hn@student.edu.vn', streak: 4, xp: 1200, status: 'Đang làm dở', score: 65 },
      ],
    },
    {
      id: isLHP ? 'cls_lhp_11h' : 'cls_fpt_10a2',
      code: isLHP ? 'LHP-11H' : 'FPT-10A2',
      name: isLHP ? 'Lớp 11 Hóa — THPT Chuyên Lê Hồng Phong' : 'Lớp 10A2 — THPT FPT Cần Thơ',
      room: isLHP ? 'Phòng Lab Hóa học 1' : 'Phòng 304 - Toà Alpha',
      totalStudents: isLHP ? 38 : 40,
      completionRate: isLHP ? 90 : 75,
      avgStreak: isLHP ? 6.9 : 5.1,
      icon: isLHP ? '🧪' : '⚡',
      color: isLHP ? '#7C3AED' : '#D97706',
      bg: isLHP ? '#F3E8FF' : '#FEF3C7',
      topicFocus: isLHP ? 'An toàn hóa chất & Chống bỏng axit' : 'An toàn thiết bị điện & Ngắt aptomat tự động',
      redFlag: {
        question: 'Dây dẫn điện nóng chảy và bốc khói khét thì dùng gì dập đầu tiên?',
        wrongRate: 55,
        note: '55% học sinh chưa phân biệt được bình cứu hỏa CO2 và bình bọt nước.',
        tip: 'Cho học sinh thực hành xem ký hiệu bình khí CO2 dùng cho điện hạ thế.',
      },
      students: [
        { id: 'st_21', name: 'Vũ Đức Thịnh', email: 'thinh.vd@student.edu.vn', streak: 9, xp: 1800, status: 'Đã nộp bài', score: 85 },
        { id: 'st_22', name: 'Đặng Mai Lan', email: 'lan.dm@student.edu.vn', streak: 11, xp: 2100, status: 'Đã nộp bài', score: 90 },
        { id: 'st_23', name: 'Ngô Quốc Bảo', email: 'bao.nq@student.edu.vn', streak: 0, xp: 350, status: 'Chưa làm bài', score: 0 },
      ],
    },
    {
      id: isLHP ? 'cls_lhp_10t' : 'cls_fpt_10tin',
      code: isLHP ? 'LHP-10T' : 'FPT-10TIN',
      name: isLHP ? 'Lớp 10 Toán — THPT Chuyên Lê Hồng Phong' : 'Lớp 10 Chuyên Tin — THPT FPT Cần Thơ',
      room: isLHP ? 'Phòng 201 - Dãy B' : 'Phòng Lab Máy Tính 3',
      totalStudents: isLHP ? 35 : 36,
      completionRate: isLHP ? 97 : 92,
      avgStreak: isLHP ? 8.5 : 8.0,
      icon: isLHP ? '📐' : '💻',
      color: isLHP ? '#059669' : '#4F46E5',
      bg: isLHP ? '#D1FAE5' : '#EEF2FF',
      topicFocus: isLHP ? 'Kỹ năng thoát hiểm đám đông hỗn loạn' : 'Nhận diện Email Phishing & Mã độc tống tiền',
      redFlag: {
        question: 'Khi nhận email yêu cầu đổi mật khẩu gấp từ IT trường, bước xác minh chuẩn là gì?',
        wrongRate: 38,
        note: '38% học sinh vẫn bấm vào link trong email thay vì kiểm tra địa chỉ người gửi.',
        tip: 'Hướng dẫn học sinh di chuột xem đuôi tên miền @fpt.edu.vn.',
      },
      students: [
        { id: 'st_31', name: 'Đoàn Nhật Nam', email: 'nam.dn@student.edu.vn', streak: 14, xp: 3100, status: 'Đã nộp bài', score: 100 },
        { id: 'st_32', name: 'Bùi Kim Ngân', email: 'ngan.bk@student.edu.vn', streak: 16, xp: 3400, status: 'Đã nộp bài', score: 95 },
      ],
    },
  ]);

  // State: Đang chọn xem chi tiết lớp nào (null = đang ở màn hình danh sách nhiều lớp)
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Modal State
  const [projectorClass, setProjectorClass] = useState(null);
  const [nudgeSent, setNudgeSent] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassRoom, setNewClassRoom] = useState('');
  const [newClassTopic, setNewClassTopic] = useState('Kỹ năng PCCC & Thoát hiểm');
  const [showLiveQuizModal, setShowLiveQuizModal] = useState(false);
  const [quizPhase, setQuizPhase] = useState('WAITING'); // WAITING | RUNNING | LEADERBOARD
  const [quizCountdown, setQuizCountdown] = useState(15);

  const activeClass = teacherClasses.find((c) => c.id === selectedClassId) || teacherClasses[0];

  const handleSendNudge = (classCode) => {
    sound.playClick();
    setNudgeSent(true);
    alert(`🔔 Đã rung chuông nhắc nhở đến các em học sinh lớp ${classCode} chưa nộp bài!`);
    setTimeout(() => setNudgeSent(false), 4000);
  };

  const handleQuickAssign = (e) => {
    e.preventDefault();
    sound.playVictory();
    fireConfetti();
    setAssignSuccess('Đã giao bài tập mới thành công cho lớp!');
    setTimeout(() => {
      setShowAssignModal(false);
      setAssignSuccess('');
    }, 2000);
  };

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    sound.playVictory();
    fireConfetti();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newCls = {
      id: `cls_${Date.now()}`,
      code: `FPT-K10-${randomSuffix}`,
      name: newClassName.trim(),
      room: newClassRoom.trim() || 'Phòng học thông minh',
      totalStudents: 0,
      completionRate: 0,
      avgStreak: 0,
      icon: '🏫',
      color: '#0284C7',
      bg: '#E0F2FE',
      topicFocus: newClassTopic,
      redFlag: null,
      students: [],
    };
    setTeacherClasses([newCls, ...teacherClasses]);
    setShowCreateModal(false);
    setNewClassName('');
    setNewClassRoom('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '980px', margin: '0 auto' }}>
      {/* 1. THANH TRẠNG THÁI GIÁO VIÊN & GÓC NHÌN */}
      <div style={{
        background: '#EFF6FF',
        border: '1.5px solid #BFDBFE',
        borderRadius: '18px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#0284C7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            👨‍🏫
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>
              Không Gian Sư Phạm: {teacherUser?.name || 'Thầy Nguyễn Văn Nam (GV PCCC)'}
            </div>
            <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600 }}>
              Đang phụ trách {teacherClasses.length} lớp học • Tổng cộng {teacherClasses.reduce((sum, c) => sum + c.totalStudents, 0)} học sinh
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSwitchToLearnerView}
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#334155',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
        >
          <span>👁️</span>
          <span>Xem thử giao diện Học sinh</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MÀN HÌNH 1: DANH SÁCH NHIỀU LỚP HỌC ĐỂ GIÁO VIÊN CHỌN (selectedClassId === null) */}
      {/* ========================================================================= */}
      {!selectedClassId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Danh Sách Lớp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0' }}>
                🏫 Các Lớp Học Thầy/Cô Đang Giảng Dạy
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Bấm vào từng lớp để xem sổ điểm, phát hiện câu hỏi học sinh làm sai (Red Flags) hoặc chiếu QR máy chiếu
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              style={{
                background: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 18px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <span>➕</span>
              <span>Tạo Thêm Lớp Mới</span>
            </button>
          </div>

          {/* GRID THẺ CÁC LỚP HỌC CỦA GIÁO VIÊN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {teacherClasses.map((cls) => (
              <div
                key={cls.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '2px solid #E2E8F0',
                  padding: '22px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: cls.bg, color: cls.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {cls.icon}
                    </div>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '12px',
                      background: cls.bg,
                      color: cls.color,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      letterSpacing: '0.05em',
                    }}>
                      MÃ: {cls.code}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {cls.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                    {cls.room}
                  </div>

                  <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px', marginBottom: '14px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Sĩ số lớp:</span>
                      <strong style={{ color: '#0F172A' }}>{cls.totalStudents} học sinh</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Streak trung bình:</span>
                      <strong style={{ color: '#F59E0B' }}>🔥 {cls.avgStreak} ngày</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Tiến độ nộp bài:</span>
                      <strong style={{ color: '#15803D' }}>{cls.completionRate}%</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🎯</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong>Chuyên đề:</strong> {cls.topicFocus}
                    </span>
                  </div>
                </div>

                {/* 2 NÚT HÀNH ĐỘNG TRÊN THẺ LỚP */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedClassId(cls.id);
                    }}
                    style={{
                      flex: 1.3,
                      background: '#0284C7',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Vào Lớp Này →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setProjectorClass(cls);
                    }}
                    style={{
                      flex: 1,
                      background: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                    title="Chiếu mã QR lên máy chiếu lớp học"
                  >
                    <span>📺</span>
                    <span>Chiếu QR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MÀN HÌNH 2: CHI TIẾT 1 LỚP HỌC ĐƯỢC CHỌN (SỔ ĐIỂM + RED FLAGS + NHẮC NHỞ) */
        /* ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* THANH ĐIỀU HƯỚNG: NÚT BACK THOÁT LỚP HỌC */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowExitConfirmModal(true);
              }}
              style={{
                background: '#FFFFFF',
                color: '#334155',
                border: '1.5px solid #CBD5E1',
                borderRadius: '12px',
                padding: '9px 18px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#94A3B8';
                e.currentTarget.style.color = '#0F172A';
                e.currentTarget.style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.color = '#334155';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 900 }}>←</span>
              <span>Thoát lớp học</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#64748B',
            }}>
              <span>Đang xem chi tiết:</span>
              <span style={{
                background: activeClass.bg,
                color: activeClass.color,
                fontWeight: 800,
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '13px',
                border: `1px solid ${activeClass.color}33`,
              }}>
                {activeClass.icon} {activeClass.name}
              </span>
            </div>
          </div>

          {/* CARD CHI TIẾT LỚP HỌC */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid #E2E8F0',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{
                  background: activeClass.bg,
                  color: activeClass.color,
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  display: 'inline-block',
                  marginBottom: '8px',
                }}>
                  ĐANG QUẢN LÝ LỚP
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
                  {activeClass.name}
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Phòng học: <strong>{activeClass.room}</strong> • Mã lớp học sinh nhập: <strong style={{ color: activeClass.color, fontSize: '14px' }}>{activeClass.code}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setProjectorClass(activeClass);
                  }}
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '12px 20px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                  }}
                >
                  <span>📺</span>
                  <span>Chiếu QR Lên Bảng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAssignModal(true)}
                  style={{
                    background: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                  }}
                >
                  <span>🚀</span>
                  <span>Giao Bài Mới</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setQuizPhase('WAITING');
                    setQuizCountdown(15);
                    setShowLiveQuizModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                  }}
                >
                  <span>🎮</span>
                  <span>Đấu Trường Live Quiz</span>
                </button>
              </div>
            </div>

            {/* 3 Thống kê nhanh của lớp */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Sĩ số đã vào lớp</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                  {activeClass.totalStudents} <span style={{ fontSize: '14px', color: '#64748B' }}>em</span>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Tỷ lệ nộp bài tuần</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#15803D', marginTop: '4px' }}>
                  {activeClass.completionRate}%
                </div>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Streak trung bình</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>
                  🔥 {activeClass.avgStreak} ngày
                </div>
              </div>
            </div>

            {/* Bài tập tuần hiện tại */}
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>
                  Bài tập tuần đang diễn ra
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#14532D', marginTop: '4px' }}>
                  {activeClass.icon} {activeClass.topicFocus}
                </div>
                <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>
                  Hạn nộp: 23:59 Chủ Nhật tuần này
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSendNudge(activeClass.code)}
                disabled={nudgeSent}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#15803D',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🔔</span>
                <span>{nudgeSent ? '✓ Đã Rung Chuông Nhắc' : 'Rung Chuông Nhắc Học Sinh Chưa Nộp'}</span>
              </button>
            </div>
          </div>

          {/* CẢNH BÁO RED FLAGS SƯ PHẠM */}
          {activeClass.redFlag && (
            <div style={{
              background: '#FEF2F2',
              border: '1.5px solid #FECACA',
              borderRadius: '20px',
              padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', fontWeight: 900, fontSize: '16px' }}>
                  <span>🚩</span>
                  <span>Lỗ Hổng Kỹ Năng Của {activeClass.name} (Red Flags)</span>
                </div>
                <span style={{ fontSize: '11px', background: '#FEE2E2', color: '#DC2626', padding: '3px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  {activeClass.redFlag.wrongRate}% học sinh làm sai
                </span>
              </div>

              <p style={{ color: '#991B1B', fontSize: '14px', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                Trong bài tập vừa qua, câu hỏi <strong>"{activeClass.redFlag.question}"</strong> có tỷ lệ sai rất cao:
                <br />
                <em>{activeClass.redFlag.note}</em>
              </p>

              <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '12px 16px', border: '1px solid #FCA5A5', fontSize: '13px', color: '#7F1D1D' }}>
                💡 <strong>Gợi ý sư phạm cho Thầy/Cô:</strong> {activeClass.redFlag.tip}
              </div>
            </div>
          )}

          {/* SỔ ĐIỂM HỌC SINH CHI TIẾT */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                📝 Sổ Theo Dõi Tiến Độ: {activeClass.name}
              </h3>
              <span style={{ fontSize: '13px', color: '#64748B' }}>
                Đồng bộ thời gian thực ({activeClass.students.length} học sinh)
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 14px', fontSize: '12px', color: '#64748B', fontWeight: 800 }}>Học Sinh</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', color: '#64748B', fontWeight: 800 }}>Email</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', color: '#64748B', fontWeight: 800 }}>Streak</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', color: '#64748B', fontWeight: 800 }}>Điểm Bài</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', color: '#64748B', fontWeight: 800 }}>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {activeClass.students.map((st) => (
                    <tr key={st.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${st.name}`}
                            alt="Avatar"
                            style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F1F5F9' }}
                          />
                          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>{st.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '13px' }}>{st.email}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: st.streak > 0 ? '#F59E0B' : '#94A3B8' }}>
                        🔥 {st.streak} ngày
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: st.score >= 80 ? '#15803D' : (st.score > 0 ? '#B45309' : '#94A3B8') }}>
                        {st.score > 0 ? `${st.score}/100` : '—'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {st.status === 'Đã nộp bài' ? (
                          <span style={{ background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                            ✓ Đã Nộp Bài
                          </span>
                        ) : st.status === 'Đang làm dở' ? (
                          <span style={{ background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                            ⏳ Đang Làm Dở
                          </span>
                        ) : (
                          <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                            ✕ Chưa Làm Bài
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NÚT BACK THOÁT LỚP HỌC Ở DƯỚI ĐÁY TRANG */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowExitConfirmModal(true);
              }}
              style={{
                background: '#FFFFFF',
                color: '#334155',
                border: '1.5px solid #CBD5E1',
                borderRadius: '12px',
                padding: '10px 22px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#94A3B8';
                e.currentTarget.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 900 }}>←</span>
              <span>Thoát lớp học</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL TRÌNH CHIẾU MÁY CHIẾU LỚP HỌC (PROJECTOR QR) */}
      {/* ========================================================================= */}
      {projectorClass && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            padding: '40px',
            maxWidth: '680px',
            width: '92%',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <button
              onClick={() => setProjectorClass(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#F1F5F9',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '16px',
                color: '#64748B',
              }}
            >
              ✕
            </button>

            <div style={{ display: 'inline-block', background: '#EFF6FF', color: '#0284C7', padding: '6px 16px', borderRadius: '999px', fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>
              CHẾ ĐỘ TRÌNH CHIẾU MÁY CHIẾU • {projectorClass.name}
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px' }}>
              Quét Mã Để Vào Lớp & Nhận Bài Tuần
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px' }}>
              Phòng học: <strong>{projectorClass.room}</strong>
            </p>

            <div style={{
              background: '#F8FAFC',
              border: '2px dashed #CBD5E1',
              borderRadius: '20px',
              padding: '24px',
              display: 'inline-block',
              marginBottom: '20px',
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://mimo.edu.vn/join/${projectorClass.code}`}
                alt="QR Code Lớp Học"
                style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Hoặc nhập mã trực tiếp trên app:
              </div>
              <div style={{
                fontSize: '44px',
                fontWeight: 900,
                letterSpacing: '0.15em',
                color: '#0284C7',
                background: '#EFF6FF',
                display: 'inline-block',
                padding: '8px 24px',
                borderRadius: '16px',
                marginTop: '8px',
                border: '2px solid #BFDBFE',
              }}>
                {projectorClass.code}
              </div>
            </div>

            <div style={{ background: '#F1F5F9', borderRadius: '14px', padding: '16px', textAlign: 'left', fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
              <div>📱 <strong>Bước 1:</strong> Học sinh mở app MIMO trên điện thoại hoặc laptop.</div>
              <div>🏫 <strong>Bước 2:</strong> Bấm vào mục <strong>"Lớp Học Của Tôi"</strong> bên menu trái.</div>
              <div>✨ <strong>Bước 3:</strong> Nhập mã <strong>{projectorClass.code}</strong> để điểm danh nhận bài tuần!</div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setProjectorClass(null)}
                style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 28px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Đóng Máy Chiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL GIAO BÀI TẬP MỚI CHO LỚP */}
      {/* ========================================================================= */}
      {showAssignModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '480px', width: '90%' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              🚀 Giao Bài Tập Mới Cho {activeClass?.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
              Chọn tình huống từ ngân hàng chuẩn của MIMO để giao về nhà cho học sinh:
            </p>

            {assignSuccess && (
              <div style={{ padding: '12px', background: '#DCFCE7', color: '#15803D', borderRadius: '10px', fontWeight: 800, fontSize: '13px', marginBottom: '16px' }}>
                ✓ {assignSuccess}
              </div>
            )}

            <form onSubmit={handleQuickAssign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Chủ Đề Tình Huống:
                </label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}>
                  <option>🚑 Sơ cứu người bị hóc dị vật (Thủ thuật Heimlich)</option>
                  <option>🔥 Thoát hiểm khẩn cấp khi cháy chung cư cao tầng</option>
                  <option>🛡️ Nhận diện bẫy Deepfake lừa đảo gọi video mượn tiền</option>
                  <option>🚦 Điểm mù xe tải lớn và an toàn xe máy điện</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Hạn Chót Nộp Bài:
                </label>
                <input
                  type="text"
                  defaultValue="23:59 Chủ Nhật tuần này"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ background: '#0284C7', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Xác Nhận Giao Cho Lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL TẠO THÊM LỚP HỌC MỚI */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '460px', width: '90%' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              ➕ Tạo Thêm Lớp Học Mới
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
              MIMO sẽ tự động sinh mã lớp riêng biệt để Thầy/Cô chiếu lên bảng cho học sinh.
            </p>

            <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Tên Lớp Học:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lớp 10A3 — THPT FPT Cần Thơ"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Phòng Học:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phòng 305 - Toà Alpha"
                  value={newClassRoom}
                  onChange={(e) => setNewClassRoom(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Chuyên Đề Trọng Tâm:
                </label>
                <input
                  type="text"
                  value={newClassTopic}
                  onChange={(e) => setNewClassTopic(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ background: '#0284C7', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Tạo Lớp Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL XÁC NHẬN THOÁT LỚP HỌC (CONFIRM EXIT MODAL) */}
      {/* ========================================================================= */}
      {showExitConfirmModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          backdropFilter: 'blur(5px)',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '440px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid #E2E8F0',
          }}>
            {/* Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#FEF2F2',
              border: '2px solid #FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              margin: '0 auto 18px',
            }}>
              🚪
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px' }}>
              Xác nhận thoát lớp học?
            </h3>

            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 24px' }}>
              Thầy/Cô có chắc chắn muốn rời khỏi <strong>{activeClass?.name}</strong> để quay lại danh sách chọn các lớp học khác không?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowExitConfirmModal(false);
                }}
                style={{
                  flex: 1,
                  background: '#F1F5F9',
                  color: '#475569',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E2E8F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
              >
                Ở lại lớp
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowExitConfirmModal(false);
                  setSelectedClassId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  flex: 1.2,
                  background: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#B91C1C'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#DC2626'; }}
              >
                Thoát lớp học
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐẤU TRƯỜNG LIVE QUIZ (KAHOOT STYLE) */}
      {showLiveQuizModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
          <div style={{ background: '#1E1B4B', color: '#FFF', borderRadius: '24px', padding: '32px', width: '640px', maxWidth: '95%', textAlign: 'center', border: '2px solid #6366F1', boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)' }}>
            {quizPhase === 'WAITING' && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#A5B4FC', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  🎮 PHÒNG ĐẤU TRỰC TIẾP TRÊN LỚP • {activeClass.name}
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#FFF', margin: '10px 0 6px' }}>
                  Đấu Trường Sinh Tồn: {activeClass.topicFocus}
                </h2>
                <p style={{ color: '#C7D2FE', fontSize: '14px', marginTop: 0 }}>
                  Thầy/Cô hãy chiếu màn hình này lên máy chiếu để học sinh vào phòng đấu!
                </p>

                {/* MÃ PIN 6 SỐ */}
                <div style={{ margin: '20px auto', background: '#312E81', borderRadius: '16px', padding: '16px 24px', display: 'inline-block', border: '2px solid #818CF8' }}>
                  <div style={{ fontSize: '12px', color: '#A5B4FC', fontWeight: 700 }}>HỌC SINH VÀO MIMO NHẬP MÃ PIN:</div>
                  <div style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '6px', color: '#FDE047', margin: '6px 0' }}>
                    884 192
                  </div>
                  <div style={{ fontSize: '12px', color: '#818CF8' }}>Hoặc quét mã QR trên máy chiếu</div>
                </div>

                <div style={{ fontSize: '14px', color: '#E0E7FF', marginBottom: '24px' }}>
                  👥 Đã có <strong style={{ color: '#4ADE80', fontSize: '18px' }}>38/42</strong> học sinh đã sẵn sàng trong phòng đấu!
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowLiveQuizModal(false)}
                    style={{ background: '#374151', color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Đóng phòng đấu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playVictory();
                      setQuizPhase('RUNNING');
                    }}
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px 28px', fontWeight: 900, fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
                  >
                    🚀 Bắt Đầu Đấu Trường Ngay!
                  </button>
                </div>
              </div>
            )}

            {quizPhase === 'RUNNING' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ background: '#EF4444', color: '#FFF', padding: '4px 12px', borderRadius: '999px', fontWeight: 800, fontSize: '13px' }}>
                    CÂU HỎI 1/5
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#FDE047' }}>
                    ⏱️ Còn {quizCountdown}s
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.4, margin: '20px 0' }}>
                  "Khi phát hiện chập cháy ổ cắm điện trong lớp học, bước đầu tiên và quan trọng nhất cần làm ngay là gì?"
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '24px 0' }}>
                  <div style={{ background: '#DC2626', padding: '16px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', textAlign: 'left' }}>
                    🔴 A. Lấy xô nước hắt thẳng vào ổ cắm
                  </div>
                  <div style={{ background: '#2563EB', padding: '16px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', textAlign: 'left', border: '2px solid #60A5FA' }}>
                    🔵 B. Ngắt ngay Aptomat / Cầu dao tổng
                  </div>
                  <div style={{ background: '#D97706', padding: '16px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', textAlign: 'left' }}>
                    🟡 C. Dùng tay trần giật phích cắm ra
                  </div>
                  <div style={{ background: '#059669', padding: '16px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', textAlign: 'left' }}>
                    🟢 D. Chờ giáo viên đến xử lý
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playVictory();
                    fireConfetti();
                    setQuizPhase('LEADERBOARD');
                  }}
                  style={{ background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}
                >
                  ⚡ Hết Giờ — Xem Bảng Xếp Hạng Lớp →
                </button>
              </div>
            )}

            {quizPhase === 'LEADERBOARD' && (
              <div>
                <div style={{ fontSize: '36px' }}>🏆</div>
                <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#FDE047', margin: '8px 0 4px' }}>
                  BẢNG VÀNG ĐẤU TRƯỜNG {activeClass.code}
                </h2>
                <p style={{ color: '#C7D2FE', fontSize: '13px', marginTop: 0 }}>
                  Top 3 học sinh có phản xạ an toàn nhanh và chính xác nhất
                </p>

                <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', padding: '14px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '16px' }}>
                    <span>🥇 1. Lê Gia Huy (10A1)</span>
                    <span style={{ color: '#FEF3C7' }}>⚡ 1.2 giây • +1000 XP</span>
                  </div>
                  <div style={{ background: '#374151', padding: '12px 18px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '15px' }}>
                    <span>🥈 2. Nguyễn Văn Học</span>
                    <span style={{ color: '#9CA3AF' }}>⚡ 1.5 giây • +850 XP</span>
                  </div>
                  <div style={{ background: '#374151', padding: '12px 18px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '15px' }}>
                    <span>🥉 3. Trần Bảo An</span>
                    <span style={{ color: '#9CA3AF' }}>⚡ 2.1 giây • +700 XP</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setShowLiveQuizModal(false)}
                    style={{ background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Kết thúc trò chơi & Lưu sổ điểm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
