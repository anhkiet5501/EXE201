import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MimoMascot from '../../components/common/MimoMascot';
import './LandingPage.css';

export default function LandingPage() {
  const [selectedChoice, setSelectedChoice] = useState('A');
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);

  const choices = [
    { id: 'A', text: 'Kiểm tra xem người đó còn thở không.' },
    { id: 'B', text: 'Gọi người khác giúp đỡ.' },
    { id: 'C', text: 'Ngay lập tức cho uống nước.' },
    { id: 'D', text: 'Bỏ đi vì sợ gặp rắc rối.' },
  ];

  const handleSelectChoice = (id) => {
    setSelectedChoice(id);
    setShowAiAnalysis(false);
  };

  return (
    <div className="landing-page">
      {/* ---------------- 1. HEADER NAVBAR ---------------- */}
      <header className="landing-header">
        <div className="landing-container landing-header-inner">
          <Link to="/" className="landing-logo-link">
            <img src="/images/logo.png" alt="Mimo Logo" className="landing-logo-img" />
          </Link>

          <nav className="landing-nav">
            <a href="#home" className="landing-nav-link active">Trang chủ</a>
            <a href="#scenarios" className="landing-nav-link">Tình huống</a>
            <a href="#how-it-works" className="landing-nav-link">Cách hoạt động</a>
            <a href="#why-mimo" className="landing-nav-link">Chủ đề</a>
            <a href="#about" className="landing-nav-link">Về Mimo</a>
          </nav>

          <div className="landing-header-actions">
            <Link to="/login" className="landing-login-btn">Đăng nhập</Link>
            <Link to="/register" className="landing-start-btn">Bắt đầu</Link>
          </div>
        </div>
      </header>

      {/* ---------------- 2. HERO SECTION ---------------- */}
      <section className="landing-container landing-hero" id="home">
        {/* Left Visual Area */}
        <div className="hero-visual-area">
          <div className="hero-floating-card card-tl">
            <span style={{ fontSize: '24px' }}>🚦</span>
            <span>Tai nạn<br />giao thông</span>
          </div>

          <div className="hero-floating-card card-tr">
            <span style={{ fontSize: '24px' }}>🔥</span>
            <span>Hỏa hoạn</span>
          </div>

          <MimoMascot className="hero-mascot-img" />

          <div className="hero-floating-card card-bl">
            <span style={{ fontSize: '24px' }}>➕</span>
            <span>Sơ cứu</span>
          </div>

          <div className="hero-floating-card card-br">
            <span style={{ fontSize: '24px' }}>👥</span>
            <span>Bạo lực<br />học đường</span>
          </div>

          <div className="hero-quote-badge">
            Kỹ năng hôm nay cuộc sống tốt đẹp hơn ngày mai!
          </div>
        </div>

        {/* Right Content Area */}
        <div className="hero-content-area">
          <h1 className="hero-title">
            Học kỹ năng sống qua các tình huống mô phỏng thực tế
          </h1>
          <p className="hero-desc">
            Mimo giúp bạn luyện cách ra quyết định trong các tình huống như tai nạn giao thông, hỏa hoạn, sơ cứu và bạo lực học đường/gia đình. Sau mỗi lựa chọn, AI sẽ phân tích, phản hồi và hướng dẫn cách xử lý đúng.
          </p>

          <div className="hero-cta-buttons">
            <Link to="/register" className="btn-green-cta">
              Bắt đầu miễn phí →
            </Link>
            <Link to="/login" className="btn-white-cta">
              Tôi đã có tài khoản
            </Link>
          </div>

          <div className="hero-check-features">
            <div className="check-item">
              <span className="check-item-icon">🎓</span>
              <span>Dễ học<br />dễ áp dụng</span>
            </div>
            <div className="check-item">
              <span className="check-item-icon">👥</span>
              <span>Phù hợp cho<br />học sinh, sinh viên</span>
            </div>
            <div className="check-item">
              <span className="check-item-icon">💙</span>
              <span>Vì một cuộc sống<br />an toàn hơn</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. HOW IT WORKS ---------------- */}
      <section className="section-how-it-works" id="how-it-works">
        <div className="landing-container">
          <div className="section-heading-center">
            <h2>Mimo hoạt động như thế nào?</h2>
            <p>Chỉ với 3 bước đơn giản, bạn đã có thể bắt đầu hành trình rèn luyện kỹ năng sống!</p>
          </div>

          <div className="how-steps-row">
            <div className="how-step-card">
              <div className="how-step-num">1</div>
              <div className="how-step-icon" style={{ background: '#e0edff', color: '#1d64ec' }}>📋</div>
              <h3>Chọn tình huống</h3>
              <p>Chọn chủ đề bạn muốn luyện tập.</p>
            </div>

            <div className="how-step-arrow">›</div>

            <div className="how-step-card">
              <div className="how-step-num">2</div>
              <div className="how-step-icon" style={{ background: '#fef3c7', color: '#d97706' }}>🤔</div>
              <h3>Đưa ra quyết định</h3>
              <p>Trả lời theo cách bạn sẽ phản ứng trong thực tế.</p>
            </div>

            <div className="how-step-arrow">›</div>

            <div className="how-step-card">
              <div className="how-step-num">3</div>
              <div className="how-step-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>🤖</div>
              <h3>Nhận phản hồi từ AI</h3>
              <p>AI phân tích, giải thích và hướng dẫn cách xử lý an toàn hơn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. WHY MIMO ---------------- */}
      <section className="section-why-mimo" id="why-mimo">
        <div className="landing-container">
          <div className="section-heading-center">
            <h2>Vì sao nên học cùng Mimo?</h2>
            <p>Không chỉ là kiến thức, Mimo còn giúp bạn tự tin hơn trong cuộc sống hằng ngày.</p>
          </div>

          <div className="why-cards-grid">
            <div className="why-card why-card-blue">
              <span className="why-card-icon">🎯</span>
              <h3>Mô phỏng thực tế</h3>
              <p>Tình huống gần gũi, dễ áp dụng vào đời sống.</p>
            </div>

            <div className="why-card why-card-green">
              <span className="why-card-icon">🤖</span>
              <h3>AI phản hồi ngay</h3>
              <p>Phân tích lựa chọn và giải thích rõ ràng.</p>
            </div>

            <div className="why-card why-card-yellow">
              <span className="why-card-icon">💡</span>
              <h3>Học chủ động</h3>
              <p>Không chỉ đọc lý thuyết mà còn tự đưa ra quyết định.</p>
            </div>

            <div className="why-card why-card-indigo">
              <span className="why-card-icon">🛡️</span>
              <h3>An toàn & hữu ích</h3>
              <p>Rèn kỹ năng ứng phó khi sự cố thật xảy ra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. INTERACTIVE DEMO SCENARIO ---------------- */}
      <section className="section-interactive-demo" id="scenarios">
        <div className="landing-container">
          <div className="interactive-demo-card">
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1e3a8a', margin: '0 0 6px 0' }}>
                Tình huống mẫu: Gặp người bị ngất trên đường
              </h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
                Bạn sẽ làm gì trong tình huống này?
              </p>
            </div>

            <div className="demo-grid">
              {/* Left scene box */}
              <div className="demo-scene-box">
                <div className="demo-speech-bubble">
                  Bạn đang đi trên đường thì thấy một người bất ngờ ngất xỉu. Không có ai khác xung quanh. Bạn sẽ làm gì?
                </div>

                <div className="demo-scene-actors">
                  <span className="demo-victim-actor">🚶‍♂️💤</span>
                  <img src="/images/mascot.png" alt="Mimo checking" className="demo-mascot-actor" />
                </div>
              </div>

              {/* Right choice list */}
              <div>
                <div className="demo-choices-list">
                  {choices.map((c) => (
                    <div
                      key={c.id}
                      className={`demo-choice-item ${selectedChoice === c.id ? 'selected' : ''}`}
                      onClick={() => handleSelectChoice(c.id)}
                    >
                      <span className="demo-choice-badge">{c.id}</span>
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="demo-submit-btn"
                  style={{ width: '100%' }}
                  onClick={() => setShowAiAnalysis(true)}
                >
                  Xem AI phân tích →
                </button>

                {showAiAnalysis && (
                  <div className={`demo-ai-feedback-box ${selectedChoice === 'A' ? 'feedback-correct' : 'feedback-warning'}`}>
                    {selectedChoice === 'A' && (
                      <p style={{ margin: 0 }}>
                        ✨ <strong>Chính xác tuyệt vời!</strong> Bước đầu tiên trong nguyên tắc sơ cứu ABC là kiểm tra tri giác và đường thở. Nếu không thở, cần gọi cấp cứu 115 và ép tim ngoài lồng ngực ngay!
                      </p>
                    )}
                    {selectedChoice === 'B' && (
                      <p style={{ margin: 0 }}>
                        💡 <strong>Khá tốt nhưng chưa đủ:</strong> Tìm sự hỗ trợ là đúng, nhưng cần ưu tiên kiểm tra xem nạn nhân có thở không trong 10 giây đầu tiên để quyết định gọi 115 khẩn cấp!
                      </p>
                    )}
                    {selectedChoice === 'C' && (
                      <p style={{ margin: 0 }}>
                        ⚠️ <strong>Rất nguy hiểm!</strong> Tuyệt đối KHÔNG đổ nước vào miệng người bất tỉnh vì dịch nước có thể tràn vào phổi gây ngạt thở cấp tính!
                      </p>
                    )}
                    {selectedChoice === 'D' && (
                      <p style={{ margin: 0 }}>
                        ℹ️ <strong>Cần cải thiện:</strong> Sự thờ ơ có thể làm mất đi "thời gian vàng" cứu mạng nạn nhân. Bạn có thể đứng ở cự ly an toàn và gọi 115 giúp họ!
                      </p>
                    )}
                  </div>
                )}

                <div className="demo-quote-note">
                  <span>💡</span>
                  <span>Mỗi tình huống là một bài học cho cuộc sống thật.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. CTA BANNER ---------------- */}
      <section className="section-cta-banner" id="about">
        <div className="landing-container">
          <div className="cta-banner-card">
            <div className="cta-banner-left">
              <h2>Sẵn sàng rèn luyện kỹ năng sống mỗi ngày cùng Mimo?</h2>
              <p>Những kỹ năng nhỏ hôm nay có thể tạo nên sự khác biệt lớn ngày mai.</p>
              <Link to="/register" className="btn-green-cta">
                Bắt đầu ngay →
              </Link>
            </div>

            <div className="cta-banner-right">
              <img
                src="/images/mascot.png"
                alt="Mimo celebrating"
                className="cta-mascot-img"
              />
              <div className="cta-speech-bubble">
                Cùng nhau<br />tạo nên một<br />cuộc sống an toàn hơn! 💙
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 7. FOOTER ---------------- */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-columns">
            <div className="footer-col-brand">
              <img src="/images/logo.png" alt="Mimo Logo" style={{ height: '38px' }} />
              <p>
                Kỹ năng hôm nay,<br />
                cuộc sống tốt đẹp hơn ngày mai.
              </p>
            </div>

            <div className="footer-col">
              <h4>Sản phẩm</h4>
              <ul className="footer-links">
                <li><a href="#scenarios">Tình huống</a></li>
                <li><a href="#why-mimo">Chủ đề</a></li>
                <li><a href="#how-it-works">Cách hoạt động</a></li>
                <li><a href="#about">Về Mimo</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Hỗ trợ</h4>
              <ul className="footer-links">
                <li><a href="#help">Trung tâm trợ giúp</a></li>
                <li><a href="#faq">Câu hỏi thường gặp</a></li>
                <li><a href="#feedback">Phản hồi</a></li>
                <li><a href="#terms">Điều khoản sử dụng</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Liên hệ</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>
                ✉️ hello@mimo.vn
              </p>
              <div className="footer-social-row">
                <a href="#fb" className="footer-social-icon" title="Facebook">f</a>
                <a href="#yt" className="footer-social-icon" title="YouTube">▶</a>
                <a href="#tk" className="footer-social-icon" title="TikTok">♪</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <div>© 2026 Mimo. Lan tỏa kỹ năng sống đến mọi người.</div>
            <div style={{ color: '#ef4444' }}>💙</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
