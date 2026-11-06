import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sound, fireConfetti } from '../../utils/audioEffects';
import { learnerService } from '../../services/modules/learnerService';
import ProDeepReview from '../../components/pro/ProDeepReview';
import { useProStatus } from '../../hooks/useProStatus';
import { USE_MOCK, getApiErrorMessage } from '../../services/api/mockConfig';

// Danh sách dự phòng nếu người dùng chưa từng làm sai câu nào
const defaultPracticeQuestions = [
  {
    id: 'p1',
    questionId: 'd1111111-1111-1111-1111-111111111111',
    title: 'Phát hiện chập điện bốc khói sau tủ lạnh, việc ĐẦU TIÊN bạn làm là gì?',
    question: 'Phát hiện chập điện bốc khói sau tủ lạnh, việc ĐẦU TIÊN bạn làm là gì?',
    options: [
      { id: 'A', text: 'Tạt ngay xô nước vào phía sau tủ lạnh' },
      { id: 'B', text: 'Ngắt cầu dao tổng để cô lập nguồn điện' },
      { id: 'C', text: 'Mở toang cửa sổ gọi to nhờ hàng xóm' },
    ],
    explanation: 'Nước dẫn điện cực mạnh gây giật tử vong ngay tại chỗ. Việc đầu tiên bắt buộc phải làm là ngắt cầu dao tổng để cô lập hoàn toàn nguồn điện.',
  },
  {
    id: 'p2',
    questionId: 'd2222222-2222-2222-2222-222222222222',
    title: 'Sơ cứu hóc dị vật đường thở ở người lớn (Heimlich)',
    question: 'Vị trí đặt tay chuẩn xác khi làm nghiệm pháp Heimlich là ở đâu?',
    options: [
      { id: 'A', text: 'Ngay chính giữa xương ức của nạn nhân' },
      { id: 'B', text: 'Trên rốn một chút và dưới mũi ức của nạn nhân' },
      { id: 'C', text: 'Vỗ mạnh liên tục vào đỉnh đầu nạn nhân' },
    ],
    explanation: 'Vị trí trên rốn và dưới mũi ức giúp đẩy cơ hoành lên đột ngột, nén không khí trong phổi tống dị vật ra ngoài!',
  },
];

function StandardPractice() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(defaultPracticeQuestions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [heartsRecovered, setHeartsRecovered] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [serverExplanation, setServerExplanation] = useState('');
  const [isFromBackend, setIsFromBackend] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Task B5: Lấy danh sách câu sai từ Backend
  useEffect(() => {
    learnerService.getWrongQuestions().then((res) => {
      const data = res.data || res;
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((wq, idx) => {
          const payload = wq.payload || {};
          return {
            id: wq.id || `wq_${idx}`,
            questionId: wq.questionId || wq.id,
            title: wq.title,
            question: payload.question || wq.title,
            options: payload.options || [
              { id: 'A', text: 'Lựa chọn A' },
              { id: 'B', text: 'Lựa chọn B' },
              { id: 'C', text: 'Lựa chọn C' },
            ],
            timesWrong: wq.timesWrong || 1,
            explanation: '',
          };
        });
        setQuestions(formatted);
        setIsFromBackend(true);
      }
    }).catch((err) => {
      console.warn('Lỗi lấy wrong-questions:', err);
    });
  }, []);

  const currentQ = questions[currentIdx] || defaultPracticeQuestions[0];

  // Task B5: Nộp câu trả lời ôn tập lên Backend
  const handleCheck = async () => {
    sound.init();
    if (!selectedOpt || isChecking) return;
    setIsChecking(true);
    setSubmitError('');

    try {
      const res = await learnerService.submitPracticeAnswer({
        questionId: currentQ.questionId || currentQ.id,
        submittedAnswer: { selectedOptionId: selectedOpt },
        timeSpentSeconds: 10,
      });

      const data = res.data || res;
      setServerExplanation(data.explanation || currentQ.explanation);

      if (data.isCorrect) {
        sound.playVictory();
        fireConfetti();
        setFeedback('correct');
        const newStreak = correctStreak + 1;
        setCorrectStreak(newStreak);
        const recovered = data.heartRecovered ?? 1;
        setHeartsRecovered((prev) => prev + recovered);
      } else {
        sound.playWrong();
        setFeedback('wrong');
        setCorrectStreak(0);
      }
    } catch (err) {
      console.warn('Lỗi khi nộp bài ôn tập lên server:', err);
      if (!USE_MOCK) {
        // Không giả lập kết quả: hồi tim/XP chỉ có giá trị khi server đã ghi nhận
        setSubmitError(getApiErrorMessage(err, 'Không gửi được đáp án lên máy chủ. Vui lòng thử lại.'));
        return;
      }
      // Chế độ mock (VITE_USE_MOCK=true): giả lập cục bộ
      if (selectedOpt === 'B') {
        sound.playVictory();
        fireConfetti();
        setFeedback('correct');
        setCorrectStreak((prev) => prev + 1);
        setHeartsRecovered((prev) => prev + 1);
        setServerExplanation(currentQ.explanation);
      } else {
        sound.playWrong();
        setFeedback('wrong');
        setCorrectStreak(0);
        setServerExplanation(currentQ.explanation);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleNext = () => {
    sound.playClick();
    setSelectedOpt(null);
    setFeedback(null);
    setServerExplanation('');
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(0); // Lặp lại ôn tập
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {submitError && (
        <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', color: '#B91C1C', fontSize: '13.5px' }}>
          ⚠️ {submitError}
        </div>
      )}
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎯</span>
            <span>Phòng Ôn tập & Hồi Tim</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Luyện lại các câu sai trong quá khứ. Cứ <strong>3 câu đúng liên tiếp ➔ +1 Tim ❤️</strong>!
          </p>
        </div>

        <button
          onClick={() => navigate('/learn')}
          style={{
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '999px',
            color: '#475569',
            padding: '9px 18px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#E2E8F0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#F1F5F9'}
        >
          <span>✕</span>
          <span>Quay lại bản đồ</span>
        </button>
      </div>

      {/* Thanh tiến độ chuỗi đúng để hồi tim */}
      <div
        style={{
          background: '#FFFFFF',
          border: '2px solid #E2E8F0',
          borderRadius: '20px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>❤️</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#DC2626' }}>
              Tiến độ hồi tim: {correctStreak % 3}/3 câu đúng
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Đã hồi được: +{heartsRecovered} Tim hôm nay
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3].map((step) => {
            const isFilled = (correctStreak % 3) >= step || ((correctStreak % 3 === 0) && correctStreak > 0);
            return (
              <div
                key={step}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isFilled ? '#22C55E' : '#E2E8F0',
                  color: isFilled ? '#FFFFFF' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '12px',
                }}
              >
                {isFilled ? '✓' : step}
              </div>
            );
          })}
        </div>
      </div>

      {/* Thẻ câu hỏi ôn tập */}
      <div
        style={{
          background: '#FFFFFF',
          border: '2px solid #E2E8F0',
          borderRadius: '24px',
          padding: '24px',
        }}
      >
        <span
          style={{
            background: '#FEF3C7',
            color: '#B45309',
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '999px',
          }}
        >
          CÂU ÔN TẬP #{currentIdx + 1}
        </span>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '12px 0 18px 0' }}>
          {currentQ.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {currentQ.options.map((opt) => {
            const isSelected = selectedOpt === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  if (!feedback) {
                    sound.playClick();
                    setSelectedOpt(opt.id);
                  }
                }}
                className={`scenario-option-card ${isSelected ? 'selected' : ''}`}
                style={{
                  background: feedback === 'correct' && isSelected ? '#DCFCE7' : feedback === 'wrong' && isSelected ? '#FEE2E2' : undefined,
                  borderColor: feedback === 'correct' && isSelected ? '#22C55E' : feedback === 'wrong' && isSelected ? '#EF4444' : undefined,
                }}
              >
                <div className="scenario-option-key">{opt.id}</div>
                <div style={{ flex: 1, fontSize: '14.5px' }}>{opt.text}</div>
              </div>
            );
          })}
        </div>

        {/* Giải thích khi đã kiểm tra */}
        {feedback && (
          <div
            style={{
              background: feedback === 'correct' ? '#F0FDF4' : '#FEF2F2',
              border: `1.5px solid ${feedback === 'correct' ? '#86EFAC' : '#FECACA'}`,
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '20px',
              fontSize: '13.5px',
              color: feedback === 'correct' ? '#166534' : '#991B1B',
              lineHeight: 1.4,
            }}
          >
            <strong>{feedback === 'correct' ? '✅ CHÍNH XÁC! (+1 ❤️ Hồi phục tim)' : '⚠️ CHƯA CHÍNH XÁC! (Ôn tập không bị trừ tim)'}</strong>{' '}
            {serverExplanation || currentQ.explanation}
          </div>
        )}

        <div>
          {!feedback ? (
            <button
              disabled={!selectedOpt}
              onClick={handleCheck}
              className={`btn-3d ${selectedOpt ? 'btn-3d-green' : 'btn-3d-disabled'} btn-3d-lg`}
              style={{ width: '100%' }}
            >
              KIỂM TRA ĐÁP ÁN
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-3d btn-3d-blue btn-3d-lg"
              style={{ width: '100%' }}
            >
              CÂU TIẾP THEO ➔
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Phòng ôn tập: tab "Hồi tim" (mọi người dùng) và tab "Ôn tập chuyên sâu" (Mimo Pro). */
export default function PracticeRoomPage() {
  const { isPro } = useProStatus();
  const [mode, setMode] = useState('standard');

  const tabStyle = (active) => ({
    flex: 1,
    padding: '12px 14px',
    borderRadius: '14px',
    border: `2px solid ${active ? '#F59E0B' : '#E2E8F0'}`,
    background: active ? '#FFFBEB' : '#FFFFFF',
    color: active ? '#92400E' : '#475569',
    fontWeight: 800,
    fontSize: '14px',
    cursor: 'pointer',
  });

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setMode('standard')} style={tabStyle(mode === 'standard')}>
          🎯 Ôn tập hồi tim
        </button>
        <button onClick={() => setMode('deep')} style={tabStyle(mode === 'deep')}>
          👑 Ôn tập chuyên sâu {!isPro && '🔒'}
        </button>
      </div>
      {mode === 'standard' ? <StandardPractice /> : <ProDeepReview />}
    </div>
  );
}
