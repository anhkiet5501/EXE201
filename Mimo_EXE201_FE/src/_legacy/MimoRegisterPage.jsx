import React, { useState } from 'react';
import './MimoRegisterPage.css';

const MimoRegisterPage = ({ onRegisterSuccess, onLoginClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate registration
    onRegisterSuccess();
  };

  return (
    <div className="mimo-register-page">
      {/* Header */}
      <header className="register-header">
        <a href="#" className="register-logo" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>
          <div className="register-logo-icon">🤖</div>
          mimo
        </a>
        <div className="register-login-link">
          Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>Đăng nhập</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="register-main">
        
        {/* Left Column */}
        <div className="register-left">
          <div className="register-subtitle">HỌC KỸ NĂNG SỐNG, SẴN SÀNG CHO THỰC TẾ</div>
          <h1>Bắt đầu hành trình trở thành phiên bản vững vàng hơn!</h1>
          <p className="register-left-desc">
            Tham gia Mimo ngay hôm nay để học kỹ năng sống qua các tình huống thực tế, với sự hỗ trợ thông minh từ AI.
          </p>

          <div className="register-benefits">
            <div className="register-benefit-item">
              <div className="benefit-icon-wrapper bg-blue">🎮</div>
              <div className="benefit-text">
                <h4>Học qua tình huống thực tế</h4>
                <p>Trải nghiệm như trong đời thật</p>
              </div>
            </div>
            <div className="register-benefit-item">
              <div className="benefit-icon-wrapper bg-green">🧠</div>
              <div className="benefit-text">
                <h4>AI phân tích & hướng dẫn</h4>
                <p>Giải thích chi tiết, dễ hiểu</p>
              </div>
            </div>
            <div className="register-benefit-item">
              <div className="benefit-icon-wrapper bg-orange">⭐</div>
              <div className="benefit-text">
                <h4>Rèn luyện kỹ năng thiết yếu</h4>
                <p>An toàn hơn trong cuộc sống</p>
              </div>
            </div>
            <div className="register-benefit-item">
              <div className="benefit-icon-wrapper bg-purple">❤️</div>
              <div className="benefit-text">
                <h4>Vì một cộng đồng an toàn hơn</h4>
                <p>Bắt đầu từ chính bạn</p>
              </div>
            </div>
          </div>

          <div className="register-mascot-area">
            <div className="mascot-large">🤖</div>
            <div className="mascot-quote">
              "Kỹ năng hôm nay, cuộc sống tốt đẹp hơn ngày mai!"
            </div>
            <div style={{ position: 'absolute', right: '0', bottom: '20px', fontFamily: 'Comic Sans MS', color: '#3b82f6', transform: 'rotate(-5deg)' }}>
              Cùng<br/>Mimo nhé!
            </div>
          </div>
        </div>

        {/* Right Column (Form) */}
        <div className="register-right">
          <div className="register-card">
            <h2>Tạo tài khoản Mimo</h2>
            <p>Chỉ mất vài phút để bắt đầu hành trình học kỹ năng sống!</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ và tên</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input type="text" placeholder="Nhập họ và tên của bạn" required />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input type="email" placeholder="Nhập email của bạn" required />
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Tạo mật khẩu (ít nhất 6 ký tự)" 
                    required 
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Nhập lại mật khẩu" 
                    required 
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    className="input-icon-right"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-register-submit">
                Đăng ký ngay →
              </button>
            </form>

            <div className="divider">Hoặc đăng ký bằng</div>

            <div className="social-login-group">
              <button className="btn-social">
                <span>G</span> Google
              </button>
              <button className="btn-social">
                <span style={{ color: '#1877f2' }}>f</span> Facebook
              </button>
              <button className="btn-social">
                <span></span> Apple
              </button>
            </div>

            <div className="terms-text">
              Bằng việc đăng ký, bạn đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a> của Mimo.
            </div>
          </div>
        </div>
      </main>
      
      <div className="bg-shape-bottom"></div>
    </div>
  );
};

export default MimoRegisterPage;
