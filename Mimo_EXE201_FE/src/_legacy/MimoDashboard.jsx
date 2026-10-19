import React, { useState, useEffect, useRef } from 'react';
import './MimoDashboard.css';

const MimoDashboard = () => {
  const [activeTab, setActiveTab] = useState('Bảng xếp hạng'); 
  
  // States for dropdowns
  const [showNotif, setShowNotif] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Define navigation items
  const navItems = [
    { id: 'Trang chủ', icon: '🏠' },
    { id: 'Học tập', icon: '📖' },
    { id: 'Bảng xếp hạng', icon: '🏆' },
    { id: 'Thư viện', icon: '📚' },
    { id: 'Thành tích', icon: '🏅' },
    { id: 'Hồ sơ', icon: '👤' }
  ];

  // Close dropdowns when clicking outside
  const headerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowNotif(false);
        setShowSettings(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderHomeContent = () => (
    <>
      <section className="mimo-hero">
        <h1>Chào buổi sáng, Nam! 👋</h1>
        <p>Hôm nay cùng Mimo học thêm một kỹ năng để luôn an toàn và sẵn sàng nhé!</p>
        <div className="mimo-quote">
          "Những kỹ năng nhỏ hôm nay có thể tạo nên sự khác biệt lớn ngày mai!"
        </div>
      </section>

      <section className="mimo-stats">
        <div className="mimo-stat-card">
          <div className="stat-left">
            <div className="stat-icon stat-fire">🔥</div>
            <div className="stat-info">
              <h3>7 ngày</h3>
              <span>Chuỗi ngày liên tục</span>
            </div>
          </div>
          <span>›</span>
        </div>
        <div className="mimo-stat-card">
          <div className="stat-left">
            <div className="stat-icon stat-star">⭐</div>
            <div className="stat-info">
              <h3>1.250 XP</h3>
              <span>Tổng điểm kinh nghiệm</span>
            </div>
          </div>
          <span>›</span>
        </div>
        <div className="mimo-stat-card">
          <div className="stat-left">
            <div className="stat-icon stat-crown">👑</div>
            <div className="stat-info">
              <h3>Cấp 5</h3>
              <span>Người bảo vệ</span>
            </div>
          </div>
          <span>›</span>
        </div>
      </section>

      <section>
        <h2 className="mimo-section-title">🎒 Tiếp tục học</h2>
        <div className="mimo-continue-card">
          <div className="continue-img"></div>
          <div className="continue-content">
            <span className="tag-green">SƠ CỨU</span>
            <h3>Bài 3: Gặp người bị ngất</h3>
            <p>Học cách nhận biết và xử lý khi gặp người bị ngất trong cuộc sống hằng ngày.</p>
            <div className="progress-bar-container">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>60%</span>
            </div>
          </div>
          <button className="btn-continue" onClick={() => handleCourseClick('Sơ cứu: Gặp người bị ngất')}>
            Tiếp tục học →
          </button>
        </div>
      </section>

      <section>
        <h2 className="mimo-section-title">🧩 Khám phá các kỹ năng</h2>
        <div className="mimo-explore-grid">
          <div className="explore-card blue">
            <div className="explore-icon-wrapper">🚦</div>
            <div className="explore-title">An toàn giao thông</div>
            <div className="explore-progress">
              <div className="explore-progress-text">
                <span>6 / 10 bài</span>
                <span style={{color: '#2563eb'}}>60%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '60%', background: '#2563eb' }}></div>
              </div>
            </div>
            <button className="btn-outline-blue" onClick={() => handleCourseClick('An toàn giao thông')}>
              Tiếp tục học →
            </button>
          </div>
          
          <div className="explore-card orange">
            <div className="explore-icon-wrapper">🚒</div>
            <div className="explore-title">Hỏa hoạn và Thoát hiểm</div>
            <div className="explore-progress">
              <div className="explore-progress-text">
                <span>3 / 8 bài</span>
                <span style={{color: '#ea580c'}}>37%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '37%', background: '#ea580c' }}></div>
              </div>
            </div>
            <button className="btn-outline-orange" onClick={() => handleCourseClick('Hỏa hoạn và Thoát hiểm')}>
              Học ngay →
            </button>
          </div>

          <div className="explore-card green">
            <div className="explore-icon-wrapper">🚑</div>
            <div className="explore-title">Sơ cứu</div>
            <div className="explore-progress">
              <div className="explore-progress-text">
                <span>2 / 10 bài</span>
                <span style={{color: '#059669'}}>20%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '20%', background: '#059669' }}></div>
              </div>
            </div>
            <button className="btn-outline-green" onClick={() => handleCourseClick('Sơ cứu')}>
              Tiếp tục học →
            </button>
          </div>

          <div className="explore-card purple">
            <div className="explore-icon-wrapper">👨‍👩‍👧‍👦</div>
            <div className="explore-title">Bạo lực gia đình / học trường</div>
            <div className="explore-progress">
              <div className="explore-progress-text">
                <span>1 / 8 bài</span>
                <span style={{color: '#9333ea'}}>12%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '12%', background: '#9333ea' }}></div>
              </div>
            </div>
            <button className="btn-outline-purple" onClick={() => handleCourseClick('Bạo lực gia đình')}>
              Học ngay →
            </button>
          </div>
        </div>
      </section>
    </>
  );

  const renderHomeRightPanel = () => (
    <>
      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3>🎯 Mục tiêu hôm nay</h3>
          <a href="#">Xem tất cả →</a>
        </div>
        <div className="checklist">
          <div className="check-item completed">
            <div className="check-box">✓</div>
            <span className="check-text">Hoàn thành 1 tình huống</span>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <span className="check-text">Học 10 phút</span>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <span className="check-text">Nhận 50 XP</span>
          </div>
        </div>
        <div className="checklist-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '33%' }}></div>
          </div>
          <div className="checklist-progress-text">1 / 3 hoàn thành</div>
        </div>
      </div>

      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3>🏆 Thành tích gần đây</h3>
          <a href="#">Xem tất cả →</a>
        </div>
        <div className="badge-list">
          <div className="badge-item">
            <div className="badge-icon">🔥</div>
            <div className="badge-info">
              <h4>Kiên trì</h4>
              <p>Học liên tục 7 ngày</p>
            </div>
            <span className="badge-time">7 ngày trước</span>
          </div>
          <div className="badge-item">
            <div className="badge-icon">🚑</div>
            <div className="badge-info">
              <h4>Người cứu hộ nhí</h4>
              <p>Hoàn thành 5 bài sơ cứu</p>
            </div>
            <span className="badge-time">3 ngày trước</span>
          </div>
          <div className="badge-item">
            <div className="badge-icon">🚦</div>
            <div className="badge-info">
              <h4>Người tham gia an toàn</h4>
              <p>Hoàn thành 10 tình huống</p>
            </div>
            <span className="badge-time">1 ngày trước</span>
          </div>
        </div>
      </div>

      <div className="emergency-banner">
        <div className="emergency-title">
          ⚠️ Nếu bạn đang gặp tình huống khẩn cấp ›
        </div>
        <h4>Giữ bình tĩnh, bạn không đơn độc!</h4>
        <p>Mimo cung cấp hướng dẫn nhanh và các số điện thoại hỗ trợ khi cần thiết.</p>
        <button className="btn-emergency" onClick={() => alert('Khẩn cấp!')}>
          Xem hướng dẫn ngay →
        </button>
      </div>
    </>
  );

  const renderLearningContent = () => (
    <>
      <div className="learning-breadcrumb">
        <span>🏠 Trang chủ</span> / <span>Học tập</span> / <strong>An toàn giao thông</strong>
      </div>
      
      {/* Banner */}
      <section className="learning-hero">
        <div className="learning-hero-content">
          <h1>An toàn giao thông</h1>
          <p>Học cách đưa ra lựa chọn an toàn khi đi bộ, đi xe đạp và tham gia giao thông hằng ngày!</p>
          <div className="learning-quote">
            "An toàn hôm nay<br/>là nụ cười ngày mai!"
          </div>
        </div>
        <div className="learning-hero-mascot">
          <div className="mascot-bubble">
            Đi an toàn<br/>Học vui hơn<br/>mỗi ngày!
          </div>
          🤖🚦🚶
        </div>
      </section>

      {/* Stats Row */}
      <section className="mimo-stats">
        <div className="mimo-stat-card">
          <div className="stat-left">
            <div className="stat-icon" style={{background: '#eff6ff', color: '#3b82f6'}}>📖</div>
            <div className="stat-info">
              <h3 style={{color: '#1e3a8a'}}>6 / 10</h3>
              <span>Bài học đã hoàn thành</span>
            </div>
          </div>
          <span style={{color: '#cbd5e1'}}>›</span>
        </div>
        <div className="mimo-stat-card">
          <div className="stat-left">
            <div className="stat-icon" style={{background: '#fef9c3', color: '#eab308'}}>⭐</div>
            <div className="stat-info">
              <h3 style={{color: '#b45309'}}>1.250 XP</h3>
              <span>Tổng điểm chủ đề</span>
            </div>
          </div>
          <span style={{color: '#cbd5e1'}}>›</span>
        </div>
        <div className="mimo-stat-card">
          <div className="stat-left">
            <div className="stat-icon" style={{background: '#ffedd5', color: '#f97316'}}>👑</div>
            <div className="stat-info">
              <h3 style={{color: '#c2410c'}}>Cấp 4</h3>
              <span>Người tham gia an toàn</span>
            </div>
          </div>
          <span style={{color: '#cbd5e1'}}>›</span>
        </div>
        <div className="mimo-stat-card">
          <div className="stat-left">
            <div className="stat-icon" style={{background: '#fef2f2', color: '#ef4444'}}>🔥</div>
            <div className="stat-info">
              <h3 style={{color: '#b91c1c'}}>7 ngày</h3>
              <span>Chuỗi học liên tục</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lộ trình học */}
      <section className="learning-path-section">
        <div className="section-header-row">
          <h2 className="mimo-section-title">📖 Lộ trình học</h2>
          <a href="#" className="view-all-link">Xem tất cả bài học →</a>
        </div>
        
        <div className="path-grid">
          <div className="path-card">
            <div className="path-number">1</div>
            <div className="path-img-wrapper" style={{background: '#eff6ff'}}>🚶</div>
            <h3>Qua đường an toàn</h3>
            <p>Nhận biết nguy hiểm và qua đường đúng cách.</p>
            <div className="path-progress">
              <div className="progress-track"><div className="progress-fill" style={{width: '100%'}}></div></div>
              <span style={{color: '#10b981', fontWeight: 'bold'}}>100%</span>
            </div>
            <button className="btn-path complete">✓ Hoàn thành</button>
          </div>

          <div className="path-card">
            <div className="path-number">2</div>
            <div className="path-img-wrapper" style={{background: '#f0fdf4'}}>🚦</div>
            <h3>Đèn tín hiệu giao thông</h3>
            <p>Hiểu ý nghĩa đèn và tuân thủ tín hiệu giao thông.</p>
            <div className="path-progress">
              <div className="progress-track"><div className="progress-fill" style={{width: '60%', background: '#3b82f6'}}></div></div>
              <span style={{color: '#3b82f6', fontWeight: 'bold'}}>60%</span>
            </div>
            <button className="btn-path continue">Tiếp tục →</button>
          </div>

          <div className="path-card">
            <div className="path-number">3</div>
            <div className="path-img-wrapper" style={{background: '#fff7ed'}}>🪖</div>
            <h3>Đội mũ bảo hiểm đúng cách</h3>
            <p>Bảo vệ bản thân khi đi xe đạp, xe máy điện.</p>
            <div className="path-progress">
              <div className="progress-track"><div className="progress-fill" style={{width: '20%', background: '#3b82f6'}}></div></div>
              <span style={{color: '#3b82f6', fontWeight: 'bold'}}>20%</span>
            </div>
            <button className="btn-path start">Học ngay →</button>
          </div>

          <div className="path-card">
            <div className="path-number">4</div>
            <div className="path-img-wrapper" style={{background: '#f8fafc'}}>🚲</div>
            <h3>Đi xe đạp / xe máy điện an toàn</h3>
            <p>Đi đúng luật, giữ khoảng cách và quan sát xung quanh.</p>
            <div className="path-progress">
              <div className="progress-track"><div className="progress-fill" style={{width: '0%'}}></div></div>
              <span style={{color: '#94a3b8', fontWeight: 'bold'}}>0%</span>
            </div>
            <button className="btn-path start">Học ngay →</button>
          </div>
          
          <div className="path-card locked">
            <div className="path-number lock">🔒</div>
            <div className="path-img-wrapper" style={{background: '#f1f5f9'}}>🚑</div>
            <h3>Khi gặp tai nạn giao thông</h3>
            <p>Biết cách xử lý an toàn và gọi hỗ trợ kịp thời.</p>
            <div className="path-progress">
              <div className="progress-track"></div>
              <span style={{color: '#94a3b8', fontWeight: 'bold'}}>0%</span>
            </div>
            <button className="btn-path start disabled">Học ngay →</button>
          </div>
        </div>
      </section>

      {/* Tình huống mô phỏng hôm nay */}
      <section className="simulation-section">
        <div className="section-header-row">
          <h2 className="mimo-section-title" style={{color: '#2563eb'}}>🎮 Tình huống mô phỏng hôm nay</h2>
          <span className="xp-badge">⭐ + 50 XP</span>
        </div>
        
        <div className="simulation-card">
          <div className="sim-visual">
            <div className="sim-scene">👦 👵 🚦</div>
            <div className="sim-note">
              Quan sát kỹ<br/>Chọn hành động đúng!
            </div>
          </div>
          <div className="sim-content">
            <h3>Bạn sẽ làm gì trong tình huống này?</h3>
            <p className="sim-desc">Bạn đang trên đường đi học, đèn tín hiệu chuyển sang màu vàng và có một cụ già đang qua đường. Bạn nên làm gì?</p>
            
            <div className="sim-options">
              <label className="sim-option">
                <input type="radio" name="sim-q" />
                <span>A. Vội vàng qua đường trước khi đèn đỏ.</span>
              </label>
              <label className="sim-option selected">
                <input type="radio" name="sim-q" defaultChecked />
                <span>B. Dừng lại, nhường đường cho cụ già qua trước.</span>
              </label>
              <label className="sim-option">
                <input type="radio" name="sim-q" />
                <span>C. Chạy nhanh qua đường.</span>
              </label>
              <label className="sim-option">
                <input type="radio" name="sim-q" />
                <span>D. Đứng yên và nhìn xung quanh.</span>
              </label>
            </div>
            
            <div className="sim-action">
              <div className="sim-mascot-hint">
                <div className="hint-bubble">Hãy chọn phương án an toàn nhất nhé!</div>
                🤖
              </div>
              <button className="btn-check-answer">Kiểm tra đáp án →</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderLearningRightPanel = () => (
    <>
      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3>🎯 Mục tiêu hôm nay</h3>
          <a href="#">Xem tất cả →</a>
        </div>
        <div className="checklist">
          <div className="check-item completed">
            <div className="check-box">✓</div>
            <div className="check-content">
              <span className="check-icon">📖</span>
              <span className="check-text">Hoàn thành 1 bài học</span>
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div className="check-content">
              <span className="check-icon">🎮</span>
              <span className="check-text">Làm 1 tình huống mô phỏng</span>
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div className="check-content">
              <span className="check-icon">⭐</span>
              <span className="check-text">Đạt 50 XP</span>
            </div>
          </div>
        </div>
        <div className="checklist-progress" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px'}}>
          <div style={{flex: 1}}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '33%' }}></div>
            </div>
            <div className="checklist-progress-text">1 / 3 mục tiêu hoàn thành</div>
          </div>
          <div style={{fontSize: '40px', marginLeft: '10px'}}>
             <div style={{fontSize: '12px', color: '#3b82f6', fontWeight: 'bold', textAlign: 'center', marginBottom: '-5px'}}>Cố lên!</div>
             🤖
          </div>
        </div>
      </div>

      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3>🏆 Thành tích chủ đề</h3>
          <a href="#">Xem tất cả →</a>
        </div>
        <div className="topic-achievements">
          <div className="achieve-row">
            <span className="achieve-label">⭐ Tổng XP</span>
            <span className="achieve-value">1.250 XP</span>
          </div>
          <div className="achieve-row">
            <span className="achieve-label">👑 Cấp hiện tại</span>
            <div className="achieve-value-group">
              <strong>Cấp 4</strong>
              <small>Người tham gia an toàn</small>
            </div>
          </div>
          <div className="achieve-row">
            <span className="achieve-label">🏅 Huy hiệu đã đạt</span>
            <span className="achieve-value">3 / 5</span>
          </div>
          <div className="badge-mini-list">
            <span className="badge-mini">🚦</span>
            <span className="badge-mini">🪖</span>
            <span className="badge-mini">🛡️</span>
            <span className="badge-mini locked"></span>
            <span className="badge-mini locked"></span>
          </div>
          <div className="achieve-row" style={{marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px'}}>
            <span className="achieve-label">⏱️ Thời gian học</span>
            <span className="achieve-value">2 giờ 15 phút</span>
          </div>
        </div>
      </div>

      <div className="mimo-panel-card safety-tips-card">
        <div className="panel-header" style={{marginBottom: '0'}}>
          <h3 style={{color: '#d97706'}}>💡 Mẹo an toàn mỗi ngày</h3>
        </div>
        
        <div className="safety-tips-content">
          <div className="safety-hero">
            <div className="safety-img">🪖👦</div>
            <div className="safety-quote">
              "Đội mũ bảo hiểm đúng cách, bảo vệ nụ cười của bạn!"
            </div>
          </div>
          
          <ul className="safety-list">
            <li><span className="check-blue">✓</span> Chọn mũ vừa vặn với đầu</li>
            <li><span className="check-blue">✓</span> Cài quai chắc chắn</li>
            <li><span className="check-blue">✓</span> Đội mũ khi đi xe đạp, xe máy điện</li>
            <li><span className="check-blue">✓</span> Luôn nhắc nhở người thân cùng thực hiện</li>
          </ul>
          
          <button className="btn-view-tips">Xem thêm mẹo an toàn →</button>
        </div>
      </div>
    </>
  );

  const renderUpgradeContent = () => (
    <div className="upgrade-container">
      <div className="upgrade-hero">
        <div className="upgrade-hero-text">
          <h1>Nâng cấp hành trình<br/>học cùng Mimo 👑</h1>
          <p>Học sâu hơn, luyện nhiều tình huống hơn<br/>và nhận được hướng dẫn AI tốt hơn!</p>
          <div className="upgrade-features">
            <div className="upg-feature-item">
               <div className="upg-icon bg-blue">📖</div>
               Nội dung phong phú hơn
            </div>
            <div className="upg-feature-item">
               <div className="upg-icon bg-red">🎯</div>
               Luyện tập tình huống thực tế hơn
            </div>
            <div className="upg-feature-item">
               <div className="upg-icon bg-purple">🤖</div>
               AI đồng hành thông minh hơn
            </div>
          </div>
        </div>
        <div className="upgrade-hero-mascot">
           <div className="mascot-bubble">Nâng cấp ngay<br/>để khám phá nhiều<br/>điều thú vị hơn nhé!</div>
           <div className="mascot-bubble bottom">"Kiến thức hôm nay<br/>vững vàng tương lai!"</div>
           <div style={{fontSize: '140px'}}>🤖🌟</div>
        </div>
      </div>
      
      <div className="pricing-toggle-container">
        <div className="pricing-toggle">
          <button className="active">Hàng tháng</button>
          <button>Hàng năm</button>
        </div>
        <span className="discount-tag">🏷️ Tiết kiệm đến 20%</span>
      </div>

      <div className="pricing-cards">
        {/* Free Card */}
        <div className="price-card">
          <div className="card-header">
             <div className="card-mascot bg-blue-light">🤖</div>
             <div>
               <h3 style={{color: '#1e293b'}}>Mimo Free</h3>
               <p>Bắt đầu hành trình học cùng Mimo</p>
             </div>
          </div>
          <div className="price">
             <h2>0đ</h2> <span className="badge-gray">Miễn phí</span>
          </div>
          <ul className="feature-list">
             <li><span className="check">✓</span> Bài học cơ bản</li>
             <li><span className="check">✓</span> 4 chủ đề chính</li>
             <li><span className="check">✓</span> XP, streak và huy hiệu</li>
             <li><span className="check">✓</span> Thư viện tài liệu cơ bản</li>
             <li><span className="check">✓</span> 3 lượt phân tích AI/ngày</li>
          </ul>
          <button className="btn-gray disabled" style={{marginTop: 'auto'}}>Gói hiện tại</button>
        </div>

        {/* Plus Card */}
        <div className="price-card highlight">
          <div className="popular-tag">⭐ PHỔ BIẾN NHẤT</div>
          <div className="card-header">
             <div className="card-mascot bg-yellow-light" style={{color: '#d97706'}}>👑</div>
             <div>
               <h3 style={{color: '#1e293b'}}>Mimo Plus</h3>
               <p>Học nhiều hơn. Tiến xa hơn!</p>
             </div>
          </div>
          <div className="price">
             <h2>49.000đ</h2> <span>/ tháng</span>
          </div>
          <ul className="feature-list">
             <li><span className="check green">✓</span> Toàn bộ bài học</li>
             <li><span className="check green">✓</span> Tình huống mô phỏng nâng cao</li>
             <li><span className="check green">✓</span> AI phân tích chi tiết và gợi ý cá nhân hóa</li>
             <li><span className="check green">✓</span> Thư viện tài liệu Premium</li>
             <li><span className="check green">✓</span> Thống kê tiến độ nâng cao</li>
             <li><span className="check green">✓</span> Không quảng cáo</li>
             <li><span className="check green">✓</span> Huy hiệu Plus đặc biệt</li>
          </ul>
          <button className="btn-blue-gradient" style={{marginTop: 'auto'}}>Dùng thử 7 ngày miễn phí →</button>
          <p className="note">Không cần thẻ thanh toán • Hủy bất cứ lúc nào</p>
        </div>

        {/* Family Card */}
        <div className="price-card">
          <div className="card-header">
             <div className="card-mascot bg-purple-light" style={{fontSize: '30px'}}>👨‍👩‍👧‍👦</div>
             <div>
               <h3 style={{color: '#1e293b'}}>Mimo Family</h3>
               <p>Cùng con phát triển mỗi ngày</p>
             </div>
          </div>
          <div className="price">
             <h2>79.000đ</h2> <span>/ tháng</span>
          </div>
          <ul className="feature-list">
             <li><span className="check green">✓</span> Tất cả quyền lợi của Mimo Plus</li>
             <li><span className="check green">✓</span> Tối đa 4 tài khoản học sinh</li>
             <li><span className="check green">✓</span> Phụ huynh theo dõi tiến độ</li>
             <li><span className="check green">✓</span> Báo cáo học tập hằng tuần</li>
             <li><span className="check green">✓</span> Gợi ý bài học phù hợp theo độ tuổi</li>
             <li><span className="check green">✓</span> Quản lý thời gian học</li>
             <li><span className="check green">✓</span> Hỗ trợ ưu tiên từ đội ngũ Mimo</li>
          </ul>
          <button className="btn-purple" style={{marginTop: 'auto'}}>Chọn gói Family →</button>
        </div>
      </div>
      
      <div className="trust-badges">
        <span>🛡️ Thanh toán an toàn</span> • 
        <span>🔓 Dễ dàng hủy bất cứ lúc nào</span> • 
        <span>💙 Được hơn 500.000 gia đình tin tưởng</span>
      </div>
    </div>
  );

  const renderLibraryContent = () => (
    <>
      <section className="library-hero">
        <div className="lib-hero-text">
          <h1>📚 Thư viện Mimo</h1>
          <p>Khám phá kho tài liệu, video, tình huống và mẹo hữu ích để trang bị kỹ năng sống an toàn hơn mỗi ngày!</p>
          <div className="lib-quote">"Học mọi lúc, mọi nơi - để luôn sẵn sàng trong mọi tình huống!"</div>
        </div>
        <div className="lib-hero-mascot">
           <div className="mascot-bubble">Tri thức hôm nay<br/>- an toàn ngày mai!</div>
           <div style={{fontSize: '110px'}}>🤖📖</div>
        </div>
      </section>

      <div className="lib-filters">
        <div className="filter-chips">
          <button className="chip active">Tất cả</button>
          <button className="chip">🚦 An toàn giao thông</button>
          <button className="chip">🔥 Hỏa hoạn & Thoát hiểm</button>
          <button className="chip">🚑 Sơ cứu</button>
          <button className="chip">🛡️ Bạo lực gia đình/học đường</button>
        </div>
        <div className="filter-dropdowns">
          <select><option>Loại tài liệu</option></select>
          <select><option>Độ tuổi</option></select>
          <select><option>Thời lượng</option></select>
          <select><option>Mức độ</option></select>
          <button className="btn-sort">↕️ Mới nhất</button>
        </div>
      </div>

      <section className="lib-section">
        <div className="section-header-row">
          <h2 className="mimo-section-title">⭐ Tài liệu nổi bật</h2>
          <a href="#" className="view-all-link">Xem tất cả →</a>
        </div>
        <div className="lib-grid">
           <div className="lib-card">
             <div className="card-thumb bg-blue-light">
               <span className="type-badge blue">▶ VIDEO</span>
               <span className="duration">⏱️ 5:32</span>
               <div style={{fontSize: '60px'}}>👦🚲🚦</div>
             </div>
             <div className="card-info">
               <h3>5 quy tắc an toàn khi tham gia giao thông</h3>
               <p className="meta"><span className="icon">🚦</span> An toàn giao thông <br/> THCS, THPT</p>
             </div>
           </div>
           <div className="lib-card">
             <div className="card-thumb bg-orange-light">
               <span className="type-badge orange">▶ VIDEO</span>
               <span className="duration">⏱️ 6:15</span>
               <div style={{fontSize: '60px'}}>👨‍🚒🔥</div>
             </div>
             <div className="card-info">
               <h3>Cách sử dụng bình chữa cháy đúng cách</h3>
               <p className="meta"><span className="icon">🔥</span> Hỏa hoạn & Thoát hiểm <br/> THCS, THPT</p>
             </div>
           </div>
           <div className="lib-card">
             <div className="card-thumb bg-green-light">
               <span className="type-badge green">📄 TÀI LIỆU</span>
               <span className="badge-pdf">PDF</span>
               <div style={{fontSize: '60px'}}>🚑➕</div>
             </div>
             <div className="card-info">
               <h3>Sổ tay sơ cứu cơ bản (dạng PDF)</h3>
               <p className="meta"><span className="icon">🚑</span> Sơ cứu <br/> THCS, THPT</p>
             </div>
           </div>
           <div className="lib-card">
             <div className="card-thumb bg-purple-light">
               <span className="type-badge purple">🎮 TÌNH HUỐNG</span>
               <div style={{fontSize: '60px'}}>👧😢</div>
             </div>
             <div className="card-info">
               <h3>Làm gì khi bị bắt nạt ở trường?</h3>
               <p className="meta"><span className="icon">🛡️</span> Bạo lực gia đình/học đường <br/> THCS, THPT</p>
             </div>
           </div>
        </div>
      </section>

      <section className="lib-section">
        <h2 className="mimo-section-title">📂 Tài liệu theo chủ đề</h2>
        <div className="topic-grid">
          <div className="topic-card bg-blue-light">
             <div className="icon">🚦</div>
             <div>
               <h3>An toàn giao thông</h3>
               <p>24 tài liệu</p>
             </div>
             <div className="arrow bg-blue">→</div>
             <div className="bg-decor">🚗</div>
          </div>
          <div className="topic-card bg-orange-light">
             <div className="icon">🔥</div>
             <div>
               <h3>Hỏa hoạn và Thoát hiểm</h3>
               <p>18 tài liệu</p>
             </div>
             <div className="arrow bg-orange">→</div>
             <div className="bg-decor">🧯</div>
          </div>
          <div className="topic-card bg-green-light">
             <div className="icon">🚑</div>
             <div>
               <h3>Sơ cứu</h3>
               <p>22 tài liệu</p>
             </div>
             <div className="arrow bg-green">→</div>
             <div className="bg-decor">🩹</div>
          </div>
          <div className="topic-card bg-purple-light">
             <div className="icon">🛡️</div>
             <div>
               <h3>Bạo lực gia đình / học đường</h3>
               <p>16 tài liệu</p>
             </div>
             <div className="arrow bg-purple">→</div>
             <div className="bg-decor">👥</div>
          </div>
        </div>
      </section>
    </>
  );

  const renderLibraryRightPanel = () => (
    <>
      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3 style={{color: '#ea580c'}}>🔥 Tài liệu được xem nhiều</h3>
          <a href="#">Xem tất cả →</a>
        </div>
        <div className="top-list">
          <div className="top-item">
             <div className="rank">1</div>
             <div className="icon bg-blue-light">🚗</div>
             <div className="info">
               <h4>Kỹ năng qua đường an toàn</h4>
               <p>12.5K lượt xem</p>
             </div>
          </div>
          <div className="top-item">
             <div className="rank">2</div>
             <div className="icon bg-orange-light">🔥</div>
             <div className="info">
               <h4>Cách thoát hiểm khi có cháy</h4>
               <p>10.3K lượt xem</p>
             </div>
          </div>
          <div className="top-item">
             <div className="rank">3</div>
             <div className="icon bg-green-light">🚑</div>
             <div className="info">
               <h4>Các bước sơ cứu khi bị ngất</h4>
               <p>8.7K lượt xem</p>
             </div>
          </div>
          <div className="top-item">
             <div className="rank">4</div>
             <div className="icon bg-purple-light">🛡️</div>
             <div className="info">
               <h4>Nhận biết và phòng tránh bắt nạt học đường</h4>
               <p>8.1K lượt xem</p>
             </div>
          </div>
          <div className="top-item">
             <div className="rank">5</div>
             <div className="icon bg-red-light">📞</div>
             <div className="info">
               <h4>Kỹ năng gọi điện khẩn cấp</h4>
               <p>7.9K lượt xem</p>
             </div>
          </div>
        </div>
      </div>

      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3 style={{color: '#dc2626'}}>❤️ Tài liệu yêu thích</h3>
          <a href="#">Xem tất cả →</a>
        </div>
        <div className="fav-list">
          <div className="fav-item">
            <div className="icon bg-blue-light">🚗</div>
            <h4>Sổ tay an toàn khi đi xe đạp</h4>
            <div className="more">⋮</div>
          </div>
          <div className="fav-item">
            <div className="icon bg-orange-light">🔥</div>
            <h4>Những việc cần làm khi có cháy</h4>
            <div className="more">⋮</div>
          </div>
          <div className="fav-item">
            <div className="icon bg-green-light">🚑</div>
            <h4>Các bước sơ cứu vết thương thường gặp</h4>
            <div className="more">⋮</div>
          </div>
          <div className="fav-item">
            <div className="icon bg-purple-light">🛡️</div>
            <h4>Làm quen với cảm xúc và tìm người hỗ trợ</h4>
            <div className="more">⋮</div>
          </div>
        </div>
      </div>

      <div className="feedback-card">
         <div className="feedback-content">
           <p>Bạn có tài liệu hay muốn gợi ý cho Mimo không?<br/>Hãy chia sẻ với chúng mình nhé!</p>
           <button className="btn-outline-blue bg-white">Gửi góp ý →</button>
         </div>
         <div className="feedback-mascot">🤖💡</div>
      </div>
    </>
  );

  const renderLeaderboardContent = () => (
    <>
      <section className="leaderboard-hero">
        <div className="lb-hero-content">
          <h1>🏆 Bảng xếp hạng</h1>
          <p>Cùng nhau học tập, cùng nhau tạo nên một môi trường an toàn hơn!</p>
        </div>
        <div className="lb-hero-quote">
           Nỗ lực hôm nay<br/>là một phiên bản tốt hơn<br/>của ngày mai! ✨
        </div>
        <div className="lb-hero-mascot">
           <div style={{fontSize: '110px'}}>🤖🏆</div>
        </div>
      </section>

      <div className="lb-filters">
        <div className="filter-chips">
          <button className="chip active">Tất cả</button>
          <button className="chip">Bạn bè</button>
          <button className="chip">Trong trường</button>
          <button className="chip">Theo lớp</button>
        </div>
        <div className="filter-dropdowns">
          <button className="btn-sort">🗓️ Tuần này ▾</button>
        </div>
      </div>

      <div className="podium-container">
        {/* Rank 2 */}
        <div className="podium-item rank-2">
           <div className="podium-avatar">
             <div className="crown">🥈</div>
             <div style={{fontSize: '40px'}}>👧🏻</div>
             <div className="rank-badge">2</div>
           </div>
           <h4>Trần Phương Anh</h4>
           <p>THPT FPT</p>
           <strong>2.980 XP</strong>
           <div className="podium-base blue"></div>
        </div>
        {/* Rank 1 */}
        <div className="podium-item rank-1">
           <div className="podium-avatar">
             <div className="crown">👑</div>
             <div style={{fontSize: '50px'}}>👦🏻</div>
             <div className="rank-badge">1</div>
           </div>
           <h4>Nguyễn Minh Quân</h4>
           <p>THPT FPT</p>
           <strong>3.250 XP</strong>
           <div className="podium-base gold"></div>
        </div>
        {/* Rank 3 */}
        <div className="podium-item rank-3">
           <div className="podium-avatar">
             <div className="crown">🥉</div>
             <div style={{fontSize: '40px'}}>👦🏽</div>
             <div className="rank-badge">3</div>
           </div>
           <h4>Lê Hoàng Bảo</h4>
           <p>THPT FPT</p>
           <strong>2.760 XP</strong>
           <div className="podium-base orange"></div>
        </div>
      </div>

      <div className="lb-table">
        <div className="lb-row header">
          <div className="lb-col center" style={{width: '40px'}}>#</div>
          <div className="lb-col flex-2">Người dùng</div>
          <div className="lb-col flex-2">Trường / Lớp</div>
          <div className="lb-col center">Cấp độ</div>
          <div className="lb-col center">XP</div>
          <div className="lb-col center">Chuỗi ngày</div>
          <div className="lb-col center">Huy hiệu</div>
        </div>
        
        <div className="lb-row">
          <div className="lb-col center text-gray" style={{width: '40px'}}>4</div>
          <div className="lb-col flex-2 user-col"><div className="lb-avatar">👧🏻</div> Phạm Ngọc Linh</div>
          <div className="lb-col flex-2 text-gray">THPT FPT - 12A1</div>
          <div className="lb-col center text-orange font-bold">👑 6</div>
          <div className="lb-col center font-bold">2.540</div>
          <div className="lb-col center text-red font-bold">🔥 12</div>
          <div className="lb-col center badge-col">
            <span className="mini-badge green">🛡️</span>
            <span className="mini-badge red">🔥</span>
            <span className="mini-badge yellow">⭐</span>
            <span className="mini-badge purple">🛡️</span>
          </div>
        </div>
        <div className="lb-row">
          <div className="lb-col center text-gray" style={{width: '40px'}}>5</div>
          <div className="lb-col flex-2 user-col"><div className="lb-avatar">👦🏻</div> Vũ Đức Huy</div>
          <div className="lb-col flex-2 text-gray">THPT FPT - 12A1</div>
          <div className="lb-col center text-orange font-bold">👑 5</div>
          <div className="lb-col center font-bold">2.380</div>
          <div className="lb-col center text-red font-bold">🔥 9</div>
          <div className="lb-col center badge-col">
             <span className="mini-badge blue">🚗</span>
             <span className="mini-badge red">🔥</span>
             <span className="mini-badge green">➕</span>
             <span className="mini-badge purple">🛡️</span>
          </div>
        </div>
        <div className="lb-row active-user">
          <div className="lb-col center text-blue font-bold" style={{width: '40px'}}>6</div>
          <div className="lb-col flex-2 user-col"><div className="lb-avatar">👦🏻</div> <strong>Hồ Xuân Anh Nam (Bạn)</strong></div>
          <div className="lb-col flex-2 text-blue font-bold">THPT FPT - 12A1</div>
          <div className="lb-col center text-orange font-bold">👑 5</div>
          <div className="lb-col center font-bold text-blue">2.150</div>
          <div className="lb-col center text-red font-bold">🔥 7</div>
          <div className="lb-col center badge-col">
             <span className="mini-badge blue">🚗</span>
             <span className="mini-badge green">➕</span>
             <span className="mini-badge purple">🛡️</span>
          </div>
        </div>
        <div className="lb-row">
          <div className="lb-col center text-gray" style={{width: '40px'}}>7</div>
          <div className="lb-col flex-2 user-col"><div className="lb-avatar">👧🏻</div> Đặng Thu Hà</div>
          <div className="lb-col flex-2 text-gray">THPT FPT - 12A2</div>
          <div className="lb-col center text-orange font-bold">👑 5</div>
          <div className="lb-col center font-bold">2.010</div>
          <div className="lb-col center text-red font-bold">🔥 6</div>
          <div className="lb-col center badge-col">
             <span className="mini-badge blue">🚗</span>
             <span className="mini-badge red">🔥</span>
             <span className="mini-badge purple">🛡️</span>
          </div>
        </div>
        <div className="lb-row">
          <div className="lb-col center text-gray" style={{width: '40px'}}>8</div>
          <div className="lb-col flex-2 user-col"><div className="lb-avatar">👦🏻</div> Nguyễn Gia Bảo</div>
          <div className="lb-col flex-2 text-gray">THPT FPT - 12A3</div>
          <div className="lb-col center text-orange font-bold">👑 4</div>
          <div className="lb-col center font-bold">1.960</div>
          <div className="lb-col center text-red font-bold">🔥 5</div>
          <div className="lb-col center badge-col">
             <span className="mini-badge green">➕</span>
             <span className="mini-badge yellow">⭐</span>
          </div>
        </div>
        <div className="lb-row">
          <div className="lb-col center text-gray" style={{width: '40px'}}>9</div>
          <div className="lb-col flex-2 user-col"><div className="lb-avatar">👦🏻</div> Trần Minh Khang</div>
          <div className="lb-col flex-2 text-gray">THPT FPT - 12A1</div>
          <div className="lb-col center text-orange font-bold">👑 4</div>
          <div className="lb-col center font-bold">1.850</div>
          <div className="lb-col center text-red font-bold">🔥 4</div>
          <div className="lb-col center badge-col">
             <span className="mini-badge blue">🚗</span>
             <span className="mini-badge red">🔥</span>
             <span className="mini-badge yellow">⭐</span>
             <span className="mini-badge purple">🛡️</span>
          </div>
        </div>
        <div className="lb-row">
          <div className="lb-col center text-gray" style={{width: '40px'}}>10</div>
          <div className="lb-col flex-2 user-col"><div className="lb-avatar">👧🏻</div> Lê Thảo Vy</div>
          <div className="lb-col flex-2 text-gray">THPT FPT - 12A4</div>
          <div className="lb-col center text-orange font-bold">👑 4</div>
          <div className="lb-col center font-bold">1.720</div>
          <div className="lb-col center text-red font-bold">🔥 4</div>
          <div className="lb-col center badge-col">
             <span className="mini-badge green">➕</span>
             <span className="mini-badge red">🔥</span>
             <span className="mini-badge blue">🌀</span>
          </div>
        </div>
        
        <button className="btn-view-more-lb">Xem thêm ▾</button>
      </div>
    </>
  );

  const renderLeaderboardRightPanel = () => (
    <>
      <div className="mimo-panel-card text-center" style={{paddingBottom: '24px'}}>
         <div className="panel-header" style={{borderBottom: 'none', justifyContent: 'center'}}>
           <h3 style={{color: '#1e3a8a'}}>📊 Hạng của bạn</h3>
         </div>
         <div className="user-rank-large">
           <div className="avatar-xl">👦</div>
           <h2 className="text-blue">#6</h2>
           <p className="font-bold text-gray-800">Trong trường</p>
           <p className="text-gray text-sm">THPT FPT</p>
         </div>
         <div className="lb-progress-wrap mt-15">
           <div className="progress-track" style={{background: '#e0f2fe'}}><div className="progress-fill" style={{width: '85%', background: '#3b82f6'}}></div></div>
           <div className="flex-between mt-5 text-xs">
              <strong className="text-blue">2.150 XP</strong>
              <span className="text-gray">Còn 350 XP để lên Cấp 6</span>
           </div>
         </div>
      </div>

      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3 style={{color: '#dc2626'}}>🎯 Bảng xếp hạng theo kỹ năng</h3>
        </div>
        <div className="skill-rank-list">
           <div className="skill-rank-item">
             <div className="icon bg-blue-light text-blue">🚗</div>
             <span>An toàn giao thông</span>
             <strong className="ml-auto">#4 ›</strong>
           </div>
           <div className="skill-rank-item">
             <div className="icon bg-orange-light text-orange">🔥</div>
             <span>Hỏa hoạn và Thoát hiểm</span>
             <strong className="ml-auto">#7 ›</strong>
           </div>
           <div className="skill-rank-item">
             <div className="icon bg-green-light text-green">➕</div>
             <span>Sơ cứu</span>
             <strong className="ml-auto">#6 ›</strong>
           </div>
           <div className="skill-rank-item">
             <div className="icon bg-purple-light text-purple">🛡️</div>
             <span>Bạo lực gia đình/học đường</span>
             <strong className="ml-auto">#8 ›</strong>
           </div>
        </div>
      </div>
      
      <div className="feedback-card bg-blue-light flex-col text-center promo-banner">
         <p className="text-blue font-bold text-sm mb-10">Không quan trọng bạn đang ở vị trí nào, quan trọng là bạn luôn tiến lên mỗi ngày!</p>
         <div style={{fontSize: '60px', marginBottom: '10px'}}>🤖🚩</div>
         <button className="btn-blue-gradient w-full">Tiếp tục học ngay →</button>
      </div>
    </>
  );

  const renderProfileContent = () => (
    <div className="profile-tab-wrapper">
      <section className="profile-hero-banner">
         <div className="profile-hero-content">
            <div className="profile-avatar-xl">
               👦
               <button className="btn-camera">📷</button>
            </div>
            <div className="profile-hero-info">
               <h1>Nam <button className="btn-edit-icon">✏️</button></h1>
               <p className="quote">Học an toàn hôm nay, cuộc sống tốt đẹp hơn ngày mai! 🌟</p>
               <div className="tags-row">
                 <span className="tag-blue">Học sinh THPT</span>
                 <span className="tag-orange">Cấp 5</span>
                 <span className="tag-green">Người bảo vệ</span>
                 <button className="btn-edit-icon sm">✏️</button>
               </div>
            </div>
         </div>
         <div className="profile-hero-mascot">
            <div className="mascot-bubble" style={{whiteSpace: 'nowrap'}}>Cố lên Nam!<br/>Bạn đang làm rất tốt!</div>
            <div style={{fontSize: '90px'}}>🤖✨</div>
         </div>
      </section>

      <div className="profile-grid">
         {/* Column 1 */}
         <div className="profile-col">
            <div className="mimo-panel-card" style={{height: '100%'}}>
               <div className="panel-header">
                 <h3 className="text-blue flex-align-center gap-10">👤 Thông tin cá nhân</h3>
                 <button className="btn-text-blue flex-align-center gap-5">✏️ Chỉnh sửa</button>
               </div>
               <div className="info-list">
                 <div className="info-row"><div className="info-label">👤 Họ và tên</div><div className="info-value">Hồ Xuân Anh Nam</div></div>
                 <div className="info-row"><div className="info-label">📅 Ngày sinh</div><div className="info-value">20/04/2004</div></div>
                 <div className="info-row"><div className="info-label">⚧️ Giới tính</div><div className="info-value">Nam</div></div>
                 <div className="info-row"><div className="info-label">🎓 Trường học</div><div className="info-value">Đại học FPT</div></div>
                 <div className="info-row"><div className="info-label">✉️ Email</div><div className="info-value">nam@example.com</div></div>
                 <div className="info-row"><div className="info-label">📞 Số điện thoại</div><div className="info-value">0123 456 789</div></div>
                 <div className="info-row"><div className="info-label">📍 Địa chỉ</div><div className="info-value">Việt Nam</div></div>
               </div>
            </div>
         </div>

         {/* Column 2 */}
         <div className="profile-col flex-col gap-24">
            <div className="mimo-panel-card">
               <div className="panel-header">
                 <h3 className="text-green flex-align-center gap-10"><span style={{fontSize: '20px'}}>❝</span> Giới thiệu bản thân</h3>
                 <button className="btn-text-blue flex-align-center gap-5">✏️ Chỉnh sửa</button>
               </div>
               <p className="bio-text">
                 Mình muốn học thêm nhiều kỹ năng để bảo vệ bản thân, gia đình và những người xung quanh. Cùng Mimo tạo nên một môi trường an toàn hơn nhé! 💙
               </p>
            </div>

            <div className="mimo-panel-card">
               <div className="panel-header">
                 <h3 className="text-red flex-align-center gap-10">❤️ Sở thích</h3>
                 <button className="btn-text-blue flex-align-center gap-5">✏️ Chỉnh sửa</button>
               </div>
               <div className="hobby-chips">
                  <span className="chip-hobby">🎾 Chơi tennis</span>
                  <span className="chip-hobby">📚 Học kỹ năng sống</span>
                  <span className="chip-hobby">🎮 Công nghệ</span>
                  <span className="chip-hobby">🎵 Nghe nhạc</span>
                  <span className="chip-hobby">✈️ Du lịch</span>
                  <button className="btn-add-hobby">+ Thêm sở thích</button>
               </div>
            </div>
         </div>
      </div>

      <div className="profile-grid mt-24">
         {/* Row 2 - Col 1 */}
         <div className="profile-col">
            <div className="mimo-panel-card" style={{height: '100%'}}>
               <div className="panel-header">
                 <h3 className="text-purple flex-align-center gap-10"><span style={{fontSize: '20px'}}>📊</span> Thống kê nhanh</h3>
               </div>
               <div className="stats-grid-2x2">
                 <div className="stat-box bg-orange-light">
                   <div className="icon text-orange">⭐</div>
                   <div className="val text-orange">1.250</div>
                   <div className="lbl text-orange">Điểm XP</div>
                 </div>
                 <div className="stat-box bg-blue-light">
                   <div className="icon text-blue">👑</div>
                   <div className="val text-blue">Cấp 5</div>
                   <div className="lbl text-blue">Người bảo vệ</div>
                 </div>
                 <div className="stat-box bg-red-light">
                   <div className="icon text-red">🔥</div>
                   <div className="val text-red">7 ngày</div>
                   <div className="lbl text-red">Chuỗi học liên tục</div>
                 </div>
                 <div className="stat-box bg-green-light">
                   <div className="icon text-green">📖</div>
                   <div className="val text-green">18</div>
                   <div className="lbl text-green">Bài học đã hoàn thành</div>
                 </div>
               </div>
            </div>
         </div>

         {/* Row 2 - Col 2 */}
         <div className="profile-col">
            <div className="mimo-panel-card" style={{height: '100%'}}>
               <div className="panel-header">
                 <h3 className="text-red flex-align-center gap-10"><span style={{fontSize: '20px'}}>🎯</span> Mục tiêu của tôi</h3>
                 <button className="btn-text-blue flex-align-center gap-5">✏️ Chỉnh sửa</button>
               </div>
               <div className="goal-list-profile">
                 <div className="goal-item-profile">
                    <div className="num">1</div>
                    <div className="txt">Hoàn thành tất cả các chủ đề kỹ năng</div>
                 </div>
                 <div className="goal-item-profile">
                    <div className="num">2</div>
                    <div className="txt">Duy trì chuỗi học liên tục 30 ngày</div>
                 </div>
                 <div className="goal-item-profile">
                    <div className="num">3</div>
                    <div className="txt">Đạt Cấp 10 - Anh hùng Mimo</div>
                 </div>
                 <button className="btn-add-goal-profile">+ Thêm mục tiêu mới</button>
               </div>
            </div>
         </div>
      </div>
      
      <div className="profile-footer-banner mt-24">
         <div style={{fontSize: '40px'}}>🤖🎓</div>
         <span style={{fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a'}}>Mỗi bước tiến nhỏ hôm nay sẽ tạo nên một phiên bản tốt hơn của bạn ngày mai! 🍃</span>
      </div>
    </div>
  );

  const renderAchievementsContent = () => (
    <>
      <section className="achieve-hero">
        <div className="achieve-hero-content">
          <h1>Thành tích của bạn</h1>
          <p>Mỗi kỹ năng nhỏ hôm nay đều tạo nên sự khác biệt lớn ngày mai!</p>
        </div>
        <div className="achieve-hero-mascot">
           <div className="mascot-bubble">Bạn đang làm<br/>tuyệt vời lắm!</div>
           <div className="mascot-bubble right">Cố lên<br/>Nam!</div>
           <div style={{fontSize: '110px'}}>🤖🌟</div>
        </div>
      </section>

      <section className="achieve-stats-row">
         <div className="achieve-stat-box">
           <div className="icon text-orange bg-orange-light">⭐</div>
           <div>
             <h3>3.250 XP</h3>
             <p>Tổng điểm kinh nghiệm</p>
           </div>
         </div>
         <div className="achieve-stat-box">
           <div className="icon text-blue bg-blue-light">👑</div>
           <div>
             <h3>Cấp 6</h3>
             <p>Cấp hiện tại</p>
           </div>
         </div>
         <div className="achieve-stat-box">
           <div className="icon text-red bg-red-light">🔥</div>
           <div>
             <h3>12 ngày</h3>
             <p>Chuỗi ngày học liên tục</p>
           </div>
         </div>
         <div className="achieve-stat-box">
           <div className="icon text-blue bg-blue-light">📖</div>
           <div>
             <h3>18 bài</h3>
             <p>Bài học đã hoàn thành</p>
           </div>
         </div>
         <div className="achieve-stat-box">
           <div className="icon text-green bg-green-light">🚩</div>
           <div>
             <h3>7 tình huống</h3>
             <p>Tình huống mô phỏng</p>
           </div>
         </div>
      </section>

      <section className="mimo-panel-card p-24">
         <div className="panel-header">
           <h2 className="text-green flex-align-center gap-10"><span style={{fontSize:'24px'}}>⚙️</span> Huy hiệu đã đạt được</h2>
           <a href="#" className="text-blue font-bold">Xem tất cả →</a>
         </div>
         <div className="badge-grid mt-15">
            <div className="badge-card">
              <div className="badge-icon-lg fire">🔥</div>
              <h4>Kiên trì 7 ngày</h4>
              <p>Học liên tục 7 ngày</p>
              <div className="date">Đạt ngày 10/04/2024</div>
            </div>
            <div className="badge-card">
              <div className="badge-icon-lg aid">🚑</div>
              <h4>Người cứu hộ nhí</h4>
              <p>Hoàn thành 5 bài sơ cứu</p>
              <div className="date">Đạt ngày 08/04/2024</div>
            </div>
            <div className="badge-card">
              <div className="badge-icon-lg traffic">🚦</div>
              <h4>Người tham gia an toàn giao thông</h4>
              <p>Hoàn thành 10 bài học</p>
              <div className="date">Đạt ngày 05/04/2024</div>
            </div>
            <div className="badge-card">
              <div className="badge-icon-lg fire-esc">🔥</div>
              <h4>Thoát hiểm thông minh</h4>
              <p>Hoàn thành 5 tình huống thoát hiểm</p>
              <div className="date">Đạt ngày 02/04/2024</div>
            </div>
            <div className="badge-card">
              <div className="badge-icon-lg heart">❤️</div>
              <h4>Bạn tốt biết lắng nghe</h4>
              <p>Hoàn thành 5 bài học về bạo lực gia đình/học đường</p>
              <div className="date">Đạt ngày 30/03/2024</div>
            </div>
            <div className="badge-card">
              <div className="badge-icon-lg flash">⚡</div>
              <h4>Phản ứng nhanh</h4>
              <p>Hoàn thành 3 tình huống thử thách thời gian</p>
              <div className="date">Đạt ngày 28/03/2024</div>
            </div>
            <div className="badge-card locked">
              <div className="badge-icon-lg lock">🔒</div>
              <h4>Nhà thám hiểm Mimo</h4>
              <p>Hoàn thành 20 bài học</p>
              <div className="progress-track mt-10"><div className="progress-fill" style={{width: '90%', background: '#3b82f6'}}></div></div>
              <div className="progress-text">18/20</div>
            </div>
            <div className="badge-card locked">
              <div className="badge-icon-lg lock">🎓</div>
              <h4>Chuyên gia an toàn</h4>
              <p>Hoàn thành tất cả chủ đề</p>
              <div className="progress-track mt-10"><div className="progress-fill" style={{width: '24%', background: '#8b5cf6'}}></div></div>
              <div className="progress-text">12/50</div>
            </div>
         </div>
      </section>

      <div className="achieve-2col-layout">
         <section className="mimo-panel-card p-24" style={{flex: 1.5}}>
            <div className="panel-header">
               <h2 className="text-blue flex-align-center gap-10"><span style={{fontSize:'20px'}}>📊</span> Hành trình phát triển</h2>
               <span className="badge-green-pill">Bạn đang ở đây!</span>
            </div>
            <div className="journey-timeline mt-24">
               <div className="timeline-line"></div>
               <div className="timeline-fill" style={{width: '55%'}}></div>
               <div className="timeline-points">
                 <div className="pt done">✓<br/><span>Cấp 1</span></div>
                 <div className="pt done">✓<br/><span>Cấp 2</span></div>
                 <div className="pt done">✓<br/><span>Cấp 3</span></div>
                 <div className="pt done">✓<br/><span>Cấp 4</span></div>
                 <div className="pt done">✓<br/><span>Cấp 5</span></div>
                 <div className="pt active">👑<br/><span>Cấp 6</span></div>
                 <div className="pt">7<br/><span>Cấp 7</span></div>
                 <div className="pt">8<br/><span>Cấp 8</span></div>
                 <div className="pt">9<br/><span>Cấp 9</span></div>
                 <div className="pt">10<br/><span>Cấp 10</span></div>
               </div>
            </div>
            <div className="flex-between mt-24 text-sm">
               <strong className="text-blue">3.250 / 3.500 XP</strong>
               <span className="text-blue font-bold">Còn 250 XP để lên cấp tiếp theo</span>
            </div>
         </section>

         <section className="mimo-panel-card p-24" style={{flex: 1}}>
            <div className="panel-header">
               <h2 className="text-blue flex-align-center gap-10"><span style={{fontSize:'20px'}}>🕒</span> Thành tích gần đây</h2>
               <a href="#" className="text-blue font-bold">Xem tất cả →</a>
            </div>
            <div className="recent-achieves-list mt-15">
               <div className="rc-item">
                  <div className="icon text-red bg-red-light">🚑</div>
                  <div className="rc-info">Hoàn thành bài học Sơ cứu cơ bản</div>
                  <div className="rc-xp">+100 XP</div>
                  <div className="rc-time">Hôm nay</div>
               </div>
               <div className="rc-item">
                  <div className="icon text-orange bg-orange-light">🔥</div>
                  <div className="rc-info">Đạt chuỗi 7 ngày học liên tục</div>
                  <div className="rc-xp">+200 XP</div>
                  <div className="rc-time">2 ngày trước</div>
               </div>
               <div className="rc-item">
                  <div className="icon text-green bg-green-light">🚦</div>
                  <div className="rc-info">Mở khóa huy hiệu Người tham gia an toàn</div>
                  <div className="rc-xp">+50 XP</div>
                  <div className="rc-time">4 ngày trước</div>
               </div>
               <div className="rc-item">
                  <div className="icon text-orange bg-orange-light">🔥</div>
                  <div className="rc-info">Hoàn thành tình huống Thoát hiểm khi có cháy</div>
                  <div className="rc-xp">+100 XP</div>
                  <div className="rc-time">6 ngày trước</div>
               </div>
               <div className="rc-item">
                  <div className="icon text-purple bg-purple-light">❤️</div>
                  <div className="rc-info">Hoàn thành bài học Lắng nghe và chia sẻ</div>
                  <div className="rc-xp">+50 XP</div>
                  <div className="rc-time">1 tuần trước</div>
               </div>
            </div>
         </section>
      </div>

      <section className="mimo-panel-card p-24">
         <div className="panel-header">
            <h2 className="text-blue flex-align-center gap-10"><span style={{fontSize:'20px'}}>🎯</span> Tiến độ theo chủ đề</h2>
         </div>
         <div className="topic-progress-grid mt-15">
            <div className="tp-card">
               <div className="tp-header">
                  <div className="icon bg-blue-light text-blue">🚦</div>
                  <h4>An toàn giao thông</h4>
               </div>
               <div className="progress-track"><div className="progress-fill" style={{width: '60%', background: '#3b82f6'}}></div></div>
               <div className="tp-footer">
                  <span className="text-blue bg-blue-light px-8 py-2 border-radius-4">📖 6/10 bài</span>
                  <span className="text-orange bg-orange-light px-8 py-2 border-radius-4">⭐ 2 huy hiệu</span>
               </div>
               <div className="tp-percent">60%</div>
            </div>
            <div className="tp-card">
               <div className="tp-header">
                  <div className="icon bg-orange-light text-orange">🔥</div>
                  <h4>Hỏa hoạn và Thoát hiểm</h4>
               </div>
               <div className="progress-track"><div className="progress-fill" style={{width: '37%', background: '#ea580c'}}></div></div>
               <div className="tp-footer">
                  <span className="text-orange bg-orange-light px-8 py-2 border-radius-4">📖 3/8 bài</span>
                  <span className="text-orange bg-orange-light px-8 py-2 border-radius-4">⭐ 1 huy hiệu</span>
               </div>
               <div className="tp-percent">37%</div>
            </div>
            <div className="tp-card">
               <div className="tp-header">
                  <div className="icon bg-green-light text-green">🚑</div>
                  <h4>Sơ cứu</h4>
               </div>
               <div className="progress-track"><div className="progress-fill" style={{width: '20%', background: '#10b981'}}></div></div>
               <div className="tp-footer">
                  <span className="text-green bg-green-light px-8 py-2 border-radius-4">📖 2/10 bài</span>
                  <span className="text-orange bg-orange-light px-8 py-2 border-radius-4">⭐ 1 huy hiệu</span>
               </div>
               <div className="tp-percent">20%</div>
            </div>
            <div className="tp-card">
               <div className="tp-header">
                  <div className="icon bg-purple-light text-purple">🛡️</div>
                  <h4>Bạo lực gia đình / học đường</h4>
               </div>
               <div className="progress-track"><div className="progress-fill" style={{width: '12%', background: '#8b5cf6'}}></div></div>
               <div className="tp-footer">
                  <span className="text-purple bg-purple-light px-8 py-2 border-radius-4">📖 1/8 bài</span>
                  <span className="text-orange bg-orange-light px-8 py-2 border-radius-4">⭐ 1 huy hiệu</span>
               </div>
               <div className="tp-percent">12%</div>
            </div>
         </div>
      </section>
    </>
  );

  const renderAchievementsRightPanel = () => (
    <>
      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3 className="text-red flex-align-center gap-10">🎯 Mục tiêu tuần này</h3>
          <a href="#" className="text-blue font-bold">Sửa mục tiêu</a>
        </div>
        <div className="achieve-checklist">
          <div className="check-item-achieve done bg-green-light">
             <div className="box">✓</div>
             <div className="info">
                <h4>Đạt 300 XP trong tuần này</h4>
                <div className="progress-track mt-5"><div className="progress-fill" style={{width: '100%', background: '#10b981'}}></div></div>
                <div className="text-xs text-right mt-2 text-green font-bold">320 / 300 XP</div>
             </div>
             <div className="decor-icon text-green">✨</div>
          </div>
          <div className="check-item-achieve">
             <div className="box"></div>
             <div className="info">
                <h4>Hoàn thành 2 tình huống mô phỏng</h4>
                <div className="progress-track mt-5" style={{background: '#f1f5f9'}}><div className="progress-fill" style={{width: '50%', background: '#cbd5e1'}}></div></div>
                <div className="text-xs text-right mt-2 text-gray">1 / 2</div>
             </div>
          </div>
          <div className="check-item-achieve">
             <div className="box"></div>
             <div className="info">
                <h4>Giữ chuỗi học 7 ngày</h4>
                <div className="progress-track mt-5" style={{background: '#f1f5f9'}}><div className="progress-fill" style={{width: '42%', background: '#cbd5e1'}}></div></div>
                <div className="text-xs text-right mt-2 text-gray">3 / 7</div>
             </div>
          </div>
        </div>
      </div>

      <div className="mimo-panel-card">
        <div className="panel-header">
          <h3 className="text-orange flex-align-center gap-10">⭐ Huy hiệu sắp mở khóa</h3>
          <a href="#" className="text-blue font-bold">Xem tất cả →</a>
        </div>
        <div className="upcoming-badges mt-15">
           <div className="up-badge-item">
              <div className="icon text-red bg-red-light">🐾</div>
              <div className="info">
                 <h4>Người bạn động vật</h4>
                 <p>Hoàn thành 3 bài học đặc biệt về bảo vệ động vật</p>
                 <div className="progress-text">2 / 3</div>
              </div>
           </div>
           <div className="up-badge-item">
              <div className="icon text-blue bg-blue-light">🛡️</div>
              <div className="info">
                 <h4>Chiến binh dũng cảm</h4>
                 <p>Hoàn thành 10 tình huống thử thách</p>
                 <div className="progress-text">7 / 10</div>
              </div>
           </div>
           <div className="up-badge-item">
              <div className="icon text-green bg-green-light">🌍</div>
              <div className="info">
                 <h4>Vì một thế giới an toàn</h4>
                 <p>Hoàn thành tất cả bài học về môi trường và thiên tai</p>
                 <div className="progress-text">4 / 8</div>
              </div>
           </div>
        </div>
      </div>

      <div className="feedback-card achieve-promo flex-col text-center" style={{background: 'linear-gradient(135deg, #e0f2fe, #dbeafe)'}}>
         <h3 className="text-blue font-bold mb-10 text-lg">Bạn đang tiến bộ<br/>mỗi ngày!</h3>
         <div style={{fontSize: '80px', margin: '10px 0'}}>🤖⭐</div>
         <p className="text-sm text-blue mb-15">Kiến thức hôm nay giúp bạn an toàn hơn, tự tin hơn và tạo nên một thế giới tốt đẹp hơn!</p>
         <button className="btn-orange-gradient w-full">Tiếp tục cố gắng nhé! →</button>
      </div>
    </>
  );

  return (
    <div className={`mimo-layout ${(activeTab === 'Nâng cấp' || activeTab === 'Hồ sơ') ? 'full-main' : ''}`}>
      {/* 1. Sidebar */}
      <aside className="mimo-sidebar">
        <div className="mimo-logo">
          <span style={{fontSize: '32px'}}>🤖</span>
          mimo
        </div>
        <nav className="mimo-nav">
          {navItems.map(item => (
            <div 
              key={item.id} 
              className={`mimo-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon} {item.id}
            </div>
          ))}
          <div className="nav-divider"></div>
          <div 
            className={`mimo-nav-item upgrade-tab ${activeTab === 'Nâng cấp' ? 'active' : ''}`}
            onClick={() => setActiveTab('Nâng cấp')}
          >
            ⭐ Nâng cấp
          </div>
        </nav>
        <div className="mimo-sidebar-promo">
          <p>Mimo luôn đồng hành cùng bạn trên hành trình trở thành phiên bản tốt hơn mỗi ngày!</p>
          <div style={{fontSize: '50px', marginTop: '10px'}}>🤖</div>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="mimo-main">
        {/* Header */}
        <header className="mimo-header" ref={headerRef}>
          <div className="mimo-search">
            🔍 <input type="text" placeholder="Tìm bài học, tình huống, kỹ năng..." />
          </div>
          <div className="mimo-user-actions">
            <div className="mimo-lang">🇻🇳 VN ▾</div>
            
            {/* Notification */}
            <div className="mimo-icon-wrapper">
              <div 
                className={`mimo-icon-btn ${showNotif ? 'active' : ''}`} 
                onClick={() => {setShowNotif(!showNotif); setShowSettings(false); setShowProfile(false);}}
              >
                🔔<span className="mimo-badge">3</span>
              </div>
              {showNotif && (
                <div className="dropdown-popup notif-popup">
                  <div className="popup-header">
                    <h3>🔔 Thông báo</h3>
                    <a href="#">✓ Đánh dấu đã đọc</a>
                  </div>
                  <div className="popup-tabs">
                    <button className="active">Tất cả</button>
                    <button>Chưa đọc (3)</button>
                  </div>
                  <div className="notif-list">
                    <div className="notif-item unread">
                      <div className="notif-icon bg-red-light" style={{color: '#dc2626'}}>🚑</div>
                      <div className="notif-content">
                        <h4>Bạn vừa nhận huy hiệu mới! <span className="time">5 phút trước</span><span className="unread-dot"></span></h4>
                        <strong>Người cứu hộ nhí</strong>
                        <p>Bạn đã hoàn thành 5 bài tình huống sơ cứu. Thật tuyệt vời!</p>
                      </div>
                    </div>
                    <div className="notif-item unread">
                      <div className="notif-icon bg-orange-light" style={{color: '#ea580c'}}>🔥</div>
                      <div className="notif-content">
                        <h4>Chuỗi học của bạn đang là 7 ngày <span className="time">1 giờ trước</span><span className="unread-dot"></span></h4>
                        <p>Hãy tiếp tục duy trì thói quen học tập để trở nên an toàn và mạnh mẽ hơn nhé!</p>
                      </div>
                    </div>
                    <div className="notif-item unread">
                      <div className="notif-icon bg-blue-light" style={{color: '#2563eb'}}>📖</div>
                      <div className="notif-content">
                        <h4>Bài học mới đã mở khóa <span className="time">3 giờ trước</span><span className="unread-dot"></span></h4>
                        <strong>Xử lý khi bị hóc nghẹn</strong>
                        <p>Bạn có thể bắt đầu học ngay bây giờ!</p>
                      </div>
                    </div>
                    <div className="notif-item">
                      <div className="notif-icon bg-yellow-light" style={{color: '#d97706'}}>⭐</div>
                      <div className="notif-content">
                        <h4>+50 XP từ tình huống mô phỏng <span className="time">Hôm qua</span></h4>
                        <p>Bạn đã hoàn thành thành công tình huống "Gọi trợ giúp khi có người bị nạn".</p>
                      </div>
                    </div>
                  </div>
                  <div className="popup-footer bg-blue-light" style={{justifyContent: 'center', flexDirection: 'column'}}>
                    <button className="btn-view-all">Xem tất cả thông báo →</button>
                    <div className="mascot-hint-small">Cùng nhau học tốt hơn mỗi ngày nhé! 🤖❤️</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings */}
            <div className="mimo-icon-wrapper">
              <div 
                className={`mimo-icon-btn ${showSettings ? 'active' : ''}`} 
                onClick={() => {setShowSettings(!showSettings); setShowNotif(false); setShowProfile(false);}}
              >
                ⚙️
              </div>
              {showSettings && (
                <div className="dropdown-popup settings-popup">
                  <div className="popup-header">
                    <h3>⚙️ Cài đặt nhanh</h3>
                  </div>
                  <div className="settings-list">
                    <div className="settings-item">
                      <div className="set-label">🌐 Ngôn ngữ giao diện</div>
                      <div className="set-value">🇻🇳 VN ▾</div>
                    </div>
                    <div className="settings-item">
                      <div className="set-label">🔔 Thông báo học tập</div>
                      <div className="toggle-switch active"></div>
                    </div>
                    <div className="settings-item">
                      <div className="set-label">🔊 Âm thanh</div>
                      <div className="toggle-switch active"></div>
                    </div>
                    <div className="settings-item">
                      <div className="set-label">☀️ Chế độ giao diện</div>
                      <div className="set-value">Sáng ▾</div>
                    </div>
                    <div className="settings-item">
                      <div className="set-label">⏱️ Nhắc học mỗi ngày</div>
                      <div className="set-value">18:00 ▾</div>
                    </div>
                    <div className="settings-divider"></div>
                    <a href="#" className="settings-link">👤 Tài khoản & hồ sơ <span>›</span></a>
                    <a href="#" className="settings-link highlight">👑 Gói đăng ký <span className="badge-new">Mới</span> <span>›</span></a>
                    <a href="#" className="settings-link">🛡️ Bảo mật <span>›</span></a>
                    <a href="#" className="settings-link">♿ Trợ năng <span>›</span></a>
                    <a href="#" className="settings-link">❓ Trợ giúp & hỗ trợ <span>›</span></a>
                  </div>
                  <div className="popup-footer bg-blue-light">
                    <div className="mascot-hint left">Tùy chỉnh Mimo theo cách bạn thích nhé! 🤖</div>
                    <button className="btn-primary-full">Xem tất cả cài đặt →</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile */}
            <div className="mimo-profile-wrapper">
              <div className="mimo-profile" onClick={() => {setShowProfile(!showProfile); setShowNotif(false); setShowSettings(false);}}>
                <div className="mimo-avatar">👦</div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Xin chào,</div>
                  <div style={{ fontWeight: 'bold' }}>Nam ▾</div>
                </div>
              </div>
              {showProfile && (
                <div className="dropdown-popup profile-popup">
                  <div className="profile-header-info">
                    <div className="mimo-avatar large">👦</div>
                    <div className="info">
                      <h3>Nam</h3>
                      <p>Cấp 5 • Người bảo vệ</p>
                      <div className="xp-bar-container">
                        <div className="xp-text"><strong>1.250</strong> / 1.500 XP</div>
                        <div className="progress-track"><div className="progress-fill" style={{width: '83%'}}></div></div>
                        <div className="xp-hint">Còn 250 XP để lên Cấp 6</div>
                      </div>
                    </div>
                  </div>
                  <div className="profile-promo-card">
                    <div className="promo-text">
                      <h4 style={{color: '#d97706'}}>👑 Mimo Free</h4>
                      <p>Mở khóa thêm nhiều trải nghiệm thú vị với Mimo Plus!</p>
                      <button className="btn-upgrade-sm">Nâng cấp Mimo Plus →</button>
                    </div>
                    <div className="promo-mascot">🤖✨<br/><span className="plus-badge">PLUS</span></div>
                  </div>
                  <div className="profile-menu">
                    <a href="#" className="menu-link">👤 Hồ sơ của tôi <span>›</span></a>
                    <a href="#" className="menu-link">🏆 Thành tích <span>›</span></a>
                    <a href="#" className="menu-link">📊 Tiến độ học tập <span>›</span></a>
                    <a href="#" className="menu-link">🔖 Tài liệu yêu thích <span>›</span></a>
                    <a href="#" className="menu-link">⚙️ Cài đặt <span>›</span></a>
                    <a href="#" className="menu-link">❓ Trợ giúp & hỗ trợ <span>›</span></a>
                    <a href="#" className="menu-link logout">🚪 Đăng xuất <span>›</span></a>
                  </div>
                  <div className="popup-footer bg-green-light">
                    <div className="mascot-hint center">
                        Bạn đang tiến bộ mỗi ngày! 🤖❤️
                    </div>
                    <button className="btn-outline-red">Xem hướng dẫn ngay →</button> 
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {activeTab === 'Trang chủ' && renderHomeContent()}
        {activeTab === 'Học tập' && renderLearningContent()}
        {activeTab === 'Nâng cấp' && renderUpgradeContent()}
        {activeTab === 'Thư viện' && renderLibraryContent()}
        {activeTab === 'Bảng xếp hạng' && renderLeaderboardContent()}
        {activeTab === 'Hồ sơ' && renderProfileContent()}
        {activeTab === 'Thành tích' && renderAchievementsContent()}
      </main>

      {/* 3. Right Panel (Hidden on Upgrade Tab) */}
      {activeTab !== 'Nâng cấp' && activeTab !== 'Hồ sơ' && (
        <aside className="mimo-right-panel">
          {activeTab === 'Trang chủ' && renderHomeRightPanel()}
          {activeTab === 'Học tập' && renderLearningRightPanel()}
          {activeTab === 'Thư viện' && renderLibraryRightPanel()}
          {activeTab === 'Bảng xếp hạng' && renderLeaderboardRightPanel()}
          {activeTab === 'Thành tích' && renderAchievementsRightPanel()}
        </aside>
      )}
    </div>
  );
};

export default MimoDashboard;
