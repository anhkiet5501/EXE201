import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function PracticeRoomPage() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [heartsRecovered, setHeartsRecovered] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  // Danh sách các câu hỏi hay làm sai trích từ mistakes_bank
  const practiceQuestions = [
    {
      id: 'p1',
      title: 'Xử lý chảo dầu sôi bùng cháy trong bếp',
      question: 'Việc ĐẦU TIÊN và an toàn nhất bạn nên làm khi dầu ăn bốc cháy là gì?',
      options: [
        { id: '1', text: 'Tạt ngay một xô nước lạnh vào chảo dầu', correct: false },
        { id: '2', text: 'Dùng nắp vung kim loại đậy kín chảo và tắt bếp ngay', correct: true },
        { id: '3', text: 'Bê chảo dầu đang cháy chạy nhanh ra ngoài ban công', correct: false },
      ],
      explanation: 'Dầu nhẹ hơn nước nên tạt nước sẽ làm nổ cầu lửa bùng dữ dội. Đậy nắp vung giúp cách ly oxy làm lửa tự tắt ngay!',
    },
    {
      id: 'p2',
      title: 'Sơ cứu hóc dị vật đường thở ở người lớn (Heimlich)',
      question: 'Vị trí đặt tay chuẩn xác khi làm nghiệm pháp Heimlich là ở đâu?',
      options: [
        { id: '1', text: 'Ngay chính giữa xương ức của nạn nhân', correct: false },
        { id: '2', text: 'Trên rốn một chút và dưới mũi ức của nạn nhân', correct: true },
        { id: '3', text: 'Vỗ mạnh liên tục vào đỉnh đầu nạn nhân', correct: false },
      ],
      explanation: 'Vị trí trên rốn và dưới mũi ức giúp đẩy cơ hoành lên đột ngột, nén không khí trong phổi tống dị vật ra ngoài!',
    },
    {
      id: 'p3',
      title: 'Thoát hiểm chung cư khi có chuông báo cháy',
      question: 'Bạn ở tầng 8, bạn nên sử dụng phương tiện nào để di chuyển xuống sảnh?',
      options: [
        { id: '1', text: 'Chạy vào thang máy cho nhanh vì thang máy đi rất êm', correct: false },
        { id: '2', text: 'Đi cầu thang bộ thoát hiểm có cửa chống cháy đóng kín', correct: true },
        { id: '3', text: 'Trèo ra ngoài lan can ban công bám vào ống nước tụt xuống', correct: false },
      ],
      explanation: 'Hỏa hoạn có thể làm mất điện bất ngờ biến buồng thang máy thành lò thiêu. Luôn đi thang bộ thoát hiểm!',
    },
  ];

  const currentQ = practiceQuestions[currentIdx];

  const handleCheck = () => {
    sound.init();
    const opt = currentQ.options.find((o) => o.id === selectedOpt);
    if (opt?.correct) {
      sound.playCorrect();
      setFeedback('correct');
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);

      // Cứ 3 câu đúng ➔ Hồi 1 tim!
      if (newStreak % 3 === 0) {
        sound.playVictory();
        fireConfetti();
        setHeartsRecovered((prev) => prev + 1);
        alert('🎉 Tuyệt vời! Bạn đã trả lời đúng 3 câu liên tiếp và được hồi phục ngay +1 ❤️ Tim!');
      }
    } else {
      sound.playWrong();
      setFeedback('wrong');
      setCorrectStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick();
    setSelectedOpt(null);
    setFeedback(null);
    if (currentIdx + 1 < practiceQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(0); // Lặp lại ôn tập
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                  background: feedback && opt.correct ? '#DCFCE7' : feedback && isSelected && !opt.correct ? '#FEE2E2' : undefined,
                  borderColor: feedback && opt.correct ? '#22C55E' : feedback && isSelected && !opt.correct ? '#EF4444' : undefined,
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
            <strong>{feedback === 'correct' ? '✅ CHÍNH XÁC!' : '⚠️ CHƯA CHÍNH XÁC!'}</strong> {currentQ.explanation}
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
