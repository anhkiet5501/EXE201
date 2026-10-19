import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/modules/authService';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setSuccessMsg(res.data.message || 'Mã khôi phục đã được gửi về email của bạn!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-blob auth-bg-blob-1" />
      <div className="auth-bg-blob auth-bg-blob-2" />

      {/* Top Navbar */}
      <header className="auth-navbar">
        <Link to="/" className="auth-logo-link">
          <img src="/images/logo.png" alt="Mimo Logo" className="auth-logo-img" />
        </Link>
        <div className="auth-nav-switch">
          Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="auth-container">
        {/* Left Column */}
        <div className="auth-left">
          <span className="auth-tagline-badge">KHÔI PHỤC TÀI KHOẢN, TIẾP TỤC HÀNH TRÌNH</span>
          <h1 className="auth-main-title">
            Lấy lại mật khẩu để<br />
            <span className="highlight-blue">tiếp tục học cùng Mimo!</span>
          </h1>
          <p className="auth-main-desc">
            Chỉ cần nhập email đã đăng ký, Mimo sẽ gửi hướng dẫn đặt lại mật khẩu để bạn có thể nhanh chóng quay lại hành trình học kỹ năng sống an toàn và thú vị.
          </p>

          <div className="auth-mascot-showcase">
            <div className="mascot-floating-card card-pos-tl">
              <span className="floating-card-icon">✉️</span>
              <span>Nhận hướng dẫn<br />qua email</span>
            </div>

            <div className="mascot-floating-card card-pos-tr">
              <span className="floating-card-icon">❤️</span>
              <span>Luôn đồng hành<br />cùng bạn</span>
            </div>

            <img
              src="/images/mascot.png"
              alt="Mascot Mimo 3D"
              className="auth-mascot-img"
            />

            <div className="mascot-floating-card card-pos-bl">
              <span className="floating-card-icon">🛡️</span>
              <span>Bảo mật<br />thông tin</span>
            </div>

            <div className="mascot-floating-card card-pos-br">
              <span className="floating-card-icon">📖</span>
              <span>Tiếp tục học<br />và phát triển</span>
            </div>
          </div>

          <div className="auth-quote-bottom">
            “Bình tĩnh từng bước, Mimo luôn đồng hành cùng bạn.”
          </div>
        </div>

        {/* Right Column (Forgot Password Card) */}
        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-card-title">Quên mật khẩu?</h2>
            <p className="auth-card-subtitle">
              Nhập email đã đăng ký, Mimo sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
            </p>

            {error && (
              <div style={{ padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#15803d', fontSize: '13px', marginBottom: '16px' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field-group">
                <label>Email</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Đang gửi yêu cầu...' : 'Gửi liên kết đặt lại mật khẩu →'}
              </button>
            </form>

            <div className="auth-divider">
              <span>Hoặc</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: 'var(--mimo-blue)', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                Quay lại đăng nhập
              </Link>
            </div>

            {/* Steps Guide Box */}
            <div className="forgot-steps-box">
              <div className="forgot-steps-title">Các bước lấy lại mật khẩu thật đơn giản:</div>
              <div className="forgot-steps-row">
                <div className="forgot-step-item">
                  <div className="forgot-step-icon step-icon-blue">✉️</div>
                  <h5>1. Nhập email</h5>
                  <p>Nhập email đã đăng ký tài khoản</p>
                </div>
                <div className="forgot-step-arrow">›</div>
                <div className="forgot-step-item">
                  <div className="forgot-step-icon step-icon-blue">📩</div>
                  <h5>2. Kiểm tra hộp thư</h5>
                  <p>Mở email từ Mimo và làm theo hướng dẫn</p>
                </div>
                <div className="forgot-step-arrow">›</div>
                <div className="forgot-step-item">
                  <div className="forgot-step-icon step-icon-green">🔒</div>
                  <h5>3. Tạo mật khẩu mới</h5>
                  <p>Đặt mật khẩu mới và quay lại học ngay!</p>
                </div>
              </div>
            </div>

            <div className="auth-card-tip" style={{ marginTop: '16px' }}>
              <img src="/images/mascot.png" alt="Mimo tip" className="auth-tip-mascot" />
              <p className="auth-tip-text">
                Nếu bạn không thấy email, hãy kiểm tra mục <strong>Spam</strong> hoặc <strong>Thư rác</strong> nhé!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
