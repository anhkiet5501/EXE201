import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { curatorService } from '../../services/modules/curatorService';
import { mockCuratorData } from '../../services/mocks/mockCurator';

export default function CuratorBuilderPage() {
  const [searchParams] = useSearchParams();
  const scenarioId = searchParams.get('id') || 'scen_01';

  const [activeScenario, setActiveScenario] = useState(mockCuratorData.builderActiveScenario);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Trạng thái Mobile Simulator
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [simSubmitted, setSimSubmitted] = useState(false);
  const [countdownRemaining, setCountdownRemaining] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showToast, setShowToast] = useState(null);

  // Lấy câu hỏi hiện tại đang soạn
  const currentQ = activeScenario.questions[currentQIndex] || activeScenario.questions[0];

  useEffect(() => {
    // Reset lựa chọn khi chuyển câu hỏi
    setSelectedChoiceId(null);
    setSimSubmitted(false);
    setCountdownRemaining(currentQ?.countdown || 15);
  }, [currentQIndex, currentQ]);

  // Cập nhật trường của câu hỏi hiện tại
  const updateCurrentQuestion = (field, value) => {
    const updatedQuestions = [...activeScenario.questions];
    updatedQuestions[currentQIndex] = {
      ...updatedQuestions[currentQIndex],
      [field]: value,
    };
    setActiveScenario({
      ...activeScenario,
      questions: updatedQuestions,
    });
  };

  // Cập nhật phương án lựa chọn
  const updateChoice = (choiceIndex, field, value) => {
    const updatedQuestions = [...activeScenario.questions];
    const updatedChoices = [...updatedQuestions[currentQIndex].choices];
    updatedChoices[choiceIndex] = {
      ...updatedChoices[choiceIndex],
      [field]: value,
    };
    updatedQuestions[currentQIndex].choices = updatedChoices;
    setActiveScenario({
      ...activeScenario,
      questions: updatedQuestions,
    });
  };

  // Đổi trạng thái đúng/sai
  const toggleChoiceCorrect = (choiceIndex) => {
    const updatedQuestions = [...activeScenario.questions];
    const updatedChoices = updatedQuestions[currentQIndex].choices.map((c, idx) => ({
      ...c,
      isCorrect: idx === choiceIndex,
    }));
    updatedQuestions[currentQIndex].choices = updatedChoices;
    setActiveScenario({
      ...activeScenario,
      questions: updatedQuestions,
    });
  };

  // Thêm lựa chọn mới
  const addChoice = () => {
    const updatedQuestions = [...activeScenario.questions];
    const nextLetter = String.fromCharCode(65 + updatedQuestions[currentQIndex].choices.length);
    updatedQuestions[currentQIndex].choices.push({
      id: `c_${Date.now()}`,
      text: `Phương án mới (${nextLetter})`,
      isCorrect: false,
      feedback: 'Ghi chú cảnh báo hoặc giải thích y tế cho phương án này...',
    });
    setActiveScenario({
      ...activeScenario,
      questions: updatedQuestions,
    });
  };

  // Xóa lựa chọn
  const removeChoice = (choiceIndex) => {
    if (currentQ.choices.length <= 2) {
      alert('Tình huống cần có tối thiểu 2 phương án lựa chọn!');
      return;
    }
    const updatedQuestions = [...activeScenario.questions];
    updatedQuestions[currentQIndex].choices.splice(choiceIndex, 1);
    setActiveScenario({
      ...activeScenario,
      questions: updatedQuestions,
    });
  };

  // Thêm tình huống mới vào chặng
  const addNewQuestion = () => {
    const newQ = {
      id: `q_${Date.now()}`,
      type: 'CHOICE',
      title: `Tình huống ${activeScenario.questions.length + 1}: Tình huống mới`,
      storyline: 'Mô tả bối cảnh tình huống khẩn cấp đời thực xảy ra bất ngờ...',
      mediaUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      actionPrompt: 'HÀNH ĐỘNG AN TOÀN ĐẦU TIÊN CẦN THỰC HIỆN LÀ GÌ?',
      countdown: 15,
      xpReward: 15,
      choices: [
        {
          id: `c_${Date.now()}_1`,
          text: 'Phương án đúng chuẩn y khoa / cứu nạn',
          isCorrect: true,
          feedback: 'Giải thích cơ chế khoa học giúp bảo toàn tính mạng...',
        },
        {
          id: `c_${Date.now()}_2`,
          text: 'Sai lầm dân gian phổ biến nguy hiểm',
          isCorrect: false,
          feedback: 'Cảnh báo hậu quả nghiêm trọng khi làm sai...',
        },
      ],
    };

    setActiveScenario({
      ...activeScenario,
      questions: [...activeScenario.questions, newQ],
    });
    setCurrentQIndex(activeScenario.questions.length);
  };

  // Nạp kịch bản mẫu PCCC
  const loadFireTemplate = () => {
    updateCurrentQuestion('storyline', 'Bạn đang chiên cá trong bếp thì chảo dầu bất ngờ bốc cháy dữ dội, ngọn lửa bén cao gần chạm vào máy hút mùi!');
    updateCurrentQuestion('mediaUrl', 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800&auto=format&fit=crop&q=80');
    updateCurrentQuestion('actionPrompt', 'HÀNH ĐỘNG ĐẦU TIÊN BẠN NÊN LÀM LÀ GÌ?');
    const newChoices = [
      {
        id: 'tpl_1',
        text: 'Tạt ngay một xô nước lạnh vào chảo để dập tắt lửa',
        isCorrect: false,
        feedback: 'Nước nặng hơn dầu sẽ chìm xuống đáy bốc hơi tức thì, tạo vụ nổ cầu lửa (boilover) thiêu rụi toàn bộ gian bếp trong 2 giây!',
      },
      {
        id: 'tpl_2',
        text: 'Dùng nắp vung kim loại đậy kín miệng chảo và tắt bếp ngay lập tức',
        isCorrect: true,
        feedback: 'Đậy nắp vung giúp cách ly hoàn toàn nguồn oxy khiến lửa tự tắt ngay mà không gây bắn dầu nguy hiểm.',
      },
      {
        id: 'tpl_3',
        text: 'Bê chảo dầu đang cháy chạy nhanh ra ban công hoặc cửa sổ',
        isCorrect: false,
        feedback: 'Di chuyển chảo dầu đang sôi dễ làm sóng dầu trào vào tay gây bỏng độ 3 và cháy lan sang rèm cửa, đồ đạc xung quanh!',
      },
    ];
    const updated = [...activeScenario.questions];
    updated[currentQIndex].choices = newChoices;
    setActiveScenario({ ...activeScenario, questions: updated });
    triggerToast('Đã nạp mẫu: Tình huống Cháy chảo dầu trên bếp');
  };

  // Nạp kịch bản mẫu Sơ cứu Bỏng nước sôi
  const loadBurnTemplate = () => {
    updateCurrentQuestion('storyline', 'Em bé 4 tuổi vô tình làm đổ bát canh nóng vào cẳng tay. Da ửng đỏ, bé khóc thét vì rát bỏng!');
    updateCurrentQuestion('mediaUrl', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80');
    updateCurrentQuestion('actionPrompt', 'HÀNH ĐỘNG CẤP THIẾT ĐẦU TIÊN CẦN THỰC HIỆN TRONG 10 GIÂY ĐẦU?');
    const newChoices = [
      {
        id: 'tpl_b1',
        text: 'Xả cánh tay dưới vòi nước máy mát chảy nhẹ liên tục từ 15 - 20 phút',
        isCorrect: true,
        feedback: 'Nước mát (15-20°C) giúp hạ nhiệt tức thì các lớp biểu bì sâu, chặn đứng sự lan rộng của vết bỏng và giảm đau tự nhiên hiệu quả nhất.',
      },
      {
        id: 'tpl_b2',
        text: 'Lấy đá lạnh trong tủ đông chườm trực tiếp lên vết bỏng để cắt cơn rát',
        isCorrect: false,
        feedback: 'Đá lạnh gây co mạch đột ngột và tổn thương mô kép (bỏng lạnh kèm bỏng nhiệt), khiến da bị hoại tử nhanh hơn!',
      },
      {
        id: 'tpl_b3',
        text: 'Bôi ngay kem đánh răng hoặc mỡ trăn để làm dịu da',
        isCorrect: false,
        feedback: 'Kem đánh răng chứa kiềm gây rát thêm, mỡ trăn giữ nhiệt khiến vết thương âm ỉ cháy sâu và nhiễm trùng nghiêm trọng!',
      },
    ];
    const updated = [...activeScenario.questions];
    updated[currentQIndex].choices = newChoices;
    setActiveScenario({ ...activeScenario, questions: updated });
    triggerToast('Đã nạp mẫu: Sơ cứu Bỏng nước sôi trẻ nhỏ');
  };

  const handleSaveDraft = () => {
    curatorService.saveScenario(activeScenario);
    triggerToast('Đã lưu bản nháp thành công vào Hệ thống!');
  };

  const handleSubmitReview = () => {
    curatorService.submitForReview(activeScenario.id);
    triggerToast('Đã gửi kịch bản lên Hội đồng Thẩm định Y khoa & Super Admin!');
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  // Xử lý kiểm tra trên Mobile Simulator
  const handleSimSubmit = () => {
    if (!selectedChoiceId) return;
    setSimSubmitted(true);
  };

  const handleSimReset = () => {
    setSelectedChoiceId(null);
    setSimSubmitted(false);
  };

  const currentSelectedChoice = currentQ.choices.find((c) => c.id === selectedChoiceId);

  return (
    <div className="curator-builder-page">
      <style>{`
        .curator-builder-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ─── TOAST THÔNG BÁO ─── */
        .builder-toast {
          position: fixed;
          bottom: 24px;
          right: 32px;
          background: #22c55e;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13.5px;
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideUpToast 0.3s ease;
        }

        @keyframes slideUpToast {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* ─── HEADER SOẠN THẢO ─── */
        .builder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #150e29;
          border: 1px solid #2e1852;
          padding: 16px 24px;
          border-radius: 16px;
        }

        .builder-title-block h2 {
          font-size: 19px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 4px 0;
        }

        .builder-title-block p {
          font-size: 12.5px;
          color: #c084fc;
          margin: 0;
        }

        .builder-actions-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .btn-builder-secondary {
          background: #1f143a;
          border: 1px solid #4a277c;
          color: #cbd5e1;
          padding: 9px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-builder-secondary:hover {
          background: #2d1b54;
          color: #ffffff;
          border-color: #7c3aed;
        }

        .btn-builder-primary {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          color: #ffffff;
          padding: 9px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
          transition: all 0.2s;
        }

        .btn-builder-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(34, 197, 94, 0.5);
        }

        /* ─── THANH CHỌN TÌNH HUỐNG TRONG BÀI ─── */
        .questions-nav-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #110922;
          padding: 10px 16px;
          border-radius: 14px;
          border: 1px solid #23113d;
          overflow-x: auto;
        }

        .q-tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #1a0f33;
          border: 1px solid #361f5c;
          color: #94a3b8;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .q-tab-btn.active {
          background: #7c3aed;
          border-color: #9333ea;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.4);
        }

        .btn-add-q {
          background: rgba(147, 51, 234, 0.15);
          border: 1px dashed #7c3aed;
          color: #c084fc;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .btn-add-q:hover {
          background: rgba(147, 51, 234, 0.25);
          color: #ffffff;
        }

        /* ─── SPLIT VIEW WORKSPACE ─── */
        .builder-split-workspace {
          display: grid;
          grid-template-columns: 1fr 430px;
          gap: 24px;
          align-items: start;
        }

        /* ─── CỘT TRÁI: FORM SOẠN THẢO ─── */
        .editor-form-card {
          background: #140d28;
          border: 1px solid #2b184f;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .form-section-title {
          font-size: 13px;
          font-weight: 800;
          color: #a78bfa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 700;
          color: #cbd5e1;
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          background: #1b1136;
          border: 1px solid #382060;
          border-radius: 10px;
          padding: 10px 14px;
          color: #f8fafc;
          font-size: 13.5px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #9333ea;
          box-shadow: 0 0 10px rgba(147, 51, 234, 0.3);
        }

        .form-textarea {
          resize: vertical;
          min-height: 75px;
          line-height: 1.5;
        }

        /* Dạng tương tác (Exercise Type Pills) */
        .exercise-type-pills {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .type-pill {
          background: #1b1136;
          border: 1px solid #382060;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-pill:hover {
          border-color: #7c3aed;
        }

        .type-pill.active {
          background: rgba(147, 51, 234, 0.2);
          border-color: #9333ea;
          color: #ffffff;
        }

        .type-pill-radio {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .type-pill.active .type-pill-radio::after {
          content: '';
          width: 8px;
          height: 8px;
          background: #c084fc;
          border-radius: 50%;
        }

        .type-pill-text {
          font-size: 12.5px;
          font-weight: 700;
        }

        /* Media Upload & Preview Row */
        .media-config-row {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .media-preview-thumb {
          width: 90px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid #4a287c;
        }

        .media-input-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Danh sách các phương án A/B/C */
        .choices-builder-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .choice-card-item {
          background: #1b1036;
          border: 1px solid #361f5c;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s;
        }

        .choice-card-item.is-correct-card {
          border-color: #22c55e;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), #1b1036);
        }

        .choice-card-item.is-wrong-card {
          border-color: #ef4444;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), #1b1036);
        }

        .choice-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .choice-letter-badge {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #2a164d;
          color: #c084fc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
        }

        .choice-correct-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toggle-btn {
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .toggle-btn.btn-correct-active {
          background: #22c55e;
          color: #ffffff;
        }

        .toggle-btn.btn-wrong-active {
          background: #ef4444;
          color: #ffffff;
        }

        .toggle-btn.btn-inactive {
          background: #261745;
          color: #94a3b8;
          border-color: #3b2269;
        }

        .choice-remove-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 16px;
          padding: 2px 6px;
        }

        .choice-remove-btn:hover {
          color: #ef4444;
        }

        /* ─── CỘT PHẢI: LIVE MOBILE SIMULATOR ─── */
        .simulator-sticky-col {
          position: sticky;
          top: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .sim-header-note {
          font-size: 12px;
          color: #c084fc;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Khung điện thoại iPhone */
        .phone-frame {
          width: 360px;
          height: 720px;
          background: #0f172a;
          border: 10px solid #2d1852;
          border-radius: 46px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 25px rgba(147, 51, 234, 0.25);
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Dynamic Island / Notch */
        .phone-notch {
          width: 110px;
          height: 22px;
          background: #000000;
          border-radius: 20px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
        }

        /* Màn hình app học sinh bên trong */
        .phone-screen {
          flex: 1;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          padding-top: 36px;
          position: relative;
          overflow-y: auto;
          color: #0f172a;
        }

        .sim-topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px 12px;
        }

        .sim-close-btn {
          font-size: 16px;
          color: #94a3b8;
          font-weight: 800;
        }

        .sim-progress-bar {
          flex: 1;
          height: 12px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .sim-progress-fill {
          width: 60%;
          height: 100%;
          background: #22c55e;
          border-radius: 10px;
        }

        .sim-hearts {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 800;
          color: #ef4444;
          font-size: 13px;
        }

        .sim-timer-pill {
          background: #fef3c7;
          border: 1px solid #fde047;
          color: #b45309;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 20px;
        }

        .sim-content-body {
          padding: 0 16px 100px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sim-mascot-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #eff6ff;
          border: 1.5px solid #bfdbfe;
          border-radius: 14px;
          padding: 8px 12px;
        }

        .sim-mascot-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
        }

        .sim-mascot-bubble {
          font-size: 11.5px;
          color: #1e40af;
          font-weight: 600;
          line-height: 1.3;
        }

        .sim-storyline {
          font-size: 12.5px;
          color: #475569;
          line-height: 1.45;
          font-style: italic;
          background: #f1f5f9;
          padding: 8px 12px;
          border-radius: 10px;
        }

        .sim-media-box {
          width: 100%;
          height: 130px;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .sim-media-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sim-action-prompt {
          font-size: 14px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.35;
          margin-top: 4px;
        }

        /* Nút lựa chọn 3D trên Simulator */
        .sim-choice-btn {
          width: 100%;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-bottom: 5px solid #cbd5e1;
          border-radius: 14px;
          padding: 10px 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sim-choice-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .sim-choice-btn.selected {
          border-color: #3b82f6;
          border-bottom: 5px solid #1d4ed8;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .sim-choice-btn:active {
          transform: translateY(3px);
          border-bottom-width: 2px;
        }

        .sim-choice-key {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #e2e8f0;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .sim-choice-btn.selected .sim-choice-key {
          background: #3b82f6;
          color: #ffffff;
        }

        /* Nút Kiểm tra dưới đáy Simulator */
        .sim-bottom-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 12px 16px;
          z-index: 10;
        }

        .sim-btn-check {
          width: 100%;
          background: #22c55e;
          border: 2px solid #22c55e;
          border-bottom: 5px solid #15803d;
          border-radius: 14px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          padding: 10px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .sim-btn-check:disabled {
          background: #e2e8f0;
          border-color: #e2e8f0;
          border-bottom: 5px solid #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .sim-btn-check:not(:disabled):active {
          transform: translateY(3px);
          border-bottom-width: 2px;
        }

        /* ─── BOTTOM SHEET PHẢN HỒI Y KHOA ĐÚNG/SAI ─── */
        .sim-feedback-sheet {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          border-radius: 20px 20px 0 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 40;
          animation: slideUpSheet 0.25s ease;
        }

        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .sheet-correct {
          background: #dcfce7;
          border-top: 3px solid #22c55e;
          color: #14532d;
        }

        .sheet-wrong {
          background: #fee2e2;
          border-top: 3px solid #ef4444;
          color: #7f1d1d;
        }

        .sheet-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 900;
        }

        .sheet-text {
          font-size: 11.5px;
          line-height: 1.45;
          font-weight: 500;
        }

        .sheet-btn-next {
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 13px;
          border: none;
          cursor: pointer;
        }

        .sheet-correct .sheet-btn-next {
          background: #22c55e;
          color: #ffffff;
          border-bottom: 4px solid #15803d;
        }

        .sheet-wrong .sheet-btn-next {
          background: #ef4444;
          color: #ffffff;
          border-bottom: 4px solid #991b1b;
        }
      `}</style>

      {/* Toast */}
      {showToast && (
        <div className="builder-toast">
          <span>✨</span>
          <span>{showToast}</span>
        </div>
      )}

      {/* ─── HEADER TOOLBAR ─── */}
      <div className="builder-header">
        <div className="builder-title-block">
          <h2>✍️ Bộ Soạn Thảo Kịch Bản Trực Quan & Mobile Simulator</h2>
          <p>
            Đang biên soạn: <strong>{activeScenario.title}</strong> ({activeScenario.lessonCode})
          </p>
        </div>

        <div className="builder-actions-row">
          <button className="btn-builder-secondary" onClick={loadFireTemplate}>
            🔥 Nạp mẫu Cháy Dầu Bếp
          </button>
          <button className="btn-builder-secondary" onClick={loadBurnTemplate}>
            🚑 Nạp mẫu Bỏng Nước Sôi
          </button>
          <button className="btn-builder-secondary" onClick={handleSaveDraft}>
            💾 Lưu Nháp
          </button>
          <button className="btn-builder-primary" onClick={handleSubmitReview}>
            🚀 Gửi Thẩm Định & Xuất Bản
          </button>
        </div>
      </div>

      {/* ─── DANH SÁCH CÁC TÌNH HUỐNG TRONG BÀI ─── */}
      <div className="questions-nav-strip">
        {activeScenario.questions.map((q, idx) => (
          <button
            key={q.id}
            className={`q-tab-btn ${currentQIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentQIndex(idx)}
          >
            <span>{idx === 0 ? '🩹' : idx === 1 ? '🔥' : '⚠️'}</span>
            <span>Tình huống {idx + 1}</span>
          </button>
        ))}

        <button className="btn-add-q" onClick={addNewQuestion}>
          + Thêm Tình Huống Mới
        </button>
      </div>

      {/* ─── VÙNG LÀM VIỆC 2 CỘT: FORM SOẠN THẢO & MOBILE SIMULATOR ─── */}
      <div className="builder-split-workspace">
        {/* CỘT TRÁI: FORM CẤU HÌNH */}
        <div className="editor-form-card">
          {/* 1. Chọn dạng tương tác */}
          <div>
            <div className="form-section-title">
              <span>🎯 1. CHỌN DẠNG TƯƠNG TÁC (EXERCISE TYPE)</span>
            </div>
            <div className="exercise-type-pills">
              {[
                { id: 'CHOICE', label: 'Quyết định tình huống (Scenario Choice A/B/C)' },
                { id: 'SEQUENCE', label: 'Sắp xếp quy trình cứu nạn (Sequencing Steps)' },
                { id: 'RED_FLAG', label: 'Vạch lá tìm sâu (Spot the Red Flag)' },
                { id: 'TRUE_FALSE', label: 'Đúng / Sai phản xạ nhanh (Rapid True/False)' },
              ].map((t) => (
                <div
                  key={t.id}
                  className={`type-pill ${currentQ.type === t.id ? 'active' : ''}`}
                  onClick={() => updateCurrentQuestion('type', t.id)}
                >
                  <div className="type-pill-radio" />
                  <span className="type-pill-text">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Ngữ cảnh dẫn dắt */}
          <div className="form-group">
            <div className="form-section-title">
              <span>📖 2. NGỮ CẢNH DẪN DẮT TÌNH HUỐNG (STORYLINE)</span>
            </div>
            <textarea
              className="form-textarea"
              value={currentQ.storyline}
              onChange={(e) => updateCurrentQuestion('storyline', e.target.value)}
              placeholder="Mô tả bối cảnh khẩn cấp ngắn gọn từ 2 - 3 câu để tạo áp lực thực tế..."
            />
          </div>

          {/* 3. Media minh họa */}
          <div>
            <div className="form-section-title">
              <span>🖼️ 3. MEDIA MINH HỌA (HÌNH ẢNH / GIF KHẨN CẤP)</span>
            </div>
            <div className="media-config-row">
              <img
                src={currentQ.mediaUrl}
                alt="Minh họa tình huống"
                className="media-preview-thumb"
              />
              <div className="media-input-wrap">
                <input
                  type="text"
                  className="form-input"
                  value={currentQ.mediaUrl}
                  onChange={(e) => updateCurrentQuestion('mediaUrl', e.target.value)}
                  placeholder="Nhập đường dẫn URL ảnh hoặc chọn từ Thư viện Media..."
                />
                <div style={{ fontSize: '11px', color: '#a78bfa' }}>
                  💡 Khuyến nghị: Ảnh WebP dung lượng &lt;150KB, minh họa 3D hoặc bán thực tế an toàn.
                </div>
              </div>
            </div>
          </div>

          {/* 4. Câu hỏi hành động */}
          <div className="form-group">
            <div className="form-section-title">
              <span>⚡ 4. CÂU HỎI HÀNH ĐỘNG (ACTION PROMPT)</span>
            </div>
            <input
              type="text"
              className="form-input"
              style={{ fontWeight: '800', color: '#facc15' }}
              value={currentQ.actionPrompt}
              onChange={(e) => updateCurrentQuestion('actionPrompt', e.target.value)}
              placeholder="VD: HÀNH ĐỘNG ĐẦU TIÊN BẠN NÊN LÀM LÀ GÌ?"
            />
          </div>

          {/* 5. Thiết lập các lựa chọn & Phản hồi chuyên môn */}
          <div>
            <div className="form-section-title" style={{ justifyContent: 'space-between' }}>
              <span>📝 5. THIẾT LẬP CÁC LỰA CHỌN & PHẢN HỒI CHUYÊN MÔN</span>
              <button
                type="button"
                onClick={addChoice}
                style={{
                  background: 'rgba(147, 51, 234, 0.2)',
                  border: '1px solid #7c3aed',
                  color: '#e9d5ff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                + Thêm Lựa Chọn
              </button>
            </div>

            <div className="choices-builder-list">
              {currentQ.choices.map((choice, cIdx) => (
                <div
                  key={choice.id}
                  className={`choice-card-item ${choice.isCorrect ? 'is-correct-card' : 'is-wrong-card'}`}
                >
                  <div className="choice-item-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="choice-letter-badge">
                        {String.fromCharCode(65 + cIdx)}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9' }}>
                        Lựa chọn {String.fromCharCode(65 + cIdx)}
                      </span>
                    </div>

                    <div className="choice-correct-toggle">
                      <button
                        type="button"
                        className={`toggle-btn ${choice.isCorrect ? 'btn-correct-active' : 'btn-inactive'}`}
                        onClick={() => toggleChoiceCorrect(cIdx)}
                      >
                        ✅ ĐÁP ÁN ĐÚNG
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn ${!choice.isCorrect ? 'btn-wrong-active' : 'btn-inactive'}`}
                        onClick={() => {
                          if (choice.isCorrect) {
                            alert('Vui lòng chọn 1 phương án khác làm đáp án đúng!');
                          }
                        }}
                      >
                        ❌ ĐÁP ÁN SAI
                      </button>
                      <button
                        type="button"
                        className="choice-remove-btn"
                        onClick={() => removeChoice(cIdx)}
                        title="Xóa lựa chọn này"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    className="form-input"
                    value={choice.text}
                    onChange={(e) => updateChoice(cIdx, 'text', e.target.value)}
                    placeholder="Nội dung phương án hiển thị cho người học..."
                  />

                  <div className="form-group">
                    <label className="form-label" style={{ color: choice.isCorrect ? '#4ade80' : '#f87171' }}>
                      {choice.isCorrect
                        ? '🧪 Giải thích khoa học & Phác đồ y tế chuẩn (Hiện khi trả lời đúng):'
                        : '⚠️ Cảnh báo hậu quả chết người / Tai nạn nguy hiểm (Hiện khi chọn sai):'}
                    </label>
                    <textarea
                      className="form-textarea"
                      style={{
                        borderColor: choice.isCorrect ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                      }}
                      value={choice.feedback}
                      onChange={(e) => updateChoice(cIdx, 'feedback', e.target.value)}
                      placeholder="Ghi rõ cơ sở khoa học hoặc nguy cơ giải phẫu/cháy nổ thực tế..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Cấu hình thời gian & Điểm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">⏱️ Đếm ngược khẩn cấp (Giây):</label>
              <select
                className="form-select"
                value={currentQ.countdown}
                onChange={(e) => updateCurrentQuestion('countdown', Number(e.target.value))}
              >
                <option value={10}>10 Giây (Áp lực cao độ)</option>
                <option value={15}>15 Giây (Chuẩn phản xạ)</option>
                <option value={20}>20 Giây (Vừa phải)</option>
                <option value={30}>30 Giây (Dễ)</option>
                <option value={0}>Không giới hạn thời gian</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">⭐ Điểm kinh nghiệm thưởng (XP):</label>
              <select
                className="form-select"
                value={currentQ.xpReward}
                onChange={(e) => updateCurrentQuestion('xpReward', Number(e.target.value))}
              >
                <option value={10}>10 XP (Cơ bản)</option>
                <option value={15}>15 XP (Tiêu chuẩn)</option>
                <option value={25}>25 XP (Boss Chặng)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TRÌNH GIẢ LẬP MOBILE SIMULATOR */}
        <div className="simulator-sticky-col">
          <div className="sim-header-note">
            <span>📱</span>
            <span>TRÌNH GIẢ LẬP MOBILE TƯƠNG TÁC THỜI GIAN THỰC</span>
          </div>

          {/* iPhone Frame */}
          <div className="phone-frame">
            <div className="phone-notch" />

            <div className="phone-screen">
              {/* Header Simulator */}
              <div className="sim-topbar">
                <span className="sim-close-btn" onClick={handleSimReset} title="Khởi động lại">✕</span>
                <div className="sim-progress-bar">
                  <div
                    className="sim-progress-fill"
                    style={{ width: `${((currentQIndex + 1) / activeScenario.questions.length) * 100}%` }}
                  />
                </div>
                <div className="sim-timer-pill">⏱️ {currentQ.countdown}s</div>
                <div className="sim-hearts">❤️ 5</div>
              </div>

              {/* Thân câu hỏi */}
              <div className="sim-content-body">
                {/* Mascot Mimo */}
                <div className="sim-mascot-row">
                  <img src="/images/mimo_first_aid.png" alt="Mimo Cứu Thương" className="sim-mascot-img" />
                  <div className="sim-mascot-bubble">
                    Bình tĩnh nào! Hãy quan sát kỹ hiện trường và đưa ra quyết định đúng!
                  </div>
                </div>

                {/* Ngữ cảnh */}
                <div className="sim-storyline">
                  "{currentQ.storyline}"
                </div>

                {/* Ảnh minh họa */}
                <div className="sim-media-box">
                  <img src={currentQ.mediaUrl} alt="Minh họa tình huống" />
                </div>

                {/* Câu hỏi hành động */}
                <div className="sim-action-prompt">
                  {currentQ.actionPrompt}
                </div>

                {/* Danh sách lựa chọn 3D bấm được */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {currentQ.choices.map((choice, idx) => (
                    <button
                      key={choice.id}
                      className={`sim-choice-btn ${selectedChoiceId === choice.id ? 'selected' : ''}`}
                      onClick={() => {
                        if (!simSubmitted) setSelectedChoiceId(choice.id);
                      }}
                    >
                      <span className="sim-choice-key">{String.fromCharCode(65 + idx)}</span>
                      <span>{choice.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút Kiểm tra Bottom Bar */}
              {!simSubmitted && (
                <div className="sim-bottom-bar">
                  <button
                    className="sim-btn-check"
                    disabled={!selectedChoiceId}
                    onClick={handleSimSubmit}
                  >
                    KIỂM TRA
                  </button>
                </div>
              )}

              {/* Bottom Sheet phản hồi trượt lên khi nộp */}
              {simSubmitted && currentSelectedChoice && (
                <div className={`sim-feedback-sheet ${currentSelectedChoice.isCorrect ? 'sheet-correct' : 'sheet-wrong'}`}>
                  <div className="sheet-header">
                    <span>{currentSelectedChoice.isCorrect ? '🎉' : '⚠️'}</span>
                    <span>
                      {currentSelectedChoice.isCorrect
                        ? 'CHÍNH XÁC! PHẢN XẠ TUYỆT VỜI (+15 XP)'
                        : 'NGUY HIỂM CHẾT NGƯỜI! (-1 ❤️)'}
                    </span>
                  </div>

                  <div className="sheet-text">
                    {currentSelectedChoice.feedback}
                  </div>

                  <button className="sheet-btn-next" onClick={handleSimReset}>
                    {currentSelectedChoice.isCorrect ? 'TIẾP TỤC HỌC →' : 'THỬ LẠI LẦN NỮA'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
