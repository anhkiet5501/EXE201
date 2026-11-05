import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { learnerService } from '../../services/modules/learnerService';
import { getApiErrorMessage, isConnectionError } from '../../services/api/mockConfig';
import { sound, fireConfetti } from '../../utils/audioEffects';

// Hàm chuẩn hóa câu hỏi từ Backend DTO về cấu trúc UI đa dạng
const normalizeQuestions = (rawQuestions = []) => {
  return rawQuestions.map((q) => {
    // Nếu dữ liệu đã có sẵn format UI
    if (q.options && q.mimoDialogue) return q;

    const payload = q.payload || {};
    const type = (q.type || '').toLowerCase();

    // Dạng 1: Trắc nghiệm / Tình huống (choice)
    if (type === 'choice' || type === 'scenario_choice') {
      return {
        id: q.id,
        type: 'scenario_choice',
        question: payload.question || q.title,
        mimoDialogue: payload.scenario || payload.audioScript || 'Hãy phân tích tình huống và đưa ra quyết định chuẩn xác nhất!',
        mediaUrl: q.imageUrl || null,
        options: payload.options || [],
        difficulty: q.difficulty,
        source: q.source,
      };
    }

    // Dạng 2: Sắp xếp quy trình (sequence)
    if (type === 'sequence' || type === 'sequencing' || type === 'sequencing_steps') {
      return {
        id: q.id,
        type: 'sequencing_steps',
        question: q.title,
        mimoDialogue: payload.scenario || 'Hãy nhấn lần lượt các bước để xếp đúng quy trình chuẩn y tế!',
        mediaUrl: q.imageUrl || null,
        correctSequence: payload.items || [],
        difficulty: q.difficulty,
        source: q.source,
      };
    }

    // Dạng 3: Điểm bất thường / Lừa đảo (red flag)
    if (type === 'red_flag' || type === 'redflag' || type === 'spot_red_flag') {
      return {
        id: q.id,
        type: 'spot_red_flag',
        question: q.title,
        mimoDialogue: 'Cảnh giác! Hãy tìm chi tiết có dấu hiệu lừa đảo nguy hiểm!',
        sender: payload.smsHeader || 'Tin nhắn đáng ngờ',
        time: 'Vừa xong',
        messageSegments: payload.flags || [],
        difficulty: q.difficulty,
        source: q.source,
      };
    }

    return q;
  });
};

export default function LessonPlayPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('assignmentId');

  const [lessonData, setLessonData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [isPro, setIsPro] = useState(false);

  // Lựa chọn của người dùng cho từng loại câu hỏi
  const [selectedOption, setSelectedOption] = useState(null); // Cho trắc nghiệm
  const [sequenceSelected, setSequenceSelected] = useState([]); // Cho sắp xếp
  const [selectedFlag, setSelectedFlag] = useState(null); // Cho spot red flag
  const [trueFalseChoice, setTrueFalseChoice] = useState(null); // Cho đúng/sai

  // Trạng thái phiên chơi
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // idle, correct, wrong
  const [isChecking, setIsChecking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [shakeHeart, setShakeHeart] = useState(false);

  // Phản hồi thời gian thực từ Engine Backend
  const [currentCombo, setCurrentCombo] = useState(0);
  const [serverExplanation, setServerExplanation] = useState('');
  const [serverXpEarned, setServerXpEarned] = useState(10);
  const [comboBonus, setComboBonus] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [completionData, setCompletionData] = useState(null);

  // Lỗi khi khởi tạo phiên học (hết tim, bài bị khóa, mất mạng...) và lỗi khi nộp đáp án / tổng kết
  const [startError, setStartError] = useState(null); // { message, canRetry }
  const [startAttempt, setStartAttempt] = useState(0);
  const [actionError, setActionError] = useState('');
  const checkingRef = useRef(false);
  const completingRef = useRef(false);

  // Task B1: Khởi tạo phiên học từ Server
  useEffect(() => {
    setStartError(null);
    learnerService.startLesson(lessonId, assignmentId).then((res) => {
      const data = res.data || res;
      setSessionId(data.sessionId);
      if (typeof data.heartsRemaining === 'number') {
        setHearts(data.heartsRemaining);
      }
      if (data.isPro) {
        setIsPro(true);
      }

      const normalized = normalizeQuestions(data.questions || []);
      setLessonData({
        ...data,
        questions: normalized,
      });
      setQuestionStartTime(Date.now());
    }).catch((err) => {
      console.error('Không thể khởi tạo bài học:', err);
      setStartError({
        message: isConnectionError(err)
          ? 'Máy chủ đang khởi động hoặc mất kết nối. Vui lòng thử lại sau vài giây!'
          : getApiErrorMessage(err, 'Không thể bắt đầu bài học này.'),
        canRetry: isConnectionError(err),
      });
    });
  }, [lessonId, assignmentId, startAttempt]);

  const questions = lessonData?.questions || [];
  const currentQ = questions[currentIndex];

  // Lắng nghe phím tắt: 1, 2, 3, 4 và Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (feedbackStatus !== 'idle') {
        if (e.key === 'Enter') {
          handleContinue();
        }
        return;
      }

      if (currentQ?.type === 'scenario_choice' && currentQ.options) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          if (currentQ.options[optIdx]) {
            sound.playClick();
            setSelectedOption(currentQ.options[optIdx].id);
          }
        }
        if (e.key === 'Enter' && selectedOption) {
          handleCheck();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feedbackStatus, selectedOption, currentQ, sequenceSelected, selectedFlag, trueFalseChoice]);

  // Task B2: Kiểm tra đáp án qua Engine Backend
  const handleCheck = async () => {
    sound.init();
    if (!currentQ || isChecking || checkingRef.current) return;
    checkingRef.current = true;
    setIsChecking(true);
    setActionError('');

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    let submittedAnswer = {};

    if (currentQ.type === 'scenario_choice') {
      submittedAnswer = { selectedOptionId: selectedOption };
    } else if (currentQ.type === 'sequencing_steps') {
      submittedAnswer = { orderedItemIds: sequenceSelected };
    } else if (currentQ.type === 'spot_red_flag') {
      submittedAnswer = { selectedFlagId: selectedFlag };
    } else if (currentQ.type === 'rapid_true_false') {
      submittedAnswer = { selectedOptionId: trueFalseChoice ? 'true' : 'false' };
    }

    // Khóa cố định theo phiên + câu hỏi: gửi lại cùng câu sẽ được server nhận ra là trùng
    const idempotencyKey = `${sessionId}_${currentQ.id}`;

    try {
      const res = await learnerService.submitAnswer(
        sessionId,
        {
          questionId: currentQ.id,
          submittedAnswer,
          timeSpentSeconds: timeSpent,
        },
        idempotencyKey
      );

      const data = res.data || res;
      setServerExplanation(data.explanation || '');
      setServerXpEarned(data.xpEarned || 10);
      setComboBonus(data.comboBonusXp || 0);

      if (typeof data.heartsRemaining === 'number') {
        setHearts(data.heartsRemaining);
      }
      if (typeof data.currentComboStreak === 'number') {
        setCurrentCombo(data.currentComboStreak);
      }

      if (data.isCorrect) {
        sound.playCorrect();
        setFeedbackStatus('correct');
        setCorrectCount((prev) => prev + 1);
        setTotalXpEarned((prev) => prev + (data.xpEarned || 10));
      } else {
        sound.playWrong();
        setFeedbackStatus('wrong');
        setShakeHeart(true);
        setTimeout(() => setShakeHeart(false), 500);

        if (data.isSessionFailed || (data.heartsRemaining <= 0 && !isPro)) {
          setIsFailed(true);
        }
      }
    } catch (err) {
      console.error('Lỗi khi nộp câu trả lời lên server:', err);
      // Không chấm "sai" và không trừ tim ở client: server chưa ghi nhận gì, người dùng có thể gửi lại
      setActionError(
        isConnectionError(err)
          ? 'Mất kết nối tới máy chủ. Câu trả lời chưa được ghi nhận, hãy bấm KIỂM TRA để gửi lại.'
          : getApiErrorMessage(err, 'Không thể gửi câu trả lời.')
      );
    } finally {
      checkingRef.current = false;
      setIsChecking(false);
    }
  };

  // Task B4: Qua câu tiếp theo hoặc Tổng kết phiên học
  const handleContinue = async () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length && hearts > 0) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSequenceSelected([]);
      setSelectedFlag(null);
      setTrueFalseChoice(null);
      setFeedbackStatus('idle');
      setServerExplanation('');
      setActionError('');
      setQuestionStartTime(Date.now());
    } else {
      // Hoàn thành phiên học: Gọi POST /sessions/{id}/complete
      if (completingRef.current) return;
      completingRef.current = true;
      setActionError('');
      try {
        const res = await learnerService.completeSession(sessionId);
        const data = res.data || res;
        setCompletionData(data);
      } catch (err) {
        console.warn('Lỗi khi tổng kết phiên học:', err);
        // Chỉ ăn mừng khi server đã chốt phiên; nếu lỗi thì báo thật và cho thử lại
        setActionError(
          isConnectionError(err)
            ? 'Chưa chốt được kết quả bài học do mất kết nối. Bấm lại để thử lần nữa.'
            : getApiErrorMessage(err, 'Không thể hoàn thành bài học.')
        );
        completingRef.current = false;
        return;
      }
      completingRef.current = false;

      sound.playVictory();
      fireConfetti();
      setIsCompleted(true);
    }
  };

  if (startError) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '460px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚠️</div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>Chưa thể vào bài học</h2>
          <p style={{ color: '#64748B', fontSize: '14.5px', lineHeight: 1.5, margin: '0 0 24px 0' }}>{startError.message}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {startError.canRetry && (
              <button className="btn-3d btn-3d-green" onClick={() => setStartAttempt((n) => n + 1)}>
                THỬ LẠI
              </button>
            )}
            {/tim/i.test(startError.message) && (
              <button className="btn-3d btn-3d-green" onClick={() => navigate('/learn/practice')}>
                ĐẾN PHÒNG ÔN TẬP
              </button>
            )}
            <button className="btn-3d" onClick={() => navigate('/learn')}>
              VỀ BẢN ĐỒ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lessonData || !currentQ) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/images/mascot.png" alt="Mimo Mascot" style={{ width: '56px', height: '56px', objectFit: 'contain' }} className="anim-float" />
          <p style={{ fontWeight: 700, color: '#0EA5E9', marginTop: '12px' }}>Đang kết nối Gameplay Engine & tình huống khẩn cấp...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MÀN HÌNH VICTORY CHIẾN THẮNG (TỔNG KẾT NHÁNH B)
  // =========================================================================
  if (isCompleted) {
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    const finalXp = completionData?.totalXpEarned ?? totalXpEarned;
    const isPerfect = completionData?.isPerfectLesson ?? (correctCount === questions.length);
    const streakDays = completionData?.streakInfo?.streak ?? 1;

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box',
          fontFamily: 'var(--font-family)',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            border: '2px solid #E2E8F0',
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
            maxWidth: '460px',
            width: '100%',
            padding: '36px 32px',
            textAlign: 'center',
          }}
        >
          {/* Linh vật Mimo chính thức ăn mừng */}
          <div style={{ marginBottom: '16px' }}>
            <img
              src="/images/mimo_celebrating_3d.png"
              alt="Mimo Celebrating"
              className="anim-float"
              style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#15803D', margin: '0 0 6px 0' }}>
            BÀI HỌC HOÀN THÀNH!
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            Tuyệt vời! Bạn vừa trang bị thêm kỹ năng sinh tồn thực chiến để bảo vệ bản thân và người thân.
          </p>

          {/* Huy hiệu Perfect Lesson nếu không mất tim nào */}
          {isPerfect && (
            <div
              style={{
                background: 'linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)',
                border: '2px solid #EAB308',
                borderRadius: '16px',
                padding: '10px 16px',
                marginBottom: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#854D0E',
                fontWeight: 800,
                fontSize: '13.5px',
              }}
            >
              <span>👑</span>
              <span>BÀI HỌC HOÀN HẢO (+5 XP Thưởng Perfect!)</span>
            </div>
          )}

          {/* Bảng thành tích */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '28px',
            }}
          >
            <div style={{ background: '#FEF9C3', border: '1.5px solid #FDE047', borderRadius: '16px', padding: '14px 8px' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#B45309' }}>+{finalXp}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#854D0E' }}>⭐ XP KIẾM ĐƯỢC</div>
            </div>

            <div style={{ background: '#DCFCE7', border: '1.5px solid #86EFAC', borderRadius: '16px', padding: '14px 8px' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#15803D' }}>{accuracy}%</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534' }}>🎯 CHÍNH XÁC</div>
            </div>

            <div style={{ background: '#FFEDD5', border: '1.5px solid #FDBA74', borderRadius: '16px', padding: '14px 8px' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#C2410C' }}>🔥 {streakDays}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A3412' }}>CHUỖI NGÀY</div>
            </div>
          </div>

          {(assignmentId || completionData?.assignmentResult) && (
            <div
              style={{
                background: '#F0F9FF',
                border: '1.5px solid #BAE6FD',
                borderRadius: '16px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#0369A1',
                fontWeight: 800,
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
              }}
            >
              <span>🏫</span>
              <span>
                ĐÃ ĐỒNG BỘ SỔ ĐIỂM NHÀ TRƯỜNG! (Điểm: {completionData?.assignmentResult?.score ?? accuracy}%)
              </span>
            </div>
          )}

          <button
            onClick={() => navigate(assignmentId ? '/learn/classroom' : '/learn')}
            className="btn-3d btn-3d-green btn-3d-lg"
            style={{ width: '100%' }}
          >
            {assignmentId ? 'VỀ LỚP HỌC CỦA TÔI ➔' : 'TIẾP TỤC VỀ BẢN ĐỒ ➔'}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MÀN HÌNH CHƠI TÌNH HUỐNG (ZEN MODE)
  // =========================================================================
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  // Có nút kiểm tra sáng hay không
  const isCheckReady =
    (currentQ.type === 'scenario_choice' && selectedOption !== null) ||
    (currentQ.type === 'sequencing_steps' && sequenceSelected.length === currentQ.correctSequence.length) ||
    (currentQ.type === 'rapid_true_false' && trueFalseChoice !== null) ||
    (currentQ.type === 'spot_red_flag' && selectedFlag !== null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-family)',
        color: '#0F172A',
        position: 'relative',
        paddingBottom: '160px', // Chừa chỗ cho Bottom Sheet
      }}
    >
      {/* 1. THANH HEADER ĐIỀU HƯỚNG ZEN MODE */}
      <header
        style={{
          height: '70px',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Nút Thoát [✕] */}
        <button
          onClick={() => setShowExitConfirm(true)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '22px',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            lineHeight: 1,
          }}
          title="Thoát khỏi bài học"
        >
          ✕
        </button>

        {/* Thanh Progress Bar */}
        <div className="mimo-progress-bar">
          <div className="mimo-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Bộ đếm Tim */}
        <div
          className={shakeHeart ? 'anim-shake' : ''}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '16px',
            fontWeight: 800,
            color: '#DC2626',
            userSelect: 'none',
          }}
        >
          <span>❤️</span>
          <span>{hearts}</span>
        </div>
      </header>

      {/* 2. KHU VỰC TRÌNH BÀY TÌNH HUỐNG (SCENARIO STAGE) */}
      <main
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          width: '100%',
          padding: '24px',
          boxSizing: 'border-box',
          flex: 1,
        }}
      >
        {/* THẺ NGỮ CẢNH: ROBOT MIMO DẪN DẮT */}
        <div
          style={{
            background: '#F8FAFC',
            border: '2px solid #E2E8F0',
            borderRadius: '20px',
            padding: '18px 20px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
            marginBottom: '20px',
          }}
        >
          <img
            src="/images/mascot.png"
            alt="Mimo Mascot"
            className="anim-float"
            style={{ width: '44px', height: '44px', objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#0EA5E9', letterSpacing: '0.5px' }}>
              MIMO TÌNH HUỐNG THỰC CHIẾN
            </div>
            <p style={{ fontSize: '15px', color: '#1E293B', fontWeight: 600, margin: '4px 0 0 0', lineHeight: 1.5 }}>
              "{currentQ.mimoDialogue}"
            </p>
          </div>
        </div>

        {/* Ảnh minh họa nếu có */}
        {currentQ.mediaUrl && (
          <div
            style={{
              width: '100%',
              height: '200px',
              borderRadius: '18px',
              overflow: 'hidden',
              marginBottom: '24px',
              border: '2px solid #E2E8F0',
            }}
          >
            <img
              src={currentQ.mediaUrl}
              alt="Minh họa tình huống"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Tiêu đề câu hỏi */}
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 20px 0',
            lineHeight: 1.4,
            letterSpacing: '-0.2px',
          }}
        >
          {currentQ.question}
        </h2>

        {/* ===================================================================
            RENDER 4 DẠNG BÀI TẬP TƯƠNG TÁC
           =================================================================== */}

        {/* DẠNG 1: QUYẾT ĐỊNH TÌNH HUỐNG (SCENARIO CHOICE) */}
        {currentQ.type === 'scenario_choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.id;
              let extraClass = '';
              if (feedbackStatus === 'correct' && isSelected) extraClass = 'correct';
              if (feedbackStatus === 'wrong' && isSelected) extraClass = 'wrong';

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (feedbackStatus === 'idle') {
                      sound.playClick();
                      setSelectedOption(opt.id);
                    }
                  }}
                  className={`scenario-option-card ${isSelected ? 'selected' : ''} ${extraClass}`}
                >
                  <div className="scenario-option-key">{idx + 1}</div>
                  <div style={{ flex: 1, fontSize: '15px', lineHeight: 1.4 }}>{opt.text}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* DẠNG 2: SẮP XẾP QUY TRÌNH (SEQUENCING STEPS) */}
        {currentQ.type === 'sequencing_steps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 8px 0' }}>
              Nhấn lần lượt các bước để xếp đúng trình tự từ đầu đến cuối:
            </p>
            {currentQ.correctSequence.map((step) => {
              const orderIndex = sequenceSelected.indexOf(step.id);
              const isPicked = orderIndex !== -1;

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    if (feedbackStatus === 'idle') {
                      sound.playClick();
                      if (isPicked) {
                        setSequenceSelected(sequenceSelected.filter((id) => id !== step.id));
                      } else {
                        setSequenceSelected([...sequenceSelected, step.id]);
                      }
                    }
                  }}
                  className={`scenario-option-card ${isPicked ? 'selected' : ''}`}
                >
                  <div className="scenario-option-key">
                    {isPicked ? orderIndex + 1 : '○'}
                  </div>
                  <div style={{ flex: 1, fontSize: '14.5px' }}>{step.text}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* DẠNG 3: PHẢN XẠ ĐÚNG / SAI THẦN TỐC (RAPID TRUE/FALSE) */}
        {currentQ.type === 'rapid_true_false' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: '#FEF3C7',
                border: '2px solid #FDE047',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: '#78350F',
                lineHeight: 1.5,
              }}
            >
              "{currentQ.statement}"
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button
                onClick={() => {
                  if (feedbackStatus === 'idle') {
                    sound.playClick();
                    setTrueFalseChoice(true);
                  }
                }}
                className={`btn-3d ${trueFalseChoice === true ? 'btn-3d-green' : 'btn-3d-white'} btn-3d-lg`}
                style={{ fontSize: '18px' }}
              >
                ✓ ĐÚNG
              </button>

              <button
                onClick={() => {
                  if (feedbackStatus === 'idle') {
                    sound.playClick();
                    setTrueFalseChoice(false);
                  }
                }}
                className={`btn-3d ${trueFalseChoice === false ? 'btn-3d-red' : 'btn-3d-white'} btn-3d-lg`}
                style={{ fontSize: '18px' }}
              >
                ✕ SAI
              </button>
            </div>
          </div>
        )}

        {/* DẠNG 4: VẠCH LÁ TÌM SÂU (SPOT THE RED FLAG) */}
        {currentQ.type === 'spot_red_flag' && (
          <div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 12px 0' }}>
              Chạm ngón tay hoặc chuột vào đoạn nội dung chứa dấu hiệu lừa đảo:
            </p>
            <div
              style={{
                background: '#F1F5F9',
                border: '2px solid #CBD5E1',
                borderRadius: '20px',
                padding: '20px',
                maxWidth: '440px',
                margin: '0 auto',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
                <strong>{currentQ.sender}</strong>
                <span>{currentQ.time}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentQ.messageSegments.map((seg) => {
                  const isSelected = selectedFlag === seg.id;
                  return (
                    <div
                      key={seg.id}
                      onClick={() => {
                        if (feedbackStatus === 'idle') {
                          sound.playClick();
                          setSelectedFlag(seg.id);
                        }
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        background: isSelected ? '#FEE2E2' : '#FFFFFF',
                        border: isSelected ? '2px solid #EF4444' : '1px solid #E2E8F0',
                        color: isSelected ? '#B91C1C' : '#0F172A',
                        fontWeight: isSelected ? 700 : 500,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {seg.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          3. KHAY PHẢN HỒI DƯỚI ĐÁY (BOTTOM FEEDBACK SHEET)
         ===================================================================== */}
      <footer className={`mimo-feedback-sheet ${feedbackStatus}`}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* TRẠNG THÁI ①: CHỜ KIỂM TRA (IDLE) */}
          {feedbackStatus === 'idle' && (
            <>
              <div style={{ fontSize: '14px', color: actionError ? '#B91C1C' : '#64748B', fontWeight: 600, maxWidth: '540px' }}>
                {actionError ? `⚠️ ${actionError}` : '💡 Hãy suy nghĩ kỹ trước khi quyết định!'}
              </div>
              <button
                disabled={!isCheckReady}
                onClick={handleCheck}
                className={`btn-3d ${isCheckReady ? 'btn-3d-green' : 'btn-3d-disabled'} btn-3d-lg`}
              >
                KIỂM TRA
              </button>
            </>
          )}

          {/* TRẠNG THÁI ②: TRẢ LỜI ĐÚNG (SUCCESS) */}
          {feedbackStatus === 'correct' && (
            <>
              <div style={{ maxWidth: '540px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: 900, fontSize: '20px', marginBottom: '6px' }}>
                  <span>✅</span>
                  <span>CHÍNH XÁC! TUYỆT VỜI! (+{serverXpEarned} XP)</span>
                  {comboBonus > 0 && (
                    <span style={{ fontSize: '13px', background: '#FEF08A', color: '#854D0E', padding: '2px 8px', borderRadius: '999px', border: '1px solid #FACC15' }}>
                      🔥 Combo +{comboBonus} XP
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13.5px', color: '#166534', lineHeight: 1.4 }}>
                  {serverExplanation || currentQ.explanation}
                </div>
                {actionError && (
                  <div style={{ fontSize: '13px', color: '#B91C1C', fontWeight: 700, marginTop: '6px' }}>⚠️ {actionError}</div>
                )}
              </div>
              <button
                onClick={handleContinue}
                className="btn-3d btn-3d-green btn-3d-lg"
              >
                TIẾP TỤC ➔ (Enter)
              </button>
            </>
          )}

          {/* TRẠNG THÁI ③: TRẢ LỜI SAI (DANGER / ERROR) */}
          {feedbackStatus === 'wrong' && (
            <>
              <div style={{ maxWidth: '540px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontWeight: 900, fontSize: '20px', marginBottom: '6px' }}>
                  <span>⚠️</span>
                  <span>NGUY HIỂM! HÃY CẨN THẬN! {isPro ? '(🛡️ Pro: Vô hạn Tim)' : '(-1 ❤️)'}</span>
                </div>
                <div style={{ fontSize: '13.5px', color: '#991B1B', lineHeight: 1.4 }}>
                  {serverExplanation || currentQ.dangerAlert || currentQ.explanation}
                </div>
                {actionError && (
                  <div style={{ fontSize: '13px', color: '#7F1D1D', fontWeight: 700, marginTop: '6px' }}>⚠️ {actionError}</div>
                )}
              </div>
              <button
                onClick={handleContinue}
                className="btn-3d btn-3d-red btn-3d-lg"
              >
                ĐÃ HIỂU (Enter)
              </button>
            </>
          )}
        </div>
      </footer>

      {/* MODAL XÁC NHẬN THOÁT */}
      {showExitConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
          }}
          onClick={() => setShowExitConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '380px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🥺</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              Bạn có chắc muốn thoát?
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Tiến độ bài học này sẽ không được lưu và bạn sẽ chưa giữ được chuỗi Streak hôm nay đâu!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-3d btn-3d-green"
                onClick={() => setShowExitConfirm(false)}
              >
                TIẾP TỤC HỌC
              </button>
              <button
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#64748B',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#E2E8F0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onClick={() => navigate('/learn')}
              >
                THOÁT RA BẢN ĐỒ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
