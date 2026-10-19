import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { sound } from '../../utils/audioEffects';

export default function LearnerMapPage() {
  const { data, activeDomain } = useOutletContext();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showTheoryModal, setShowTheoryModal] = useState(false);

  // Lấy các chặng học tương ứng với Chủ đề đang được chọn
  const units = (data?.unitsByDomain && data.unitsByDomain[activeDomain]) || data?.units || [];

  // Vị trí uốn lượn (Snake Path offsets) cho các nút: giữa, trái, giữa, phải...
  const getOffset = (index) => {
    const cycle = index % 4;
    switch (cycle) {
      case 0: return '0px';       // Giữa
      case 1: return '-50px';     // Lệch trái
      case 2: return '0px';       // Giữa
      case 3: return '50px';      // Lệch phải
      default: return '0px';
    }
  };

  const handleNodeClick = (lesson) => {
    sound.playClick();
    if (lesson.status === 'locked') {
      sound.playWrong();
      alert('🔒 Bài học này đang bị khóa! Vui lòng hoàn thành các bài học trước để mở khóa.');
      return;
    }
    setSelectedLesson(lesson);
  };

  const handleStartLesson = (lessonId) => {
    sound.playClick();
    navigate(`/learn/lesson/${lessonId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', position: 'relative' }}>
      {units.map((unit) => (
        <section key={unit.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* 1. KHỐI TIÊU ĐỀ CHẶNG (UNIT BANNER HEADER) */}
          <div
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${unit.themeColor || '#22C55E'} 0%, #15803D 100%)`,
              borderRadius: '24px',
              padding: '24px 28px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.25)',
              marginBottom: '36px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  CHẶNG {unit.unitNumber}
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>
                  {unit.title}
                </h2>
                <p style={{ fontSize: '13px', margin: 0, opacity: 0.95, lineHeight: 1.5, maxWidth: '440px' }}>
                  {unit.description}
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowTheoryModal(true);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.45)',
                  borderRadius: '999px',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.15s ease',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '15px' }}>📖</span>
                <span>Tóm tắt</span>
              </button>
            </div>
          </div>

          {/* 2. CON ĐƯỜNG UỐN LƯỢN (SNAKE PATH NODES) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              width: '100%',
              position: 'relative',
            }}
          >
            {unit.lessons.map((les, index) => {
              const offset = getOffset(index);
              const isActive = les.status === 'active';
              const isCompleted = les.status === 'completed';
              const isLocked = les.status === 'locked';
              const isChest = les.type === 'chest';
              const isBoss = les.type === 'boss';

              return (
                <div
                  key={les.id}
                  style={{
                    position: 'relative',
                    transform: `translateX(${offset})`,
                    transition: 'transform 0.2s ease',
                  }}
                >
                  {/* LINH VẬT THỰC TẾ MIMO ĐỨNG CẠNH BÀI ĐANG HỌC */}
                  {isActive && (
                    <div
                      className="anim-float"
                      style={{
                        position: 'absolute',
                        left: '-105px',
                        top: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          background: '#FFFFFF',
                          border: '2px solid #E2E8F0',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          borderRadius: '12px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#15803D',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Làm bài này nhé! 👋
                      </div>
                      <img
                        src="/images/mascot.png"
                        alt="Mimo Mascot"
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
                        }}
                      />
                    </div>
                  )}

                  {/* NÚT BÀI HỌC 3D VÒNG TRÒN */}
                  <div
                    onClick={() => handleNodeClick(les)}
                    className={`stepping-stone-node ${
                      isChest ? 'chest' : isBoss ? 'boss' : isCompleted ? 'completed' : isActive ? 'active anim-pulse' : 'locked'
                    }`}
                  >
                    {/* Icon hoặc Số */}
                    <span style={{ fontSize: isBoss ? '34px' : '28px', lineHeight: 1 }}>
                      {les.icon || (isCompleted ? '✓' : index + 1)}
                    </span>

                    {/* 3 Ngôi sao trên đầu nếu đã hoàn thành */}
                    {isCompleted && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          display: 'flex',
                          gap: '2px',
                          fontSize: '12px',
                        }}
                      >
                        <span>⭐</span>
                        <span style={{ transform: 'translateY(-3px)' }}>⭐</span>
                        <span>⭐</span>
                      </div>
                    )}

                    {/* Biểu tượng ổ khóa nếu bị khóa */}
                    {isLocked && !isChest && !isBoss && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          background: '#64748B',
                          color: '#FFFFFF',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                        }}
                      >
                        🔒
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* 3. TOOLTIP / MODAL TÓM TẮT BÀI HỌC (LESSON PREVIEW MODAL) */}
      {selectedLesson && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setSelectedLesson(null)}
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
              position: 'relative',
            }}
          >
            {/* Nút đóng */}
            <button
              onClick={() => setSelectedLesson(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: '48px', marginBottom: '8px' }}>
              {selectedLesson.icon || '🩹'}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
              {selectedLesson.title}
            </h3>
            <p style={{ color: '#64748B', fontSize: '13.5px', margin: '0 0 20px 0' }}>
              {selectedLesson.subtitle}
            </p>

            {/* Thông số bài học */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: '24px',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0EA5E9' }}>
                  {selectedLesson.duration || '~2 phút'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Thời lượng</div>
              </div>
              <div style={{ width: '1px', background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#8B5CF6' }}>
                  {selectedLesson.questionsCount || 4} câu
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Tình huống</div>
              </div>
              <div style={{ width: '1px', background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#F59E0B' }}>
                  +{selectedLesson.rewardXp || 15} XP
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Phần thưởng</div>
              </div>
            </div>

            {/* Nút hành động BẮT ĐẦU */}
            <button
              onClick={() => handleStartLesson(selectedLesson.id)}
              className="btn-3d btn-3d-green btn-3d-lg"
              style={{ width: '100%' }}
            >
              BẮT ĐẦU HỌC ➔
            </button>
          </div>
        </div>
      )}

      {/* 4. MODAL ĐỌC TÓM TẮT LÝ THUYẾT CHẶNG */}
      {showTheoryModal && (
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
          onClick={() => setShowTheoryModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '540px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#15803D', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📖</span>
                <span>Tóm tắt Lý thuyết Chặng 1</span>
              </h3>
              <button
                onClick={() => setShowTheoryModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>
              <h4 style={{ color: '#0F172A', marginBottom: '6px' }}>1. Nguyên tắc 3 Không khi xử lý bỏng nhiệt:</h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li><strong>KHÔNG</strong> bôi kem đánh răng, mỡ trăn, nước mắm hoặc cồn lên vết bỏng.</li>
                <li><strong>KHÔNG</strong> chọc vỡ các bọng nước phồng rộp (tránh vi khuẩn xâm nhập).</li>
                <li><strong>KHÔNG</strong> dùng đá lạnh buốt chườm trực tiếp (gây bỏng lạnh hoại tử mô).</li>
              </ul>

              <h4 style={{ color: '#0F172A', marginBottom: '6px' }}>2. Kỹ thuật cầm máu khẩn cấp:</h4>
              <p style={{ margin: '0 0 16px 0' }}>
                Dùng gạc sạch ép trực tiếp lên vết thương với lực ấn liên tục. Nâng cao chi bị thương cao hơn tim để giảm áp lực tưới máu từ tim dồn về miệng vết thương.
              </p>
            </div>

            <button
              className="btn-3d btn-3d-green"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => setShowTheoryModal(false)}
            >
              TÔI ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
