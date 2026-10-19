import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/modules/authService';
import { getRedirectPathByRole } from '../../utils/roleRedirect';
import { GoogleIcon, FacebookIcon, AppleIcon } from '../../components/common/SocialIcons';
import MimoMascot from '../../components/common/MimoMascot';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      login(user, token);

      const fromPath = location.state?.from?.pathname;
      const targetPath = fromPath || getRedirectPathByRole(user.role);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đăng nhập không thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail, destinationPath) => {
    handleQuickLoginAndNavigate(roleEmail, destinationPath);
  };

  const handleQuickLoginAndNavigate = async (roleEmail, destinationPath) => {
    setError('');
    setLoading(true);
    setEmail(roleEmail);
    setPassword('123');

    try {
      const response = await authService.login(roleEmail, '123');
      const { user, token } = response.data;
      login(user, token);

      const targetPath = destinationPath || getRedirectPathByRole(user.role);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đăng nhập không thành công');
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
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="auth-container">
        {/* Left Column (Hero Content) */}
        <div className="auth-left">
          <span className="auth-tagline-badge">HỌC KỸ NĂNG SỐNG, SẴN SÀNG CHO THỰC TẾ</span>
          <h1 className="auth-main-title">
            Những kỹ năng nhỏ<br />
            có thể tạo nên<br />
            <span className="highlight-blue">sự khác biệt lớn!</span>
          </h1>
          <p className="auth-main-desc">
            Mimo giúp bạn học kỹ năng sống thông qua các tình huống mô phỏng thực tế, để luôn tự tin và an toàn trong cuộc sống.
          </p>

          {/* Mascot with Floating Badges */}
          <div className="auth-mascot-showcase">
            <div className="mascot-floating-card card-pos-tl">
              <span className="floating-card-icon">🚦</span>
              <span>An toàn<br />giao thông</span>
            </div>

            <div className="mascot-floating-card card-pos-tr">
              <span className="floating-card-icon">➕</span>
              <span>Sơ cứu<br />cấp cứu</span>
            </div>

            <MimoMascot className="auth-mascot-img" />

            <div className="mascot-floating-card card-pos-bl">
              <span className="floating-card-icon">🔥</span>
              <span>Phòng cháy<br />chữa cháy</span>
            </div>

            <div className="mascot-floating-card card-pos-br">
              <span className="floating-card-icon">👥</span>
              <span>Phòng chống<br />bạo lực</span>
            </div>
          </div>

          <div className="auth-quote-bottom">
            “Chuẩn bị hôm nay, an toàn hơn ngày mai.”
          </div>
        </div>

        {/* Right Column (Login Form Card) */}
        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-card-title">Đăng nhập vào Mimo</h2>
            <p className="auth-card-subtitle">Tiếp tục hành trình học kỹ năng sống của bạn!</p>

            {error && (
              <div style={{ padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field-group">
                <div className="auth-input-container">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Email hoặc tên đăng nhập"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <div className="auth-input-container">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="auth-forgot-link-wrapper">
                <Link to="/forgot-password" className="auth-forgot-link">Quên mật khẩu?</Link>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
              </button>
            </form>

            <div className="auth-divider">
              <span>Hoặc đăng nhập bằng</span>
            </div>

            <div className="auth-social-row">
              <button type="button" className="auth-social-btn" onClick={() => handleQuickLogin('learner@mimo.com')}>
                <GoogleIcon /> Google
              </button>
              <button type="button" className="auth-social-btn" onClick={() => handleQuickLogin('learner@mimo.com')}>
                <FacebookIcon /> Facebook
              </button>
              <button type="button" className="auth-social-btn" onClick={() => handleQuickLogin('learner@mimo.com')}>
                <AppleIcon /> Apple
              </button>
            </div>

            <div className="auth-card-tip">
              <img src="/images/mascot.png" alt="Mimo tip" className="auth-tip-mascot" />
              <p className="auth-tip-text">
                Cùng Mimo, bạn sẽ học được cách xử lý tình huống trong cuộc sống một cách an toàn và thông minh hơn!
              </p>
            </div>

            {/* Cổng vào nhanh các Role */}
            <div className="auth-quick-roles">
              <div className="auth-quick-roles-title">⚡ Cổng vào nhanh các Role:</div>
              <div className="auth-quick-roles-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  className="quick-role-badge"
                  style={{ background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8', fontWeight: 800 }}
                  onClick={() => handleQuickLogin('bgh.fpt@mimo.com', '/business')}
                >
                  🏢 Quản Trị Trường / B2B (/business)
                </button>
                <button
                  type="button"
                  className="quick-role-badge"
                  style={{ background: '#F0FDF4', borderColor: '#BBF7D0', color: '#15803D', fontWeight: 800 }}
                  onClick={() => handleQuickLogin('educator@mimo.com', '/learn/classroom')}
                >
                  👨‍🏫 Giáo Viên (Educator)
                </button>
                <button
                  type="button"
                  className="quick-role-badge"
                  onClick={() => handleQuickLogin('learner@mimo.com', '/learn')}
                >
                  🧑‍🎓 Học Viên (Learner)
                </button>
                <button
                  type="button"
                  className="quick-role-badge"
                  onClick={() => handleQuickLogin('curator@mimo.com', '/studio')}
                >
                  🎨 Sáng Tạo (Curator)
                </button>
                <button
                  type="button"
                  className="quick-role-badge"
                  onClick={() => handleQuickLogin('admin@mimo.com', '/admin')}
                >
                  ⚙️ Admin Hệ Thống
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
