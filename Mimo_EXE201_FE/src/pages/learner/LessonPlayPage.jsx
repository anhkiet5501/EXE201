import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { learnerService } from '../../services/modules/learnerService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function LessonPlayPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [selectedOption, setSelectedOption] = useState(null); // Cho trắc nghiệm
  const [sequenceSelected, setSequenceSelected] = useState([]); // Cho sắp xếp
  const [selectedFlag, setSelectedFlag] = useState(null); // Cho spot red flag
  const [trueFalseChoice, setTrueFalseChoice] = useState(null); // Cho đúng/sai

  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // idle, correct, wrong
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [shakeHeart, setShakeHeart] = useState(false);

  useEffect(() => {
    learnerService.getLessonDetail(lessonId).then((res) => {
      setLessonData(res.data);
    });
  }, [lessonId]);

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

      if (currentQ?.type === 'scenario_choice') {
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

  // Kiểm tra đáp án
  const handleCheck = () => {
    sound.init();
    if (!currentQ) return;

    let isCorrect = false;

    if (currentQ.type === 'scenario_choice') {
      const chosen = currentQ.options.find((o) => o.id === selectedOption);
      isCorrect = chosen?.isCorrect === true;
    } else if (currentQ.type === 'sequencing_steps') {
      // Đúng nếu đã chọn đủ 4 bước
      isCorrect = sequenceSelected.length === currentQ.correctSequence.length;
    } else if (currentQ.type === 'rapid_true_false') {
      isCorrect = trueFalseChoice === currentQ.correctAnswer;
    } else if (currentQ.type === 'spot_red_flag') {
      const chosenSeg = currentQ.messageSegments.find((s) => s.id === selectedFlag);
      isCorrect = chosenSeg?.isFlag === true;
    }

    if (isCorrect) {
      sound.playCorrect();
      setFeedbackStatus('correct');
      setCorrectCount((prev) => prev + 1);
    } else {
      sound.playWrong();
      setFeedbackStatus('wrong');
      setHearts((prev) => Math.max(0, prev - 1));
      setShakeHeart(true);
      setTimeout(() => setShakeHeart(false), 500);
    }
  };

  // Qua câu tiếp theo hoặc hoàn thành bài học
  const handleContinue = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length && hearts > 0) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSequenceSelected([]);
      setSelectedFlag(null);
      setTrueFalseChoice(null);
      setFeedbackStatus('idle');
    } else {
      // Hoàn thành bài học!
      sound.playVictory();
      fireConfetti();
      setIsCompleted(true);
    }
  };

  if (!lessonData || !currentQ) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/images/mascot.png" alt="Mimo Mascot" style={{ width: '56px', height: '56px', objectFit: 'contain' }} className="anim-float" />
          <p style={{ fontWeight: 700, color: '#0EA5E9', marginTop: '12px' }}>Đang chuẩn bị tình huống khẩn cấp...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MÀN HÌNH VICTORY CHIẾN THẮNG
  // =========================================================================
  if (isCompleted) {
    const accuracy = Math.round((correctCount / questions.length) * 100);

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
          <p style={{ color: '#64748B', fontSize: '15px', margin: '0 0 28px 0', lineHeight: 1.5 }}>
            Tuyệt vời! Bạn vừa trang bị thêm kỹ năng sinh tồn thực chiến để bảo vệ bản thân và người thân.
          </p>

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
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#B45309' }}>+15</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#854D0E' }}>⭐ XP KIẾM ĐƯỢC</div>
            </div>

            <div style={{ background: '#DCFCE7', border: '1.5px solid #86EFAC', borderRadius: '16px', padding: '14px 8px' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#15803D' }}>{accuracy}%</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534' }}>🎯 CHÍNH XÁC</div>
            </div>

            <div style={{ background: '#FFEDD5', border: '1.5px solid #FDBA74', borderRadius: '16px', padding: '14px 8px' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#C2410C' }}>🔥 7</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A3412' }}>CHUỖI NGÀY</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/learn')}
            className="btn-3d btn-3d-green btn-3d-lg"
            style={{ width: '100%' }}
          >
            TIẾP TỤC VỀ BẢN ĐỒ ➔
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
              <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>
                💡 Hãy suy nghĩ kỹ trước khi quyết định!
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
                  <span>CHÍNH XÁC! TUYỆT VỜI! (+{currentQ.xp || 10} XP)</span>
                </div>
                <div style={{ fontSize: '13.5px', color: '#166534', lineHeight: 1.4 }}>
                  {currentQ.explanation}
                </div>
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
                  <span>NGUY HIỂM! HÃY CẨN THẬN! (-1 ❤️)</span>
                </div>
                <div style={{ fontSize: '13.5px', color: '#991B1B', lineHeight: 1.4 }}>
                  {currentQ.dangerAlert || currentQ.explanation}
                </div>
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
