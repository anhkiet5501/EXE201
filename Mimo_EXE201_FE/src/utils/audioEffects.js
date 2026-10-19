/**
 * Tiện ích âm thanh phản hồi (Web Audio API) & Hiệu ứng Pháo hoa Confetti
 * Hoạt động 100% offline, không phụ thuộc file MP3 bên ngoài và không lo lỗi mạng!
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Âm thanh khi click nút (nhẹ nhàng, vui tai)
  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Bỏ qua nếu trình duyệt chặn tự phát âm thanh
    }
  }

  // Âm thanh Trả lời Đúng (Hợp âm Trưởng Duolingo Chime: Do-Mi-Sol-Do)
  playCorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const startTime = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.08);

        gain.gain.setValueAtTime(0, startTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, startTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime + idx * 0.08);
        osc.stop(startTime + idx * 0.08 + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  // Âm thanh Trả lời Sai (Thud trầm cảnh báo nguy hiểm)
  playWrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);

      // Hiệu ứng rung điện thoại (Haptic) nếu hỗ trợ
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {
      // Ignore
    }
  }

  // Âm thanh Chiến thắng Bài học (Fanfare kèn mừng)
  playVictory() {
    try {
      this.init();
      if (!this.ctx) return;
      const melody = [
        { f: 523.25, d: 0.12 }, // C
        { f: 659.25, d: 0.12 }, // E
        { f: 783.99, d: 0.12 }, // G
        { f: 1046.50, d: 0.35 } // C cao ngân dài
      ];

      let t = this.ctx.currentTime;
      melody.forEach((note) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + note.d);
        t += note.d * 0.9;
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEffects();

/**
 * Hiệu ứng Canvas Confetti bắn pháo hoa giấy chúc mừng
 */
export function fireConfetti() {
  if (typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#22C55E', '#F59E0B', '#EF4444', '#0EA5E9', '#8B5CF6', '#EC4899'];
  const particles = Array.from({ length: 90 }).map(() => ({
    x: canvas.width / 2,
    y: canvas.height * 0.6,
    vx: (Math.random() - 0.5) * 18,
    vy: -Math.random() * 16 - 6,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    vrot: (Math.random() - 0.5) * 15,
    alpha: 1,
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // Trọng lực
      p.rot += p.vrot;
      p.alpha -= 0.008;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    frame++;
    if (frame < 120) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}
