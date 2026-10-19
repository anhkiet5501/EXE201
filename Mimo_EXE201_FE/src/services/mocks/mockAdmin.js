/**
 * mockAdmin.js: Dữ liệu mẫu toàn diện cho Phân hệ Quản trị & Vận hành (Admin & Operations)
 * Tuân thủ đặc tả: Dac_Ta_Chi_Tiet_Phan_He_Admin_Operations.md
 * Có hỗ trợ localStorage persistence để tương tác mượt mà trong chế độ Demo EXE201.
 */

const STORAGE_KEYS = {
  METRICS: 'mimo_admin_metrics',
  SKILL_GAPS: 'mimo_admin_skill_gaps',
  REVIEWS: 'mimo_admin_reviews',
  CURATORS: 'mimo_admin_curators',
  SETTINGS: 'mimo_admin_gamification_settings',
  USERS: 'mimo_admin_users',
  SCHOOLS: 'mimo_admin_schools',
  FEEDBACKS: 'mimo_admin_feedbacks',
  MONETIZATION: 'mimo_admin_monetization',
};

// 1. CHỈ SỐ SỐNG CÒN (NORTH STAR METRICS)
const initialMetrics = {
  totalUsers: 14850,
  dau: 3820,
  mau: 18600,
  stickiness: 20.5, // DAU / MAU (%)
  dauGrowth: '+14.2%',
  d7Retention: 42.8, // %
  d30Retention: 21.4, // %
  livesSaved: 154920, // Số nạn nhân giả lập cứu sống
  mrr: 89500000, // VNĐ/tháng
  mrrGrowth: '+18.5%',
  coursesPublished: 52,
  pendingApprovals: 4,
  unresolvedTickets: 5,
};

// 2. BẢN ĐỒ NHIỆT VÙNG MÙ KIẾN THỨC (SAFETY SKILL GAP HEATMAP)
const initialSkillGaps = [
  {
    id: 'gap_burn',
    topic: 'Sơ cứu bỏng nước sôi & hóa chất sinh hoạt',
    category: 'Sơ cấp cứu',
    correctRate: 31,
    wrongRate: 69,
    riskLevel: 'HIGH', // HIGH (Đỏ) | MEDIUM (Cam) | LOW (Vàng) | SAFE (Xanh)
    criticalFlaw: '69% học sinh chọn bôi kem đánh răng hoặc mỡ trăn vào vết bỏng thay vì xả nước mát.',
    correctProtocol: 'Xả vết bỏng dưới vòi nước mát sạch từ 15-20 phút, tuyệt đối không bôi dị vật.',
    totalTests: 4280,
    recommendedAction: 'Đẩy thông báo cảnh báo khẩn cấp và bổ sung 1 buổi ôn tập ưu tiên.',
  },
  {
    id: 'gap_heimlich',
    topic: 'Sơ cứu hóc dị vật đường thở (Thủ thuật Heimlich)',
    category: 'Sơ cấp cứu',
    correctRate: 52,
    wrongRate: 48,
    riskLevel: 'MEDIUM',
    criticalFlaw: '48% người học đặt vị trí nắm tay sai (ấn quá thấp dưới rốn hoặc ấn vào xương ức).',
    correctProtocol: 'Đặt nắm đấm trên rốn 2 khoát ngón tay, giật dứt khoát hướng vào trong và lên trên.',
    totalTests: 3650,
    recommendedAction: 'Bổ sung video hoạt họa 3D zoom cận cảnh vị trí đặt tay chuẩn.',
  },
  {
    id: 'gap_phishing',
    topic: 'Nhận diện link lừa đảo học bổng & Deepfake cuộc gọi video',
    category: 'An toàn không gian mạng',
    correctRate: 74,
    wrongRate: 26,
    riskLevel: 'LOW',
    criticalFlaw: '26% học sinh vẫn nhấp link rút gọn bit.ly hoặc nhập OTP khi thấy mặt người thân trên video.',
    correctProtocol: 'Gọi lại qua mạng viễn thông truyền thống để xác thực câu hỏi riêng tư.',
    totalTests: 5120,
    recommendedAction: 'Cập nhật thêm các tình huống voice clone giọng nói mới nhất của năm 2026.',
  },
  {
    id: 'gap_gas',
    topic: 'Xử lý rò rỉ khí gas & chập điện cháy phòng kín',
    category: 'PCCC & Thoát hiểm',
    correctRate: 88,
    wrongRate: 12,
    riskLevel: 'SAFE',
    criticalFlaw: '12% học sinh còn bối rối giữa bình chữa cháy CO2 và bình bột chữa cháy.',
    correctProtocol: 'Ngắt cầu dao điện tổng, mở toang cửa sổ, không bật tắt bất kỳ công tắc nào.',
    totalTests: 6890,
    recommendedAction: 'Duy trì tần suất kiểm tra định kỳ trong các giải đấu tuần.',
  },
];

// 3. HÀNG CHỜ PHÊ DUYỆT BÀI HỌC TỪ CURATOR (CONTENT APPROVAL QUEUE)
const initialPendingReviews = [
  {
    id: 'rev_101',
    lessonTitle: 'Thoát hiểm khẩn cấp khi cháy chung cư cao tầng',
    category: 'PCCC & Khói Độc',
    curatorName: 'Đ/c Lê Tuấn',
    curatorRole: 'Cán bộ Cục Cảnh sát PCCC',
    curatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LeTuan',
    submittedAt: '2026-10-18 14:30',
    questionsCount: 6,
    estimatedMinutes: 4,
    status: 'PENDING', // PENDING | APPROVED | REJECTED
    xpReward: 35,
    scenarioCover: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    summary: 'Kịch bản thực tế khi chuông báo cháy reo lúc nửa đêm: Cách dùng khăn ướt bịt mũi, bò sát sàn tránh ngạt khói độc CO, kiểm tra tay nắm cửa trước khi mở.',
    questions: [
      {
        id: 'q1',
        prompt: 'Khi chuông báo cháy chung cư reo lúc nửa đêm, mở cửa phòng ngủ bạn thấy khói đen mịt mù ở hành lang. Hành động đầu tiên là gì?',
        options: [
          'Chạy ngay ra thang máy để xuống tầng 1 nhanh nhất',
          'Dùng khăn nhúng ướt bịt kín mũi miệng, hạ thấp người bò men theo tường',
          'Đứng thẳng hô hoán thật to để mọi người cùng chạy',
          'Quay lại thu dọn laptop và giấy tờ quan trọng',
        ],
        correctIndex: 1,
        explanation: 'Khói độc và nhiệt tích tụ ở trần nhà. Không khí sạch nằm ở 30-50cm sát sàn. Thang máy có thể mất điện và trở thành bẫy tử thần!',
      },
      {
        id: 'q2',
        prompt: 'Trước khi mở cánh cửa thông ra lối thoát hiểm, bạn cần kiểm tra điều gì?',
        options: [
          'Nhìn qua khe khóa xem có lửa không',
          'Dùng mu bàn tay sờ nhẹ vào tay nắm cửa và bề mặt cửa',
          'Đạp mạnh cửa để xông ra dứt khoát',
          'Áp tai vào sát cửa để nghe tiếng nổ',
        ],
        correctIndex: 1,
        explanation: 'Dùng mu bàn tay (không dùng lòng bàn tay vì nếu tay nắm nóng bỏng sẽ gây co quắp dính chặt). Nếu tay nắm nóng, tuyệt đối KHÔNG mở cửa!',
      },
    ],
  },
  {
    id: 'rev_102',
    lessonTitle: 'Hồi sức ngưng tim CPR kết hợp máy khử rung tim tự động AED',
    category: 'Sơ cấp cứu Y tế',
    curatorName: 'BS. Hoàng Nam',
    curatorRole: 'Bác sĩ Cấp cứu BV Chợ Rẫy',
    curatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=HoangNam',
    submittedAt: '2026-10-17 09:15',
    questionsCount: 8,
    estimatedMinutes: 6,
    status: 'PENDING',
    xpReward: 40,
    scenarioCover: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
    summary: 'Quy trình chuẩn CAB (Compressions - Airway - Breathing) mới nhất: 30 lần ép tim, 2 lần thổi ngạt, tốc độ 100-120 lần/phút, cách dán 2 bản cực máy AED.',
    questions: [
      {
        id: 'q1',
        prompt: 'Tần số ép tim ngoài lồng ngực chuẩn cho nạn nhân ngưng tuần hoàn người lớn là bao nhiêu?',
        options: [
          '60 - 80 lần / phút',
          '80 - 100 lần / phút',
          '100 - 120 lần / phút (theo nhịp bài hát Stayin Alive)',
          'Càng nhanh càng tốt, trên 150 lần / phút',
        ],
        correctIndex: 2,
        explanation: 'Chuẩn quốc tế AHA là 100 - 120 lần/phút, độ sâu 5 - 6 cm, để lồng ngực nở lại hoàn toàn sau mỗi lần ép.',
      },
    ],
  },
  {
    id: 'rev_103',
    lessonTitle: 'Nhận diện cuộc gọi video Deepfake tống tiền & giả danh công an',
    category: 'An toàn không gian mạng',
    curatorName: 'KS. Minh Anh',
    curatorRole: 'Chuyên gia An ninh mạng VNCERT',
    curatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MinhAnh',
    submittedAt: '2026-10-16 18:20',
    questionsCount: 5,
    estimatedMinutes: 3,
    status: 'APPROVED',
    xpReward: 25,
    scenarioCover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    summary: 'Nhận diện các dấu hiệu giật lag, cử động chớp mắt bất thường, không đồng bộ khẩu hình và quy tắc xác minh danh tính 3 bước.',
    questions: [],
  },
  {
    id: 'rev_104',
    lessonTitle: 'Kỹ năng tự vệ khi gặp đối tượng bạo lực & bắt cóc học đường',
    category: 'Kỹ năng tự vệ sinh tồn',
    curatorName: 'ThS. Ngọc Lan',
    curatorRole: 'Giảng viên Kỹ năng sống & Tâm lý',
    curatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NgocLan',
    submittedAt: '2026-10-15 11:00',
    questionsCount: 7,
    estimatedMinutes: 5,
    status: 'PENDING',
    xpReward: 30,
    scenarioCover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    summary: 'Thoát khỏi tư thế nắm cổ tay, tư thế bẻ khóa ngón tay cái, cách hô hoán kích hoạt sự chú ý của người xung quanh.',
    questions: [],
  },
];

// 4. DANH SÁCH CHUYÊN GIA CURATOR ĐƯỢC CẤP PHÉP
const initialCurators = [
  {
    id: 'cur_1',
    name: 'BS. Hoàng Nam',
    email: 'nam.hoang@choray.hospital.vn',
    specialty: 'Sơ cấp cứu & Chấn thương học',
    domain: 'HEALTH_FIRSTAID',
    approvedCourses: 12,
    rating: 4.9,
    status: 'ACTIVE',
  },
  {
    id: 'cur_2',
    name: 'Đ/c Lê Tuấn',
    email: 'tuan.le@pccc.gov.vn',
    specialty: 'PCCC, Thoát hiểm & Cứu nạn cứu hộ',
    domain: 'FIRE_SAFETY',
    approvedCourses: 15,
    rating: 5.0,
    status: 'ACTIVE',
  },
  {
    id: 'cur_3',
    name: 'KS. Minh Anh',
    email: 'minhanh@security.vncert.vn',
    specialty: 'An toàn thông tin & Phòng chống lừa đảo số',
    domain: 'CYBER_SAFETY',
    approvedCourses: 9,
    rating: 4.8,
    status: 'ACTIVE',
  },
  {
    id: 'cur_4',
    name: 'ThS. Ngọc Lan',
    email: 'ngoclan.edu@gmail.com',
    specialty: 'Tâm lý lứa tuổi & Phòng chống bạo lực',
    domain: 'SELF_DEFENSE',
    approvedCourses: 14,
    rating: 4.9,
    status: 'ACTIVE',
  },
];

// 5. CẤU HÌNH CÂN BẰNG GAME HÓA (GAMIFICATION BALANCING ENGINE)
const initialSettings = {
  // Cơ chế Tim (Hearts)
  maxHearts: 5,
  heartRefillMinutes: 240, // 4 tiếng hồi 1 tim
  practiceQuestionsToRefill: 3,
  heartRefillPriceXP: 150,

  // Cơ chế Chuỗi ngày (Streak)
  streakMinLessonsDaily: 1,
  freezePriceXP: 200,
  maxFreezeHolding: 2,

  // Cơ chế Giải đấu (Leagues)
  cohortSize: 30, // 30 người / 1 bảng
  promotionCount: 7, // Top 7 thăng hạng
  demotionCount: 5, // Top 5 rớt hạng
  top1RewardXP: 100,
  top1Badge: 'Huy hiệu Quán quân Tuần',

  // Chế độ bảo vệ
  autoBanBotThresholdXP: 10000, // Kiếm > 10.000 XP/ngày bị nghi ngờ bot
};

// 6. QUẢN LÝ NGƯỜI DÙNG & CSKH 360 (USERS & SUPPORT)
const initialUsers = [
  {
    id: 'usr_001',
    name: 'Nguyễn Văn Học',
    email: 'learner@mimo.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LearnerMimo',
    streak: 12,
    maxStreak: 25,
    hearts: 4,
    xp: 2450,
    role: 'LEARNER',
    plan: 'FREE',
    schoolName: 'THPT FPT Cần Thơ',
    status: 'ACTIVE',
    joinedDate: '2026-09-01',
    lostStreakRecently: false,
    history: [
      { date: '2026-10-18', lesson: 'Thoát hiểm khói độc', xp: 40, status: 'PASS' },
      { date: '2026-10-17', lesson: 'Sơ cứu gãy xương', xp: 35, status: 'PASS' },
    ],
  },
  {
    id: 'usr_002',
    name: 'Trần Bảo An',
    email: 'an.tb@student.lhp.edu.vn',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BaoAn',
    streak: 0, // Vừa bị đứt chuỗi hôm qua
    maxStreak: 45,
    hearts: 1,
    xp: 5200,
    role: 'LEARNER',
    plan: 'SCHOOL_LICENSE',
    schoolName: 'THPT Chuyên Lê Hồng Phong',
    status: 'ACTIVE',
    joinedDate: '2026-08-15',
    lostStreakRecently: true, // Khiếu nại mất chuỗi do mất mạng lúc 23:55
    complaintText: 'Hôm qua nhà em bị cắt điện lúc 23:45 đang làm bài dở nên đứt mất chuỗi 45 ngày tiếc quá ạ, mong thầy cô khôi phục giúp em!',
    history: [
      { date: '2026-10-18', lesson: 'Chưa học bài nào', xp: 0, status: 'FAILED' },
      { date: '2026-10-17', lesson: 'Ép tim CPR', xp: 35, status: 'PASS' },
    ],
  },
  {
    id: 'usr_003',
    name: 'Lê Gia Huy',
    email: 'huy.lg@vinschool.edu.vn',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GiaHuy',
    streak: 30,
    maxStreak: 30,
    hearts: 5,
    xp: 8900,
    role: 'LEARNER',
    plan: 'PRO',
    schoolName: 'Vinschool Central Park',
    status: 'ACTIVE',
    joinedDate: '2026-07-20',
    lostStreakRecently: false,
    history: [],
  },
  {
    id: 'usr_004',
    name: 'Ngô Quốc Đạt (Nghi vấn Bot)',
    email: 'dat.clicker@fakebot.xyz',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DatBot',
    streak: 99,
    maxStreak: 99,
    hearts: 5,
    xp: 48900, // Bất thường
    role: 'LEARNER',
    plan: 'FREE',
    schoolName: 'Tự do',
    status: 'SUSPICIOUS', // Nghi vấn bot click
    joinedDate: '2026-10-01',
    lostStreakRecently: false,
    history: [],
  },
  {
    id: 'usr_005',
    name: 'Thầy Nguyễn Văn Nam (GV PCCC)',
    email: 'educator@mimo.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ThayNam',
    streak: 18,
    maxStreak: 35,
    hearts: 5,
    xp: 6800,
    role: 'EDUCATOR',
    plan: 'EDUCATOR_HUB',
    schoolName: 'THPT FPT Cần Thơ',
    status: 'ACTIVE',
    joinedDate: '2026-06-10',
    lostStreakRecently: false,
    history: [],
  },
];

// 7. QUẢN LÝ TRƯỜNG HỌC & BẢN QUYỀN B2B (SCHOOLS & LICENSES)
const initialSchools = [
  {
    id: 'sch_lhp',
    name: 'THPT Chuyên Lê Hồng Phong (TP.HCM)',
    code: 'LHP-EDUSEC',
    address: '280 An Dương Vương, P.4, Q.5, TP.HCM',
    contactPerson: 'Thầy Trần Đình Trung (Phó Hiệu Trưởng)',
    contactEmail: 'trung.td@lehongphong.edu.vn',
    totalLicenses: 1500,
    activatedLicenses: 1420,
    contractStart: '2026-09-01',
    contractEnd: '2027-08-31',
    contractValue: '75.000.000 VNĐ',
    status: 'ACTIVE',
    safetyAuditPassed: true,
    classes: ['LHP-10A1', 'LHP-10A2', 'LHP-11B', 'LHP-11H', 'LHP-12A'],
  },
  {
    id: 'sch_vin',
    name: 'Vinschool Central Park',
    code: 'VIN-CP-2026',
    address: 'Khu đô thị Vinhomes Central Park, Q.Bình Thạnh, TP.HCM',
    contactPerson: 'Cô Nguyễn Mai Trang (Trưởng ban Đào tạo)',
    contactEmail: 'trang.nm@vinschool.edu.vn',
    totalLicenses: 2000,
    activatedLicenses: 1890,
    contractStart: '2026-09-15',
    contractEnd: '2027-12-15',
    contractValue: '120.000.000 VNĐ',
    status: 'ACTIVE',
    safetyAuditPassed: true,
    classes: ['VIN-10A', 'VIN-10B', 'VIN-11A', 'VIN-12A'],
  },
  {
    id: 'sch_fpt',
    name: 'THPT FPT Cần Thơ',
    code: 'FPT-CT-K10',
    address: 'Khu Đô thị FPT City, Q.Ninh Kiều, Cần Thơ',
    contactPerson: 'Thầy Nguyễn Văn Nam (Trưởng bộ môn An toàn PCCC)',
    contactEmail: 'nam.nv@fpt.edu.vn',
    totalLicenses: 1200,
    activatedLicenses: 1150,
    contractStart: '2026-08-20',
    contractEnd: '2027-09-20',
    contractValue: '60.000.000 VNĐ',
    status: 'ACTIVE',
    safetyAuditPassed: true,
    classes: ['FPT-K10', 'FPT-10A2', 'FPT-10TIN', 'FPT-11A1'],
  },
  {
    id: 'sch_nguyendu',
    name: 'THCS Nguyễn Du',
    code: 'NDU-Q1-2026',
    address: '139 Nguyễn Du, P.Bến Thành, Q.1, TP.HCM',
    contactPerson: 'Cô Lê Thị Kim (Hiệu Trưởng)',
    contactEmail: 'kim.lt@nguyendu.edu.vn',
    totalLicenses: 800,
    activatedLicenses: 750,
    contractStart: '2026-06-01',
    contractEnd: '2027-05-30',
    contractValue: '40.000.000 VNĐ',
    status: 'EXPIRING_SOON', // Sắp hết hạn
    safetyAuditPassed: false,
    classes: ['NDU-8A1', 'NDU-8A2', 'NDU-9A1'],
  },
];

// 8. TRUNG TÂM BÁO LỖI & PHẢN HỒI (FEEDBACK & TICKETS)
const initialFeedbacks = [
  {
    id: 'fb_01',
    type: 'BUG_UI', // BUG_UI | MEDICAL_FEEDBACK | TYPO | OTHER
    typeBadge: '🐛 Lỗi Kỹ thuật UI',
    typeColor: '#DC2626',
    typeBg: '#FEE2E2',
    userEmail: 'an.tb@student.lhp.edu.vn',
    userName: 'Trần Bảo An',
    targetLesson: 'Sơ cứu bỏng nước sôi & hóa chất',
    targetQuestionId: 'q3',
    content: 'Khi em làm câu 3 trên màn hình iPhone, hình ảnh minh họa vết bỏng độ 2 bị tràn viền và nút Tiếp tục bị che mất một nửa.',
    screenshotUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=60',
    submittedAt: '2026-10-18 10:20',
    status: 'OPEN', // OPEN | RESOLVED
  },
  {
    id: 'fb_02',
    type: 'MEDICAL_FEEDBACK',
    typeBadge: '🩺 Góp ý Chuyên môn',
    typeColor: '#2563EB',
    typeBg: '#DBEAFE',
    userEmail: 'bacsi.minh@tudu.hospital.vn',
    userName: 'BS. Lê Minh',
    targetLesson: 'Hồi sức tim phổi CPR',
    targetQuestionId: 'q1',
    content: 'Theo khuyến cáo mới nhất của Hội Tim Mạch 2026, đối với người lớn không có máy thở, ưu tiên ép tim liên tục tay không (Hands-Only CPR) thay vì dừng lại thổi ngạt nếu người cứu hộ không quen.',
    screenshotUrl: null,
    submittedAt: '2026-10-17 15:45',
    status: 'OPEN',
  },
  {
    id: 'fb_03',
    type: 'TYPO',
    typeBadge: '🔤 Lỗi Chính tả',
    typeColor: '#D97706',
    typeBg: '#FEF3C7',
    userEmail: 'learner@mimo.com',
    userName: 'Nguyễn Văn Học',
    targetLesson: 'Xử lý rò rỉ khí gas',
    targetQuestionId: 'q2',
    content: 'Ở câu hỏi 2, từ "cầu dao tổng" bị gõ nhầm thành "cầu dao tổn", mong đội ngũ sửa lại ạ.',
    screenshotUrl: null,
    submittedAt: '2026-10-16 08:30',
    status: 'RESOLVED',
  },
];

// 9. DOANH THU & GÓI CƯỚC (MONETIZATION & BILLING)
const initialMonetization = {
  monthlyRevenue: 89500000,
  b2cRevenue: 34500000,
  b2bRevenue: 55000000,
  growthPercent: 18.5,
  plans: [
    {
      id: 'plan_b2c_monthly',
      name: 'MIMO Premium 1 Tháng (Monthly)',
      type: 'B2C',
      price: 79000,
      originalPrice: 99000,
      billingCycle: '1 Tháng',
      activeSubscribers: 340,
      features: ['Toàn bộ tình huống PCCC & Sơ cứu', 'Vô hạn Tim', 'Giải thích sâu của Bác sĩ AI', 'Không quảng cáo'],
    },
    {
      id: 'plan_b2c_quarterly',
      name: 'MIMO Premium 3 Tháng (Quarterly - Chủ Lực)',
      type: 'B2C',
      price: 219000,
      originalPrice: 237000,
      billingCycle: '3 Tháng',
      activeSubscribers: 420,
      features: ['Vô hạn Tim', 'Báo cáo phụ huynh hàng tuần', 'Bùa bảo vệ Streak tự động', 'Tiết kiệm 18.000đ'],
    },
    {
      id: 'plan_b2c_halfyear',
      name: 'MIMO Premium 6 Tháng (Half-Year)',
      type: 'B2C',
      price: 399000,
      originalPrice: 474000,
      billingCycle: '6 Tháng',
      activeSubscribers: 185,
      features: ['Vô hạn Tim', 'Chứng chỉ định danh QR PCCC', 'Hỗ trợ ưu tiên 1:1 chuyên gia', 'Tiết kiệm 75.000đ'],
    },
    {
      id: 'plan_b2b_school',
      name: 'MIMO School & Enterprise',
      type: 'B2B',
      pricePerSeat: 25000, // 25k/suất/tháng
      billingCycle: 'Hợp đồng Niên khóa',
      activeOrganizations: 4,
      totalActiveSeats: 5210,
      features: ['Bảng quản trị Trường học', 'Mã giáo viên không giới hạn', 'Báo cáo Red Flags toàn trường', 'Chứng chỉ PCCC kiểm định'],
    },
  ],
  gateways: [
    { name: 'PayOS (VietQR Pro)', status: 'ONLINE', successRate: '99.4%', latency: '240ms' },
    { name: 'MoMo Payment Gateway', status: 'ONLINE', successRate: '98.8%', latency: '310ms' },
    { name: 'ZaloPay Merchant', status: 'ONLINE', successRate: '99.1%', latency: '280ms' },
    { name: 'Stripe International (Thẻ tín dụng)', status: 'ONLINE', successRate: '97.5%', latency: '650ms' },
  ],
  transactions: [
    { id: 'tx_9812', customer: 'Trần Văn Hoàng', plan: 'MIMO Plus Năm', amount: 699000, method: 'VietQR', time: '2026-10-19 11:20', status: 'SUCCESS' },
    { id: 'tx_9811', customer: 'THPT FPT Cần Thơ', plan: 'B2B Gia hạn +50 Suất', amount: 7500000, method: 'PayOS', time: '2026-10-18 16:45', status: 'SUCCESS' },
    { id: 'tx_9810', customer: 'Lê Thu Trang', plan: 'MIMO Plus Tháng', amount: 79000, method: 'MoMo', time: '2026-10-18 14:10', status: 'SUCCESS' },
    { id: 'tx_9809', customer: 'Nguyễn Duy Mạnh', plan: 'MIMO Plus Tháng', amount: 79000, method: 'ZaloPay', time: '2026-10-17 21:05', status: 'REFUNDED' },
  ],
};

// HELPER: Lấy hoặc tạo mới dữ liệu từ localStorage
function getStoredOrInit(key, initialData) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// EXPORT TOÀN BỘ ĐỐI TƯỢNG VÀ HÀM QUẢN LÝ DỮ LIỆU
export const mockAdminData = {
  // 1. Getters
  getMetrics: () => getStoredOrInit(STORAGE_KEYS.METRICS, initialMetrics),
  getSkillGaps: () => getStoredOrInit(STORAGE_KEYS.SKILL_GAPS, initialSkillGaps),
  getReviews: () => getStoredOrInit(STORAGE_KEYS.REVIEWS, initialPendingReviews),
  getCurators: () => getStoredOrInit(STORAGE_KEYS.CURATORS, initialCurators),
  getSettings: () => getStoredOrInit(STORAGE_KEYS.SETTINGS, initialSettings),
  getUsers: () => getStoredOrInit(STORAGE_KEYS.USERS, initialUsers),
  getSchools: () => getStoredOrInit(STORAGE_KEYS.SCHOOLS, initialSchools),
  getFeedbacks: () => getStoredOrInit(STORAGE_KEYS.FEEDBACKS, initialFeedbacks),
  getMonetization: () => getStoredOrInit(STORAGE_KEYS.MONETIZATION, initialMonetization),

  // 2. Actions: Content Approval
  approveReview: (reviewId) => {
    const reviews = mockAdminData.getReviews();
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, status: 'APPROVED' } : r));
    saveToStorage(STORAGE_KEYS.REVIEWS, updated);

    // Tăng số khóa học đã phát hành trong metrics
    const metrics = mockAdminData.getMetrics();
    metrics.coursesPublished += 1;
    metrics.pendingApprovals = Math.max(0, metrics.pendingApprovals - 1);
    saveToStorage(STORAGE_KEYS.METRICS, metrics);
    return updated;
  },

  rejectReview: (reviewId, reason) => {
    const reviews = mockAdminData.getReviews();
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, status: 'REJECTED', rejectReason: reason } : r));
    saveToStorage(STORAGE_KEYS.REVIEWS, updated);

    const metrics = mockAdminData.getMetrics();
    metrics.pendingApprovals = Math.max(0, metrics.pendingApprovals - 1);
    saveToStorage(STORAGE_KEYS.METRICS, metrics);
    return updated;
  },

  rollbackReview: (reviewId) => {
    const reviews = mockAdminData.getReviews();
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, status: 'ROLLED_BACK' } : r));
    saveToStorage(STORAGE_KEYS.REVIEWS, updated);
    return updated;
  },

  // 3. Actions: Gamification Settings
  saveSettings: (newSettings) => {
    saveToStorage(STORAGE_KEYS.SETTINGS, newSettings);
    return newSettings;
  },
  resetSettings: () => {
    saveToStorage(STORAGE_KEYS.SETTINGS, initialSettings);
    return initialSettings;
  },

  // 4. Actions: CSKH & User Support
  rescueStreak: (userId) => {
    const users = mockAdminData.getUsers();
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          streak: Math.max(1, u.maxStreak),
          lostStreakRecently: false,
          complaintResolved: true,
        };
      }
      return u;
    });
    saveToStorage(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  refillHearts: (userId) => {
    const users = mockAdminData.getUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, hearts: 5 } : u));
    saveToStorage(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  rewardXP: (userId, amount) => {
    const users = mockAdminData.getUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, xp: u.xp + amount } : u));
    saveToStorage(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  toggleBanUser: (userId) => {
    const users = mockAdminData.getUsers();
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'BANNED' ? 'ACTIVE' : 'BANNED',
        };
      }
      return u;
    });
    saveToStorage(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  // 5. Actions: Schools B2B
  createSchool: (schoolData) => {
    const schools = mockAdminData.getSchools();
    const newSchool = {
      id: `sch_${Date.now()}`,
      ...schoolData,
      activatedLicenses: 0,
      safetyAuditPassed: false,
      classes: [`${schoolData.code}-10A1`, `${schoolData.code}-10A2`],
      status: 'ACTIVE',
    };
    const updated = [newSchool, ...schools];
    saveToStorage(STORAGE_KEYS.SCHOOLS, updated);
    return updated;
  },

  generateClassCodes: (schoolId, count) => {
    const schools = mockAdminData.getSchools();
    const updated = schools.map((s) => {
      if (s.id === schoolId) {
        const newClasses = [];
        for (let i = 1; i <= count; i++) {
          newClasses.push(`${s.code}-K${10 + i}-${Math.floor(100 + Math.random() * 900)}`);
        }
        return { ...s, classes: [...s.classes, ...newClasses] };
      }
      return s;
    });
    saveToStorage(STORAGE_KEYS.SCHOOLS, updated);
    return updated;
  },

  // 6. Actions: Feedback Tickets
  resolveFeedback: (feedbackId, xpGift = 50) => {
    const feedbacks = mockAdminData.getFeedbacks();
    const updated = feedbacks.map((f) => (f.id === feedbackId ? { ...f, status: 'RESOLVED', giftSentXP: xpGift } : f));
    saveToStorage(STORAGE_KEYS.FEEDBACKS, updated);

    // Cập nhật ticket trong metrics
    const metrics = mockAdminData.getMetrics();
    metrics.unresolvedTickets = Math.max(0, metrics.unresolvedTickets - 1);
    saveToStorage(STORAGE_KEYS.METRICS, metrics);
    return updated;
  },

  // 7. Actions: Broadcast Skill Alert
  broadcastSkillAlert: (topicId, customMessage) => {
    return {
      success: true,
      sentToUsersCount: 14850,
      timestamp: new Date().toISOString(),
      topicId,
      message: customMessage || 'Đã gửi thông báo cảnh báo an toàn đến điện thoại của toàn bộ học viên!',
    };
  },
};
