import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/modules/authService';
import { GoogleIcon, FacebookIcon, AppleIcon } from '../../components/common/SocialIcons';
import './AuthPages.css';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState('LEARNER'); // LEARNER | BUSINESS
  const [orgName, setOrgName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      if (accountType === 'BUSINESS') {
        setSuccessMsg(`Khởi tạo Không gian Doanh nghiệp cho "${orgName || 'Trường học'}" thành công!`);
        setTimeout(() => {
          navigate('/business');
        }, 1200);
      } else {
        const res = await authService.register(formData);
        setSuccessMsg(res.data.message || 'Tạo tài khoản thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đăng ký không thành công');
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
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="auth-container">
        {/* Left Column */}
        <div className="auth-left">
          <span className="auth-tagline-badge">HỌC KỸ NĂNG SỐNG, SẴN SÀNG CHO THỰC TẾ</span>
          <h1 className="auth-main-title">
            Bắt đầu hành trình<br />
            trở thành phiên bản<br />
            <span className="highlight-blue">vững vàng hơn!</span>
          </h1>
          <p className="auth-main-desc">
            Tham gia Mimo ngay hôm nay để học kỹ năng sống qua các tình huống thực tế, với sự hỗ trợ thông minh từ AI.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon icon-blue-bg">🎮</div>
              <div className="auth-feature-text">
                <h4>Học qua tình huống thực tế</h4>
                <p>Trải nghiệm như trong đời thật</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon icon-green-bg">🧠</div>
              <div className="auth-feature-text">
                <h4>AI phân tích & hướng dẫn</h4>
                <p>Giải thích chi tiết, dễ hiểu</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon icon-amber-bg">⭐</div>
              <div className="auth-feature-text">
                <h4>Rèn luyện kỹ năng thiết yếu</h4>
                <p>An toàn hơn trong cuộc sống</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon icon-rose-bg">❤️</div>
              <div className="auth-feature-text">
                <h4>Vì một cộng đồng an toàn hơn</h4>
                <p>Bắt đầu từ chính bạn</p>
              </div>
            </div>
          </div>

          <div className="auth-mascot-showcase" style={{ minHeight: '220px' }}>
            <img
              src="/images/mascot.png"
              alt="Mimo Mascot"
              className="auth-mascot-img"
              style={{ width: '220px', height: '220px' }}
            />
            <div className="auth-speech-bubble">
              Cùng<br />Mimo nhé! ✨
            </div>
          </div>

          <div className="auth-quote-bottom">
            “Kỹ năng hôm nay, cuộc sống tốt đẹp hơn ngày mai!”
          </div>
        </div>

        {/* Right Column (Register Card) */}
        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-card-title">Tạo tài khoản Mimo</h2>
            <p className="auth-card-subtitle">Chỉ mất vài phút để bắt đầu hành trình học kỹ năng sống!</p>

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

            {/* CHỌN LOẠI TÀI KHOẢN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
              <button
                type="button"
                onClick={() => setAccountType('LEARNER')}
                style={{
                  padding: '9px',
                  borderRadius: '10px',
                  border: 'none',
                  background: accountType === 'LEARNER' ? '#FFFFFF' : 'transparent',
                  color: accountType === 'LEARNER' ? '#0F172A' : '#64748B',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  boxShadow: accountType === 'LEARNER' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                🧑‍🎓 Học Viên Cá Nhân
              </button>

              <button
                type="button"
                onClick={() => setAccountType('BUSINESS')}
                style={{
                  padding: '9px',
                  borderRadius: '10px',
                  border: 'none',
                  background: accountType === 'BUSINESS' ? '#0284C7' : 'transparent',
                  color: accountType === 'BUSINESS' ? '#FFFFFF' : '#64748B',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  boxShadow: accountType === 'BUSINESS' ? '0 2px 8px rgba(2,132,199,0.3)' : 'none',
                }}
              >
                🏢 Trường Học / Doanh Nghiệp
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {accountType === 'BUSINESS' && (
                <div className="auth-field-group">
                  <label>Tên Trường Học / Doanh Nghiệp</label>
                  <div className="auth-input-container">
                    <span className="auth-input-icon">🏫</span>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Ví dụ: THPT FPT Cần Thơ"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="auth-field-group">
                <label>{accountType === 'BUSINESS' ? 'Họ tên người đại diện (BGH / HR)' : 'Họ và tên'}</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">👤</span>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label>Email</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label>Mật khẩu</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="auth-field-group">
                <label>Xác nhận mật khẩu</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay →'}
              </button>
            </form>

            <div className="auth-divider">
              <span>Hoặc đăng ký bằng</span>
            </div>

            <div className="auth-social-row">
              <button type="button" className="auth-social-btn">
                <GoogleIcon /> Google
              </button>
              <button type="button" className="auth-social-btn">
                <FacebookIcon /> Facebook
              </button>
              <button type="button" className="auth-social-btn">
                <AppleIcon /> Apple
              </button>
            </div>

            <div className="auth-terms-note">
              Bằng việc đăng ký, bạn đồng ý với <a href="#terms">Điều khoản sử dụng</a> và <a href="#privacy">Chính sách bảo mật</a> của Mimo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
