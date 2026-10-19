import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function UpgradePlanPage() {
  const navigate = useNavigate();
  // Tab chuyển đổi chính học theo phong cách ChatGPT: 'personal' (Cá nhân) | 'business' (Tổ chức / Doanh nghiệp)
  const [audienceTab, setAudienceTab] = useState('personal');

  // Trạng thái tài khoản người dùng
  const [activePlan, setActivePlan] = useState('FREE'); // 'FREE' | 'PREMIUM_1M' | 'PREMIUM_3M' | 'PREMIUM_6M' | 'B2B_SCHOOL'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form liên hệ tư vấn B2B
  const [showB2BConsultModal, setShowB2BConsultModal] = useState(false);
  const [b2bFormData, setB2bFormData] = useState({
    orgName: '',
    contactName: '',
    phone: '',
    email: '',
    estimatedSeats: '50-200',
    notes: '',
  });
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Đọc trạng thái từ localStorage
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('mimo_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u.role === 'ADMIN_SCHOOL' || u.role === 'ENTERPRISE') {
          setActivePlan('B2B_SCHOOL');
        } else if (u.plan === 'PREMIUM_6M') {
          setActivePlan('PREMIUM_6M');
        } else if (u.plan === 'PREMIUM_3M') {
          setActivePlan('PREMIUM_3M');
        } else if (u.isPlus || u.plan === 'PREMIUM_1M' || u.plan === 'MIMO_PLUS') {
          setActivePlan('PREMIUM_1M');
        } else {
          setActivePlan('FREE');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 1. CÁC GÓI CÁ NHÂN (CHUẨN 100% THEO FILE TASK_MIMO.DOCX & FIGMA 18)
  const personalPlans = [
    {
      id: 'FREE',
      name: 'Mimo Free',
      shortDuration: 'Miễn phí',
      price: 0,
      priceDisplay: '0 đ',
      periodText: 'Mãi mãi',
      badge: 'Cơ bản',
      badgeColor: '#475569',
      badgeBg: '#F1F5F9',
      isPopular: false,
      tagline: 'Làm quen nền tảng mô phỏng',
      targetDescription: 'Bắt đầu hành trình rèn luyện kỹ năng cơ bản không mất phí.',
      features: [
        'Bài học kỹ năng sống cơ bản',
        '4 chủ đề thiết yếu (PCCC, sơ cứu, giao thông, scam)',
        'Giới hạn 5 tim (Hồi 1 tim/4 giờ)',
        '3 lượt phân tích và tư vấn AI/ngày',
        'Tích lũy XP, chuỗi Streak và huy hiệu',
      ],
      ctaText: 'Gói hiện tại',
      btnBg: '#F1F5F9',
      btnColor: '#64748B',
      isCurrent: activePlan === 'FREE',
    },
    {
      id: 'PREMIUM_1M',
      code: 'MIMO_PREMIUM_1M',
      name: 'Gói 1 Tháng (Monthly)',
      shortDuration: '1 Tháng',
      price: 79000,
      priceDisplay: '79.000 đ',
      periodText: '/ tháng',
      badge: 'Linh Hoạt Trải Nghiệm',
      badgeColor: '#0284C7',
      badgeBg: '#E0F2FE',
      isPopular: false,
      tagline: 'Linh hoạt cho phụ huynh muốn trải nghiệm.',
      targetDescription:
        'Gói dễ tiếp cận nhất, hướng đến phụ huynh mới muốn cho con dùng thử Premium mà không cần cam kết lâu dài.',
      features: [
        'Toàn bộ tình huống mô phỏng an toàn & PCCC',
        '❤️ Vô hạn trái tim, học liên tục không gián đoạn',
        '🤖 Trợ lý Bác sĩ / AI phân tích chuyên sâu từng giây',
        'Thư viện cẩm nang kỹ năng số chuẩn hóa',
        '🚫 Trải nghiệm hoàn toàn không quảng cáo',
      ],
      ctaText: 'Đăng Ký Gói 1 Tháng →',
      btnBg: 'linear-gradient(135deg, #0284C7, #0369A1)',
      btnColor: '#FFFFFF',
      isCurrent: activePlan === 'PREMIUM_1M',
    },
    {
      id: 'PREMIUM_3M',
      code: 'MIMO_PREMIUM_3M',
      name: 'Gói 3 Tháng (Quarterly)',
      shortDuration: '3 Tháng (Theo Quý)',
      price: 219000,
      priceDisplay: '219.000 đ',
      periodText: '/ 3 tháng',
      badge: '⭐ GÓI CHỦ LỰC • KHUYÊN DÙNG',
      badgeColor: '#FFFFFF',
      badgeBg: '#0284C7',
      isPopular: true,
      tagline: 'Tiết kiệm 18.000đ so với trả từng tháng.',
      targetDescription:
        'Gói chủ lực (Most Popular), hướng đến phụ huynh đã trải nghiệm Free và muốn cho trẻ học liên tục theo quý để hình thành phản xạ an toàn.',
      features: [
        'Toàn bộ đặc quyền của Gói 1 Tháng',
        'Chỉ ~73.000 đ/tháng (Tiết kiệm 18.000 đ)',
        '🛡️ Bùa tự động bảo vệ chuỗi Streak học tập',
        '📊 Báo cáo tiến độ học tập gửi riêng cho Phụ huynh',
        'Mô phỏng 3D tương tác đa góc nhìn thực tế',
        'Huy hiệu Học viên Tiên phong độc quyền',
      ],
      ctaText: 'Chọn Gói 3 Tháng (Khuyên Dùng) →',
      btnBg: 'linear-gradient(135deg, #0284C7, #2563EB)',
      btnColor: '#FFFFFF',
      isCurrent: activePlan === 'PREMIUM_3M',
    },
    {
      id: 'PREMIUM_6M',
      code: 'MIMO_PREMIUM_6M',
      name: 'Gói 6 Tháng (Half-Year)',
      shortDuration: '6 Tháng (Học kỳ)',
      price: 399000,
      priceDisplay: '399.000 đ',
      periodText: '/ 6 tháng',
      badge: '💎 TIẾT KIỆM TỐI ĐA',
      badgeColor: '#FFFFFF',
      badgeBg: '#7C3AED',
      isPopular: false,
      tagline: 'Tiết kiệm 75.000đ so với trả từng tháng.',
      targetDescription:
        'Gói dành cho phụ huynh đã tin tưởng Mimo, đồng hành lâu dài trọn vẹn cả học kỳ cùng sự an toàn và phát triển của con.',
      features: [
        'Toàn bộ đặc quyền của Gói 3 Tháng',
        'Chỉ ~66.500 đ/tháng (Tiết kiệm 75.000 đ)',
        '🎖️ Chứng chỉ số kiểm định kỹ năng kèm mã QR định danh',
        '👨‍👩‍👧 Kết nối tài khoản phụ huynh & con cái đồng bộ',
        'Hỗ trợ ưu tiên 1:1 từ chuyên gia giáo dục an toàn Mimo',
      ],
      ctaText: 'Chọn Gói 6 Tháng (Tiết Kiệm Nhất) →',
      btnBg: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      btnColor: '#FFFFFF',
      isCurrent: activePlan === 'PREMIUM_6M',
    },
  ];

  // 2. CÁC GÓI TỔ CHỨC / DOANH NGHIỆP & TRƯỜNG HỌC (B2B SAAS THEO CHUẨN TASK_MIMO & MOCKADMIN)
  const businessPlans = [
    {
      id: 'B2B_CLASSROOM',
      name: 'Gói Lớp Học / Câu Lạc Bộ (Team)',
      shortDuration: '1 Lớp (Tối đa 45 HS)',
      price: 1490000,
      priceDisplay: '1.490.000 đ',
      periodText: '/ lớp / học kỳ',
      badge: 'Dành Cho Giáo Viên & Lớp',
      badgeColor: '#0D9488',
      badgeBg: '#CCFBF1',
      isPopular: false,
      tagline: 'Chỉ ~33.000 đ / học sinh / kỳ',
      targetDescription:
        'Phù hợp cho Giáo viên chủ nhiệm, Giáo viên Kỹ năng sống muốn điều phối đào tạo và tổ chức thi đấu an toàn cho 1 lớp học.',
      features: [
        'Cấp tài khoản cho 1 Giáo viên & tối đa 45 Học sinh',
        '🎮 Đấu Trường Live Quiz trực tiếp trên lớp (mã PIN 6 số)',
        'Bảng Vàng xếp hạng và thi đua trong nội bộ lớp',
        'Giáo viên giao bài tập tình huống thực hành về nhà',
        'Báo cáo tỷ lệ hoàn thành gửi Ban Phụ huynh lớp',
      ],
      ctaText: 'Đăng Ký Gói Lớp Học →',
      btnBg: 'linear-gradient(135deg, #0D9488, #0F766E)',
      btnColor: '#FFFFFF',
      type: 'PAYMENT',
    },
    {
      id: 'B2B_SCHOOL',
      name: 'MIMO School Chuẩn Hóa (Phổ Biến)',
      shortDuration: 'Toàn Trường (15+ Lớp)',
      price: 25000,
      priceDisplay: '25.000 đ',
      periodText: '/ học sinh / tháng',
      badge: '⭐ GIẢI PHÁP TRƯỜNG HỌC • CHỦ LỰC',
      badgeColor: '#FFFFFF',
      badgeBg: '#2563EB',
      isPopular: true,
      tagline: 'Hợp đồng Niên khóa (Gói 50 - 500 suất)',
      targetDescription:
        'Mô hình chuẩn triển khai tại THPT FPT Cần Thơ: Quản trị đồng bộ Khối 10, Khối 11, Khối 12 với 15 lớp học và mã giáo viên linh hoạt.',
      features: [
        '🏢 Cổng Quản Trị Trường Học B2B Dashboard (/business)',
        '🔑 Hệ thống sinh Mã Bản Quyền Giáo Viên (Teacher License)',
        '🚩 Bản đồ Lỗ Hổng Kỹ Năng PCCC (Red Flags Detection)',
        '🎖️ Cấp Chứng chỉ Kiểm định An toàn PCCC có QR định danh',
        'Rung chuông nhắc nhở chiến dịch đào tạo bắt buộc',
        'Hỗ trợ hội thảo tập huấn cán bộ giáo viên nhà trường',
      ],
      ctaText: 'Vào Cổng Quản Trị Trường Học (/business) →',
      btnBg: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
      btnColor: '#FFFFFF',
      type: 'NAVIGATE_BUSINESS',
    },
    {
      id: 'B2B_ENTERPRISE',
      name: 'Doanh Nghiệp & Tòa Nhà (Custom)',
      shortDuration: 'Tùy Biến Quy Mô',
      price: 0,
      priceDisplay: 'Liên hệ',
      periodText: 'báo giá theo nhu cầu',
      badge: 'Doanh Nghiệp & Nhà Máy',
      badgeColor: '#6D28D9',
      badgeBg: '#EDE9FE',
      isPopular: false,
      tagline: 'Đào tạo an toàn lao động & PCCC định kỳ',
      targetDescription:
        'Dành cho tập đoàn, nhà máy sản xuất, trung tâm thương mại và tòa nhà văn phòng cần chuẩn hóa chứng nhận an toàn định kỳ.',
      features: [
        'Tùy biến kịch bản rủi ro theo đặc thù ngành nghề',
        'Tích hợp hệ thống LMS nội bộ (SSO, SCORM / xAPI)',
        'Xuất hóa đơn GTGT (VAT) & Biên bản nghiệm thu kiểm định',
        'Báo cáo thẩm duyệt gửi Cơ quan Cảnh sát PCCC & CNCH',
        'Cam kết chất lượng dịch vụ (SLA) 99.9% có chuyên gia phụ trách',
      ],
      ctaText: 'Yêu Cầu Báo Giá & Hợp Đồng B2B →',
      btnBg: 'linear-gradient(135deg, #475569, #1E293B)',
      btnColor: '#FFFFFF',
      type: 'CONSULT',
    },
  ];

  const handleOpenPayment = (plan) => {
    sound.playClick();
    if (plan.type === 'NAVIGATE_BUSINESS') {
      navigate('/business');
      return;
    }
    if (plan.type === 'CONSULT') {
      setShowB2BConsultModal(true);
      setConsultSubmitted(false);
      return;
    }
    setSelectedPlanDetails(plan);
    setShowPaymentModal(true);
    setPaymentSuccess(false);
  };

  const handleConfirmMockPayment = () => {
    setIsProcessing(true);
    sound.playClick();
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      sound.playVictory();
      fireConfetti();

      // Cập nhật trạng thái người dùng trong localStorage
      try {
        const rawUser = localStorage.getItem('mimo_user');
        const userObj = rawUser ? JSON.parse(rawUser) : { name: 'Học viên MIMO' };
        userObj.isPlus = true;
        userObj.plan = selectedPlanDetails.id;
        userObj.planName = selectedPlanDetails.name;
        localStorage.setItem('mimo_user', JSON.stringify(userObj));
        setActivePlan(selectedPlanDetails.id);
      } catch (err) {
        console.error(err);
      }
    }, 1500);
  };

  const handleB2BConsultSubmit = (e) => {
    e.preventDefault();
    sound.playVictory();
    fireConfetti();
    setConsultSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      {/* TIÊU ĐỀ GỌN GÀNG CHUẨN PHONG CÁCH CHATGPT PRICING */}
      <div style={{ textAlign: 'center', marginBottom: '4px', paddingTop: '6px' }}>
        <h1
          style={{
            fontSize: '30px',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.5px',
            margin: '0 0 6px 0',
          }}
        >
          Nâng cấp gói tài khoản MIMO 👑
        </h1>
        <p style={{ color: '#64748B', fontSize: '15px', margin: 0, fontWeight: 600 }}>
          Trang bị kỹ năng sống, phản xạ thoát hiểm và sơ cấp cứu thực tế cho cá nhân, gia đình và trường học.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. BỘ CHUYỂN ĐỔI CHÍNH PHONG CÁCH CHATGPT: CÁ NHÂN VS DOANH NGHIỆP/TỔ CHỨC */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#F1F5F9',
            padding: '5px',
            borderRadius: '999px',
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          {/* TAB 1: CÁ NHÂN (PERSONAL) */}
          <button
            onClick={() => {
              sound.playClick();
              setAudienceTab('personal');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 28px',
              borderRadius: '999px',
              border: 'none',
              background: audienceTab === 'personal' ? '#0F172A' : 'transparent',
              color: audienceTab === 'personal' ? '#FFFFFF' : '#475569',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: audienceTab === 'personal' ? '0 4px 12px rgba(15, 23, 42, 0.25)' : 'none',
            }}
          >
            <span>👤</span>
            <span>Cá Nhân (Học Viên & Gia Đình)</span>
          </button>

          {/* TAB 2: TỔ CHỨC / DOANH NGHIỆP (BUSINESS) */}
          <button
            onClick={() => {
              sound.playClick();
              setAudienceTab('business');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 28px',
              borderRadius: '999px',
              border: 'none',
              background: audienceTab === 'business' ? '#0F172A' : 'transparent',
              color: audienceTab === 'business' ? '#FFFFFF' : '#475569',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: audienceTab === 'business' ? '0 4px 12px rgba(15, 23, 42, 0.25)' : 'none',
            }}
          >
            <span>🏢</span>
            <span>Tổ Chức / Trường Học & Doanh Nghiệp</span>
            <span
              style={{
                fontSize: '10.5px',
                background: audienceTab === 'business' ? '#38BDF8' : '#DCFCE7',
                color: audienceTab === 'business' ? '#0F172A' : '#15803D',
                padding: '2px 7px',
                borderRadius: '6px',
                fontWeight: 900,
              }}
            >
              B2B
            </span>
          </button>
        </div>

        <p style={{ color: '#64748B', fontSize: '14px', margin: 0, fontWeight: 600 }}>
          {audienceTab === 'personal'
            ? 'Dành cho học sinh tự học, rèn luyện phản xạ sinh tồn và phụ huynh đồng hành theo dõi.'
            : 'Dành cho Trường học, Thầy cô quản lý lớp học và Doanh nghiệp cần chứng chỉ an toàn PCCC.'}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3.1. NỘI DUNG KHI CHỌN TAB "CÁ NHÂN" (PERSONAL - 4 CỘT CHUẨN TASK_MIMO) */}
      {/* ========================================================================= */}
      {audienceTab === 'personal' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              alignItems: 'stretch',
            }}
          >
            {personalPlans.map((p) => (
              <div
                key={p.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  border: p.isPopular ? '2.5px solid #0284C7' : '2px solid #E2E8F0',
                  padding: '26px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: p.isPopular
                    ? '0 16px 36px rgba(2, 132, 199, 0.16)'
                    : '0 4px 16px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  transform: p.isPopular ? 'scale(1.02)' : 'none',
                  zIndex: p.isPopular ? 3 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* HUY HIỆU */}
                {p.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: p.badgeBg,
                      color: p.badgeColor,
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '4px 14px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      boxShadow: p.isPopular ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none',
                    }}
                  >
                    {p.badge}
                  </div>
                )}

                <div>
                  <div style={{ marginBottom: '14px', marginTop: p.badge ? '4px' : '0' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      {p.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                      {p.shortDuration}
                    </div>
                  </div>

                  {/* GIÁ TIỀN */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A' }}>
                      {p.priceDisplay}
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 700 }}>
                      {p.periodText}
                    </span>
                  </div>

                  {/* TAGLINE */}
                  <div
                    style={{
                      fontSize: '11.5px',
                      color: p.isPopular ? '#0284C7' : '#15803D',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}
                  >
                    {p.tagline}
                  </div>

                  {/* ĐẶC QUYỀN */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                    {p.features.map((feat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontSize: '12.5px',
                          color: '#1E293B',
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{ color: '#16A34A', fontWeight: 900 }}>✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NÚT BẤM */}
                <div style={{ marginTop: '24px' }}>
                  {p.isCurrent ? (
                    <div
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '14px',
                        background: '#DCFCE7',
                        color: '#15803D',
                        fontWeight: 900,
                        fontSize: '13.5px',
                        textAlign: 'center',
                        border: '2px solid #86EFAC',
                      }}
                    >
                      ✨ Đang hoạt động
                    </div>
                  ) : p.price === 0 ? (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '14px',
                        border: 'none',
                        background: '#F1F5F9',
                        color: '#94A3B8',
                        fontWeight: 800,
                        fontSize: '13.5px',
                        cursor: 'not-allowed',
                      }}
                    >
                      Gói mặc định
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenPayment(p)}
                      style={{
                        width: '100%',
                        padding: '13px',
                        borderRadius: '14px',
                        border: 'none',
                        background: p.btnBg,
                        color: p.btnColor,
                        fontWeight: 900,
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        boxShadow: p.isPopular ? '0 6px 16px rgba(2, 132, 199, 0.35)' : 'none',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      {p.ctaText}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3.2. NỘI DUNG KHI CHỌN TAB "TỔ CHỨC / DOANH NGHIỆP" (BUSINESS / SCHOOL B2B) */}
      {/* ========================================================================= */}
      {audienceTab === 'business' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              alignItems: 'stretch',
            }}
          >
            {businessPlans.map((bp) => (
              <div
                key={bp.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '26px',
                  border: bp.isPopular ? '2.5px solid #2563EB' : '2px solid #E2E8F0',
                  padding: '30px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: bp.isPopular
                    ? '0 16px 36px rgba(37, 99, 235, 0.16)'
                    : '0 4px 16px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  transform: bp.isPopular ? 'scale(1.02)' : 'none',
                  zIndex: bp.isPopular ? 3 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                {bp.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: bp.badgeBg,
                      color: bp.badgeColor,
                      fontSize: '11.5px',
                      fontWeight: 900,
                      padding: '4px 16px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      boxShadow: bp.isPopular ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none',
                    }}
                  >
                    {bp.badge}
                  </div>
                )}

                <div>
                  <div style={{ marginBottom: '14px', marginTop: bp.badge ? '4px' : '0' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      {bp.name}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, marginTop: '3px' }}>
                      {bp.shortDuration}
                    </div>
                  </div>

                  {/* GIÁ B2B */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A' }}>
                      {bp.priceDisplay}
                    </span>
                    <span style={{ fontSize: '13.5px', color: '#64748B', fontWeight: 700 }}>
                      {bp.periodText}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '12.5px',
                      color: '#2563EB',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}
                  >
                    {bp.tagline}
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#475569',
                      lineHeight: 1.45,
                      margin: '0 0 16px 0',
                      background: '#F8FAFC',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      borderLeft: `3px solid ${bp.isPopular ? '#2563EB' : '#94A3B8'}`,
                    }}
                  >
                    {bp.targetDescription}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginTop: '14px' }}>
                    {bp.features.map((feat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '13.5px',
                          color: '#1E293B',
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{ color: '#2563EB', fontWeight: 900 }}>✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '28px' }}>
                  <button
                    onClick={() => handleOpenPayment(bp)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '16px',
                      border: 'none',
                      background: bp.btnBg,
                      color: bp.btnColor,
                      fontWeight: 900,
                      fontSize: '14.5px',
                      cursor: 'pointer',
                      boxShadow: bp.isPopular ? '0 8px 20px rgba(37, 99, 235, 0.35)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {bp.ctaText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BANNER ĐẶC THÙ NHÀ TRƯỜNG & DOANH NGHIỆP */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A, #1E293B)',
              borderRadius: '24px',
              padding: '28px 32px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '24px' }}>🏛️</span>
                <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>
                  Bạn đã có tài khoản Quản trị Trường học / Doanh nghiệp?
                </h3>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
                Đăng nhập trực tiếp vào hệ thống B2B SaaS để quản lý 15 lớp học, theo dõi chiến dịch đào tạo, sinh mã giáo viên và tải báo cáo kiểm định tuân thủ PCCC.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                navigate('/business');
              }}
              style={{
                padding: '14px 26px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #38BDF8, #0284C7)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(56, 189, 248, 0.35)',
                whiteSpace: 'nowrap',
              }}
            >
              Truy Cập Cổng B2B (/business) →
            </button>
          </div>
        </>
      )}

      {/* 4. CAM KẾT VÀ TÍN NHIỆM CHÂN TRANG */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '36px',
          padding: '16px 0',
          borderTop: '1px solid #E2E8F0',
          color: '#64748B',
          fontSize: '14px',
          fontWeight: 700,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🛡️</span>
          <span>Thanh toán VietQR Napas 24/7 an toàn</span>
        </div>
        <span>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔒</span>
          <span>Hỗ trợ hủy và linh hoạt theo từng chu kỳ</span>
        </div>
        <span>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💙</span>
          <span>Được hơn 500+ phụ huynh và trường học tin cậy</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL THANH TOÁN VIETQR PAYOS (CHO CẢ CÁ NHÂN & LỚP HỌC) */}
      {/* ========================================================================= */}
      {showPaymentModal && selectedPlanDetails && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '26px',
              maxWidth: '520px',
              width: '100%',
              padding: '30px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                border: 'none',
                background: '#F1F5F9',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 900,
                color: '#64748B',
              }}
            >
              ✕
            </button>

            {!paymentSuccess ? (
              <>
                <div style={{ fontSize: '42px', marginBottom: '8px' }}>👑</div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
                  Nâng Cấp {selectedPlanDetails.name}
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 18px 0' }}>
                  {selectedPlanDetails.targetDescription}
                </p>

                <div
                  style={{
                    background: '#F8FAFC',
                    border: '2px dashed #CBD5E1',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '12px',
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      marginBottom: '12px',
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=2|99|0987654321|MIMO%20APP|mimo@fpt.edu.vn|0|0|${selectedPlanDetails.price}|MIMO%20${selectedPlanDetails.id}%20UPGRADE`}
                      alt="VietQR Code"
                      style={{ width: '180px', height: '180px', display: 'block' }}
                    />
                  </div>

                  <div style={{ fontSize: '13.5px', color: '#64748B' }}>
                    Số tiền thanh toán:{' '}
                    <strong style={{ fontSize: '20px', color: '#0F172A' }}>
                      {selectedPlanDetails.price.toLocaleString('vi-VN')} đ
                    </strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 700, marginTop: '4px' }}>
                    Cổng thanh toán: PayOS / VietQR Napas 24/7 ({selectedPlanDetails.shortDuration})
                  </div>
                </div>

                <button
                  onClick={handleConfirmMockPayment}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '16px',
                    border: 'none',
                    background: isProcessing
                      ? '#94A3B8'
                      : 'linear-gradient(135deg, #22C55E, #16A34A)',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: isProcessing ? 'wait' : 'pointer',
                    boxShadow: '0 6px 16px rgba(34, 197, 94, 0.3)',
                    transition: 'all 0.15s',
                  }}
                >
                  {isProcessing
                    ? '⏳ Đang xác thực giao dịch PayOS...'
                    : `⚡ Giả Lập Quét Mã & Thanh Toán (${selectedPlanDetails.price.toLocaleString('vi-VN')} đ)`}
                </button>
              </>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#16A34A', margin: '0 0 8px 0' }}>
                  Kích Hoạt Thành Công!
                </h3>
                <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                  Chúc mừng bạn đã gia nhập <strong>{selectedPlanDetails.name}</strong>! Toàn bộ quyền lợi bản quyền đã được cấp cho tài khoản của bạn.
                </p>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    navigate('/learn');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    border: 'none',
                    background: '#0284C7',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  Bắt đầu học ngay với đặc quyền mới →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL ĐĂNG KÝ TƯ VẤN B2B DOANH NGHIỆP / TRƯỜNG HỌC */}
      {/* ========================================================================= */}
      {showB2BConsultModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={() => setShowB2BConsultModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '26px',
              maxWidth: '560px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowB2BConsultModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                border: 'none',
                background: '#F1F5F9',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 900,
                color: '#64748B',
              }}
            >
              ✕
            </button>

            {!consultSubmitted ? (
              <form onSubmit={handleB2BConsultSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '38px' }}>🏢</span>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '6px 0 4px 0' }}>
                    Yêu Cầu Báo Giá & Tư Vấn B2B
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '13.5px', margin: 0 }}>
                    Chuyên viên giải pháp giáo dục an toàn MIMO sẽ liên hệ và gửi bản demo trong 2 giờ làm việc.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Tên Trường Học / Doanh Nghiệp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: THPT Chu Văn An / Công ty CP Công Nghệ..."
                    value={b2bFormData.orgName}
                    onChange={(e) => setB2bFormData({ ...b2bFormData, orgName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Người liên hệ *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Thầy/Cô/Anh/Chị..."
                      value={b2bFormData.contactName}
                      onChange={(e) => setB2bFormData({ ...b2bFormData, contactName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0987 654 321"
                      value={b2bFormData.phone}
                      onChange={(e) => setB2bFormData({ ...b2bFormData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Email công vụ *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="bgh@truong.edu.vn"
                      value={b2bFormData.email}
                      onChange={(e) => setB2bFormData({ ...b2bFormData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Số lượng suất học dự kiến
                    </label>
                    <select
                      value={b2bFormData.estimatedSeats}
                      onChange={(e) => setB2bFormData({ ...b2bFormData, estimatedSeats: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14px',
                        background: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="1-45">1 Lớp học (15 - 45 học sinh)</option>
                      <option value="50-200">1 Khối lớp (50 - 200 học sinh)</option>
                      <option value="200-500">Toàn trường (200 - 500 học sinh)</option>
                      <option value="500+">Quy mô lớn (&gt; 500 học sinh / Nhân sự)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284C7, #2563EB)',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(2, 132, 199, 0.35)',
                  }}
                >
                  Gửi Yêu Cầu Tư Vấn & Nhận Báo Giá →
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '56px' }}>🎉</span>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#16A34A', margin: '10px 0 8px 0' }}>
                  Gửi Yêu Cầu Thành Công!
                </h3>
                <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                  Cảm ơn <strong>{b2bFormData.orgName}</strong> đã quan tâm đến giải pháp MIMO School / Enterprise. Chuyên viên của chúng tôi sẽ gọi điện qua số <strong>{b2bFormData.phone}</strong> trong ít phút!
                </p>
                <button
                  onClick={() => setShowB2BConsultModal(false)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '14px',
                    border: 'none',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Đóng cửa sổ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
