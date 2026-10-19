import React, { useState } from 'react';

/**
 * Danh sách các biểu cảm & tư thế 3D của linh vật Mimo
 */
export const MIMO_POSES = [
  { id: 'default', src: '/images/mascot.png', title: 'Mimo vẫy chào' },
  { id: 'thumbs_up', src: '/images/mimo_thumbs_up.png', title: 'Mimo nháy mắt like' },
  { id: 'thinking', src: '/images/mimo_thinking.png', title: 'Mimo suy nghĩ ý tưởng' },
  { id: 'trophy', src: '/images/mimo_trophy.png', title: 'Mimo cúp vàng chiến thắng' },
  { id: 'first_aid', src: '/images/mimo_first_aid.png', title: 'Mimo sơ cứu cứu hộ' },
];

/**
 * Component Linh vật Mimo tương tác:
 * - Hiển thị ảnh 3D sắc nét
 * - Bấm vào sẽ đổi biểu cảm kế tiếp kèm hiệu ứng nảy (bounce) sinh động
 */
export default function MimoMascot({
  initialPose = 0,
  className = '',
  style = {},
  interactive = true,
  alt = 'Linh vật Mimo 3D',
}) {
  const [poseIndex, setPoseIndex] = useState(
    typeof initialPose === 'number' ? initialPose : 0
  );
  const [bouncing, setBouncing] = useState(false);

  const handleNextPose = () => {
    if (!interactive) return;
    setBouncing(true);
    setPoseIndex((prev) => (prev + 1) % MIMO_POSES.length);
    setTimeout(() => setBouncing(false), 250);
  };

  const currentPose = MIMO_POSES[poseIndex] || MIMO_POSES[0];

  return (
    <div
      onClick={handleNextPose}
      title={interactive ? '💡 Bấm vào Mimo để đổi biểu cảm mới!' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'pointer' : 'default',
        transform: bouncing ? 'scale(1.12) rotate(4deg)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
        ...style,
      }}
    >
      <img
        src={currentPose.src}
        alt={alt || currentPose.title}
        className={className}
        style={{
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
