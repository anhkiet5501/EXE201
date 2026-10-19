import React, { useState } from 'react';
import './MimoLandingPage.css';

const MimoLandingPage = ({ onStart, onRegisterClick }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (id) => {
    setSelectedOption(id);
  };

  return (
    <div className="mimo-landing">
      <div className="mimo-landing-container">
        
        {/* Header */}
        <header className="landing-header">
          <a href="#" className="landing-logo">
            <div className="landing-logo-icon">🤖</div>
            mimo
          </a>
          <nav className="landing-nav">
            <a href="#" className="active">Trang chủ</a>
            <a href="#">Tình huống</a>
            <a href="#">Cách hoạt động</a>
            <a href="#">Chủ đề</a>
            <a href="#">Về Mimo</a>
          </nav>
          <div className="landing-actions">
            <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); onStart(); }}>Đăng nhập</a>
            <button className="btn-primary" onClick={onStart}>Bắt đầu</button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Học kỹ năng sống qua các tình huống mô phỏng thực tế</h1>
            <p>Mimo giúp bạn luyện cách ra quyết định trong các tình huống như tai nạn giao thông, hỏa hoạn, sơ cứu và bạo lực học đường/gia đình. Sau mỗi lựa chọn, AI sẽ phân tích, phản hồi và hướng dẫn cách xử lý đúng.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={onRegisterClick}>Bắt đầu miễn phí →</button>
              <button className="btn-secondary" onClick={onStart}>Tôi đã có tài khoản</button>
            </div>
            <div className="hero-features">
              <div className="hero-feature-item">
                <span>🎓</span> Dễ học<br/>dễ áp dụng
              </div>
              <div className="hero-feature-item">
                <span>👥</span> Phù hợp cho<br/>học sinh, sinh viên
              </div>
              <div className="hero-feature-item">
                <span>💙</span> Vì một cuộc sống<br/>an toàn hơn
              </div>
            </div>
          </div>
          <div className="hero-visual">
            {/* Mascot and floating badges using emoji and css */}
            <div className="hero-badge badge-tl">
              <span className="badge-icon-lg">🚦</span>
              Tai nạn giao thông
            </div>
            <div className="hero-badge badge-tr">
              <span className="badge-icon-lg">🔥</span>
              Hỏa hoạn
            </div>
            <div className="hero-mascot">🤖</div>
            <div className="hero-badge badge-bl">
              <span className="badge-icon-lg">🚑</span>
              Sơ cứu
            </div>
            <div className="hero-badge badge-br">
              <span className="badge-icon-lg">👨‍👩‍👧‍👦</span>
              Bạo lực học đường
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-it-works">
          <div className="section-header">
            <h2>Mimo hoạt động như thế nào?</h2>
            <p>Chỉ với 3 bước đơn giản, bạn đã có thể bắt đầu hành trình rèn luyện kỹ năng sống!</p>
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📋</div>
              <h3>Chọn tình huống</h3>
              <p>Chọn chủ đề bạn muốn luyện tập.</p>
            </div>
            <div className="step-arrow">›</div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🤔</div>
              <h3>Đưa ra quyết định</h3>
              <p>Trả lời theo cách bạn sẽ phản ứng trong thực tế.</p>
            </div>
            <div className="step-arrow">›</div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">🤖</div>
              <h3>Nhận phản hồi từ AI</h3>
              <p>AI phân tích, giải thích và hướng dẫn cách xử lý an toàn hơn.</p>
            </div>
          </div>
        </section>

        {/* Why Mimo */}
        <section className="why-mimo">
          <div className="section-header">
            <h2>Vì sao nên học cùng Mimo?</h2>
            <p>Không chỉ là kiến thức, Mimo còn giúp bạn tự tin hơn trong cuộc sống hằng ngày.</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card bg-blue">
              <div className="benefit-icon">🎯</div>
              <h3>Mô phỏng thực tế</h3>
              <p>Tình huống gần gũi, để áp dụng vào đời sống.</p>
            </div>
            <div className="benefit-card bg-green">
              <div className="benefit-icon">🤖</div>
              <h3>AI phản hồi ngay</h3>
              <p>Phân tích lựa chọn và giải thích rõ ràng.</p>
            </div>
            <div className="benefit-card bg-orange">
              <div className="benefit-icon">💡</div>
              <h3>Học chủ động</h3>
              <p>Không chỉ đọc lý thuyết mà còn tự đưa ra quyết định.</p>
            </div>
            <div className="benefit-card bg-purple">
              <div className="benefit-icon">🛡️</div>
              <h3>An toàn & hữu ích</h3>
              <p>Rèn kỹ năng ứng phó khi sự cố thật xảy ra.</p>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="demo-section">
          <div className="demo-card">
            <div className="demo-header">
              <h3>Tình huống mẫu: Gặp người bị ngất trên đường</h3>
              <p>Bạn sẽ làm gì trong tình huống này?</p>
            </div>
            <div className="demo-content">
              <div className="demo-visual">
                <div className="demo-scene">
                  👦😵🤖
                </div>
                <div className="demo-chat-bubble">
                  Bạn đang đi trên đường thì thấy một người bất ngờ ngất xỉu. Không có ai khác xung quanh. Bạn sẽ làm gì?
                </div>
              </div>
              <div className="demo-options">
                <div 
                  className={`demo-option ${selectedOption === 'A' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('A')}
                >
                  <div className="option-letter">A</div>
                  Kiểm tra xem người đó còn thở không.
                </div>
                <div 
                  className={`demo-option ${selectedOption === 'B' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('B')}
                >
                  <div className="option-letter">B</div>
                  Gọi người khác giúp đỡ.
                </div>
                <div 
                  className={`demo-option ${selectedOption === 'C' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('C')}
                >
                  <div className="option-letter">C</div>
                  Ngay lập tức cho uống nước.
                </div>
                <div 
                  className={`demo-option ${selectedOption === 'D' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('D')}
                >
                  <div className="option-letter">D</div>
                  Bỏ đi vì sợ gặp rắc rối.
                </div>
                
                <div className="demo-note">
                  Mỗi tình huống là một bài học cho cuộc sống thật.<br/>💡
                </div>
                
                <div className="demo-action">
                  <button className="btn-blue" onClick={() => alert('AI đang phân tích lựa chọn của bạn...')}>
                    Xem AI phân tích →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Sẵn sàng rèn luyện kỹ năng sống mỗi ngày cùng Mimo?</h2>
            <p>Những kỹ năng nhỏ hôm nay có thể tạo nên sự khác biệt lớn ngày mai.</p>
          </div>
          <div className="cta-action">
            <button className="btn-primary" onClick={onStart}>Bắt đầu ngay →</button>
            <div className="cta-mascot">🤖</div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="mimo-landing-container">
          <div className="footer-content">
            <div className="footer-col" style={{ flex: 2 }}>
              <a href="#" className="landing-logo" style={{ marginBottom: '10px', display: 'inline-flex' }}>
                <div className="landing-logo-icon">🤖</div>
                mimo
              </a>
              <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '250px' }}>
                Kỹ năng hôm nay,<br/>cuộc sống tốt đẹp hơn ngày mai.
              </p>
            </div>
            
            <div className="footer-col">
              <h4>Sản phẩm</h4>
              <ul>
                <li><a href="#">Tình huống</a></li>
                <li><a href="#">Chủ đề</a></li>
                <li><a href="#">Cách hoạt động</a></li>
                <li><a href="#">Về Mimo</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><a href="#">Trung tâm trợ giúp</a></li>
                <li><a href="#">Câu hỏi thường gặp</a></li>
                <li><a href="#">Phản hồi</a></li>
                <li><a href="#">Điều khoản sử dụng</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Liên hệ</h4>
              <ul style={{ marginBottom: '20px' }}>
                <li><a href="mailto:hello@mimo.vn">✉️ hello@mimo.vn</a></li>
              </ul>
              <div className="footer-social">
                <a href="#" className="social-icon">f</a>
                <a href="#" className="social-icon">▶</a>
                <a href="#" className="social-icon">♪</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div>© 2026 Mimo</div>
            <div>Lan tỏa kỹ năng sống đến mọi người. 💙</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MimoLandingPage;
