import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/modules/adminService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function AdminApprovalsPage() {
  const [reviews, setReviews] = useState([]);
  const [curators, setCurators] = useState([]);
  const [activeTab, setActiveTab] = useState('QUEUE'); // QUEUE | CURATORS
  const [loading, setLoading] = useState(true);

  // Simulator Modal State
  const [simulatorLesson, setSimulatorLesson] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);

  // Reject Modal State
  const [rejectingLesson, setRejectingLesson] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    Promise.all([adminService.getPendingReviews(), adminService.getCurators()])
      .then(([reviewsRes, curatorsRes]) => {
        setReviews(reviewsRes.data);
        setCurators(curatorsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = (lessonId) => {
    sound.playVictory();
    fireConfetti();
    adminService.approveReview(lessonId).then((res) => {
      setReviews(res.data);
      showToast('🎉 Ký duyệt thành công! Kịch bản đã chính thức phát hành Live tới học viên toàn hệ thống.');
    });
  };

  const handleOpenRejectModal = (lesson) => {
    sound.playClick();
    setRejectingLesson(lesson);
    setRejectReason('');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    sound.playClick();
    adminService.rejectReview(rejectingLesson.id, rejectReason).then((res) => {
      setReviews(res.data);
      setRejectingLesson(null);
      showToast('📩 Đã gửi phản hồi yêu cầu chỉnh sửa ngược về Curator Studio.');
    });
  };

  const handleRollback = (lessonId) => {
    if (!window.confirm('⚠️ Bạn có chắc chắn muốn TẠM KHÓA khẩn cấp bài học này để ẩn khỏi học viên?')) return;
    sound.playClick();
    adminService.rollbackReview(lessonId).then((res) => {
      setReviews(res.data);
      showToast('⚠️ Đã tạm khóa khẩn cấp kịch bản để chờ Curator cập nhật.');
    });
  };

  const handleOpenSimulator = (lesson) => {
    sound.playClick();
    setSimulatorLesson(lesson);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswerFeedback(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Đang tải hàng chờ phê duyệt...</div>;
  }

  const currentQ = simulatorLesson?.questions?.[currentQuestionIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* TOAST THÔNG BÁO */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 999999,
          fontWeight: 700,
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>📢</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#0F172A', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
              MODULE 2
            </span>
            <span style={{ color: '#0284C7', fontWeight: 700, fontSize: '13px' }}>
              Content Gatekeeper &amp; Curator Governance
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            ✅ Quản Lý Phê Duyệt Kịch Bản &amp; Đội Ngũ Curator
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0' }}>
            Super Admin đóng vai trò là "Người Gác Cổng Tối Cao", thẩm định chất lượng y khoa &amp; PCCC trước khi xuất bản Live.
          </p>
        </div>

        {/* TABS CHUYỂN ĐỔI */}
        <div style={{ display: 'flex', background: '#E2E8F0', padding: '4px', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('QUEUE'); }}
            style={{
              background: activeTab === 'QUEUE' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'QUEUE' ? '#0F172A' : '#64748B',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: activeTab === 'QUEUE' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            📋 Hàng Chờ Duyệt Bài ({reviews.filter((r) => r.status === 'PENDING').length})
          </button>
          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('CURATORS'); }}
            style={{
              background: activeTab === 'CURATORS' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'CURATORS' ? '#0F172A' : '#64748B',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: activeTab === 'CURATORS' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            🩺 Đội Ngũ Chuyên Gia ({curators.length})
          </button>
        </div>
      </div>

      {/* TAB 1: HÀNG CHỜ PHÊ DUYỆT (PENDING REVIEW QUEUE) */}
      {activeTab === 'QUEUE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '22px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              {/* ẢNH COVER KỊCH BẢN */}
              <div style={{
                width: '130px',
                height: '110px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#F1F5F9',
                flexShrink: 0,
              }}>
                <img
                  src={item.scenarioCover}
                  alt={item.lessonTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* NỘI DUNG CHI TIẾT */}
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    background: '#EFF6FF',
                    color: '#0284C7',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}>
                    {item.category}
                  </span>

                  {item.status === 'PENDING' && (
                    <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      ⏳ Chờ Admin Ký Duyệt
                    </span>
                  )}
                  {item.status === 'APPROVED' && (
                    <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      🟢 Đã Xuất Bản Live
                    </span>
                  )}
                  {item.status === 'REJECTED' && (
                    <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      ❌ Yêu Cầu Chỉnh Sửa
                    </span>
                  )}
                  {item.status === 'ROLLED_BACK' && (
                    <span style={{ background: '#FEF2F2', color: '#991B1B', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      ⚠️ Đã Tạm Khóa Khẩn Cấp
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px' }}>
                  {item.lessonTitle}
                </h3>
                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px', lineHeight: '1.5' }}>
                  {item.summary}
                </p>

                {/* THÔNG TIN CURATOR & THÔNG SỐ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: '#64748B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img
                      src={item.curatorAvatar}
                      alt={item.curatorName}
                      style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                    />
                    <strong style={{ color: '#0F172A' }}>{item.curatorName}</strong> ({item.curatorRole})
                  </div>
                  <div>• {item.questionsCount} câu hỏi tương tác</div>
                  <div>• Ước tính: {item.estimatedMinutes} phút</div>
                  <div>• Thưởng: <strong>+{item.xpReward} XP</strong></div>
                  <div>• Gửi lúc: {item.submittedAt}</div>
                </div>

                {item.rejectReason && (
                  <div style={{ marginTop: '10px', background: '#FEF2F2', padding: '10px 14px', borderRadius: '10px', fontSize: '12.5px', color: '#991B1B', border: '1px solid #FECACA' }}>
                    <strong>Ghi chú từ chối:</strong> {item.rejectReason}
                  </div>
                )}
              </div>

              {/* CÁC NÚT THAO TÁC CỦA ADMIN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                {item.questions && item.questions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleOpenSimulator(item)}
                    style={{
                      background: '#F8FAFC',
                      color: '#0F172A',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '9px 14px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>👁️</span>
                    <span>Xem thử trên Giả lập</span>
                  </button>
                )}

                {item.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      style={{
                        background: '#15803D',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '9px 14px',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)',
                      }}
                    >
                      <span>✅</span>
                      <span>Ký Duyệt Phát Hành</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenRejectModal(item)}
                      style={{
                        background: '#FFFFFF',
                        color: '#DC2626',
                        border: '1.5px solid #FCA5A5',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>❌</span>
                      <span>Yêu Cầu Sửa</span>
                    </button>
                  </>
                )}

                {item.status === 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => handleRollback(item.id)}
                    style={{
                      background: '#FFF1F2',
                      color: '#E11D48',
                      border: '1px solid #FECDD3',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ⚠️ Tạm Khóa Khẩn Cấp
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ĐỘI NGŨ CHUYÊN GIA CURATOR */}
      {activeTab === 'CURATORS' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 16px' }}>
            🩺 Danh Sách Chuyên Gia Được Phê Chuẩn (Curator Roster)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Chuyên gia</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Chuyên môn công tác</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Chuyên đề được phân bổ</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Bài đã duyệt</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Đánh giá</th>
                <th style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {curators.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0F172A' }}>
                    <div>{c.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '14px', fontSize: '13px', color: '#334155' }}>{c.specialty}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ background: '#EFF6FF', color: '#0284C7', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                      {c.domain}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#15803D' }}>{c.approvedCourses} bài</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#F59E0B' }}>⭐ {c.rating}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                      ✓ Đang hoạt động
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. MODAL GIẢ LẬP ĐIỆN THOẠI TRẢI NGHIỆM BÀI HỌC (MOBILE SIMULATOR) */}
      {simulatorLesson && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(6px)',
        }}>
          {/* PHONE FRAME (MÔ PHỎNG SMARTPHONE) */}
          <div style={{
            width: '380px',
            height: '740px',
            background: '#FFFFFF',
            borderRadius: '44px',
            border: '10px solid #1E293B',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* NOTCH / CAMERA TAI THỎ */}
            <div style={{
              width: '120px',
              height: '24px',
              background: '#1E293B',
              borderRadius: '0 0 16px 16px',
              margin: '0 auto',
              zIndex: 10,
            }}></div>

            {/* HEADER SIMULATOR */}
            <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                📱 MIMO SIMULATOR
              </div>
              <button
                type="button"
                onClick={() => setSimulatorLesson(null)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '12px',
                }}
              >
                ✕
              </button>
            </div>

            {/* NỘI DUNG CÂU HỎI */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                Câu {currentQuestionIndex + 1} / {simulatorLesson.questions?.length || 1}
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: '0 0 16px', lineHeight: 1.4 }}>
                {currentQ?.prompt}
              </h4>

              {/* DANH SÁCH ĐÁP ÁN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {currentQ?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  let optBorder = '#E2E8F0';
                  let optBg = '#FFFFFF';

                  if (showAnswerFeedback) {
                    if (isCorrect) {
                      optBorder = '#22C55E';
                      optBg = '#DCFCE7';
                    } else if (isSelected) {
                      optBorder = '#EF4444';
                      optBg = '#FEE2E2';
                    }
                  } else if (isSelected) {
                    optBorder = '#0284C7';
                    optBg = '#F0F9FF';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={showAnswerFeedback}
                      onClick={() => { sound.playClick(); setSelectedOption(idx); }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: `2px solid ${optBorder}`,
                        background: optBg,
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: showAnswerFeedback ? 'default' : 'pointer',
                        lineHeight: 1.4,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* FEEDBACK GIẢI THÍCH CHUYÊN MÔN */}
              {showAnswerFeedback && (
                <div style={{
                  background: selectedOption === currentQ?.correctIndex ? '#DCFCE7' : '#FEE2E2',
                  padding: '12px',
                  borderRadius: '12px',
                  marginTop: '14px',
                  fontSize: '12px',
                  color: selectedOption === currentQ?.correctIndex ? '#15803D' : '#991B1B',
                  lineHeight: 1.5,
                }}>
                  <strong>{selectedOption === currentQ?.correctIndex ? '✓ Chuẩn y khoa / PCCC!' : '✕ Chưa chuẩn xác!'}</strong>
                  <br />
                  {currentQ?.explanation}
                </div>
              )}
            </div>

            {/* FOOTER ACTIONS CỦA SIMULATOR */}
            <div style={{ padding: '16px', borderTop: '1px solid #F1F5F9', background: '#FAFAFA' }}>
              {!showAnswerFeedback ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={() => setShowAnswerFeedback(true)}
                  style={{
                    width: '100%',
                    background: selectedOption !== null ? '#0284C7' : '#CBD5E1',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
                  }}
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {currentQuestionIndex < (simulatorLesson.questions?.length - 1) ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                        setSelectedOption(null);
                        setShowAnswerFeedback(false);
                      }}
                      style={{
                        flex: 1,
                        background: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Câu tiếp theo →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleApprove(simulatorLesson.id);
                        setSimulatorLesson(null);
                      }}
                      style={{
                        flex: 1,
                        background: '#15803D',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      ✅ Đạt Chuẩn - Ký Duyệt Luôn
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL TỪ CHỐI / YÊU CẦU SỬA */}
      {rejectingLesson && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(5px)',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '520px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px' }}>
              ❌ Yêu Cầu Chỉnh Sửa Kịch Bản
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
              Gửi phản hồi cụ thể cho <strong>{rejectingLesson.curatorName}</strong> để hoàn thiện lại bộ câu hỏi.
            </p>

            <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Lý do yêu cầu sửa (Sai sót y khoa, ảnh dung lượng nặng, chưa đủ rõ ràng...):
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ví dụ: Câu 2 hình ảnh minh họa vết bỏng chưa đúng với độ bỏng mô tả trong câu hỏi..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRejectingLesson(null)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Gửi Phản Hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
