/**
 * MIMO LEARNER MOCK DATA
 * Chuẩn hóa 100% theo đặc tả phân hệ Người học (Dac_Ta_Chi_Tiet_Phan_He_User_Learner.md)
 */

export const mockLearnerData = {
  // Chỉ số tài nguyên trên Header
  stats: {
    hearts: 4,
    maxHearts: 5,
    streak: 7,
    xp: 1250,
    gems: 350,
    currentLeague: 'Giải Vàng (Gold)',
    streakDays: [true, true, true, true, true, true, false], // T2 -> CN
    streakFreezes: 1,
    dailyGoalXp: 50,
    todayXp: 30,
    heartRecoverySeconds: 12450,
  },

  // 5 Chủ đề Kỹ năng cốt lõi
  domains: [
    { id: 'first_aid', name: 'Sơ cấp cứu ban đầu', icon: '🚑', progress: 60 },
    { id: 'fire_safety', name: 'Thoát hiểm & PCCC', icon: '🔥', progress: 30 },
    { id: 'road_safety', name: 'An toàn giao thông', icon: '🚦', progress: 0 },
    { id: 'cyber_safety', name: 'Chống scam & An toàn số', icon: '🛡️', progress: 10 },
    { id: 'personal_safety', name: 'Phòng chống bạo lực & Xâm hại', icon: '🤝', progress: 0 },
  ],

  // Bản đồ học tập Snake Path phân theo từng Chủ đề (5 Domains)
  unitsByDomain: {
    // 1. SƠ CẤP CỨU BAN ĐẦU
    first_aid: [
      {
        id: 'unit_fa_1',
        unitNumber: 1,
        title: 'XỬ LÝ VẾT THƯƠNG & BỎNG SINH HOẠT',
        description: 'Nắm vững nguyên tắc 3 Không khi bị bỏng và kỹ thuật băng bó ép cầm máu đúng chuẩn y tế.',
        themeColor: '#22C55E',
        lessons: [
          {
            id: 'les_burn_1',
            title: 'Bài 1: Bỏng nước sôi sinh hoạt',
            subtitle: 'Nguyên tắc vàng 3 Không',
            type: 'lesson',
            status: 'completed',
            stars: 3,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🔥',
          },
          {
            id: 'les_cut_2',
            title: 'Bài 2: Vết thương chảy máu & Cầm máu',
            subtitle: 'Kỹ thuật ép trực tiếp',
            type: 'lesson',
            status: 'active',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🩹',
          },
          {
            id: 'chest_1',
            title: 'Rương quà may mắn',
            subtitle: 'Mở khóa nhận XP và bùa',
            type: 'chest',
            status: 'locked',
            rewardXp: 25,
            icon: '🎁',
          },
          {
            id: 'les_fracture_3',
            title: 'Bài 3: Cố định gãy xương',
            subtitle: 'Xử lý gãy kín & gãy hở',
            type: 'lesson',
            status: 'locked',
            stars: 0,
            duration: '~3 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🦴',
          },
          {
            id: 'boss_unit_1',
            title: 'Trạm Boss: Thử thách cứu hộ Chặng 1',
            subtitle: 'Vượt qua để nhận Huy hiệu Danh dự',
            type: 'boss',
            status: 'locked',
            duration: '~3 phút',
            questionsCount: 5,
            rewardXp: 30,
            icon: '👑',
          },
        ],
      },
      {
        id: 'unit_fa_2',
        unitNumber: 2,
        title: 'HỒI SINH TIM PHỔI (CPR) & DỊ VẬT ĐƯỜNG THỞ',
        description: 'Kỹ năng ép tim cứu người ngừng tuần hoàn và nghiệm pháp Heimlich giải phóng đường thở trong 3 phút vàng.',
        themeColor: '#0EA5E9',
        lessons: [
          {
            id: 'les_cpr_1',
            title: 'Bài 1: Nhận diện người bất tỉnh ngừng thở',
            subtitle: 'Kiểm tra phản ứng và đường thở',
            type: 'lesson',
            status: 'locked',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🫀',
          },
          {
            id: 'les_cpr_2',
            title: 'Bài 2: Quy trình ép tim 30 : 2',
            subtitle: 'Tần số và vị trí chuẩn',
            type: 'lesson',
            status: 'locked',
            stars: 0,
            duration: '~3 phút',
            questionsCount: 4,
            rewardXp: 20,
            icon: '⚡',
          },
        ],
      },
    ],

    // 2. THOÁT HIỂM & PCCC
    fire_safety: [
      {
        id: 'unit_fs_1',
        unitNumber: 1,
        title: 'THOÁT HIỂM CHUNG CƯ & NHÀ CAO TẦNG',
        description: 'Kỹ năng chống ngạt khói độc, di chuyển men theo tường và thoát hiểm cầu thang bộ an toàn.',
        themeColor: '#F97316',
        lessons: [
          {
            id: 'les_fire_1',
            title: 'Bài 1: Phản xạ khi chuông báo cháy reo',
            subtitle: 'Quy tắc khăn ẩm & hạ thấp người',
            type: 'lesson',
            status: 'completed',
            stars: 3,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🚪',
          },
          {
            id: 'les_fire_2',
            title: 'Bài 2: Thoát hiểm qua cầu thang bộ',
            subtitle: 'Tuyệt đối KHÔNG dùng thang máy',
            type: 'lesson',
            status: 'active',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🪜',
          },
          {
            id: 'chest_fs_1',
            title: 'Rương quà PCCC',
            subtitle: 'Thưởng bùa bảo vệ',
            type: 'chest',
            status: 'locked',
            rewardXp: 25,
            icon: '🎁',
          },
          {
            id: 'les_fire_3',
            title: 'Bài 3: Xử lý rò rỉ khí gas nhà bếp',
            subtitle: '3 bước hành động không đánh lửa',
            type: 'lesson',
            status: 'locked',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🍳',
          },
          {
            id: 'boss_fs_1',
            title: 'Trạm Boss: Chiến binh PCCC',
            subtitle: 'Thử thách dập lửa dưới áp lực thời gian',
            type: 'boss',
            status: 'locked',
            duration: '~3 phút',
            questionsCount: 5,
            rewardXp: 30,
            icon: '👑',
          },
        ],
      },
    ],

    // 3. AN TOÀN GIAO THÔNG
    road_safety: [
      {
        id: 'unit_rs_1',
        unitNumber: 1,
        title: 'NHẬN DIỆN ĐIỂM MÙ XE TẢI & SANG ĐƯỜNG',
        description: 'Vùng tử thần xung quanh xe container, xe bồn và nguyên tắc qua đường an toàn cho học sinh.',
        themeColor: '#EAB308',
        lessons: [
          {
            id: 'les_road_1',
            title: 'Bài 1: 4 Vùng điểm mù của xe tải lớn',
            subtitle: 'Không bao giờ đứng song song bên phải',
            type: 'lesson',
            status: 'active',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🚚',
          },
          {
            id: 'les_road_2',
            title: 'Bài 2: An toàn khi đi xe máy điện & xe đạp',
            subtitle: 'Đội mũ bảo hiểm chuẩn & tín hiệu rẽ',
            type: 'lesson',
            status: 'locked',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🚲',
          },
          {
            id: 'boss_rs_1',
            title: 'Trạm Boss: Phản xạ giao thông đường phố',
            subtitle: 'Thử thách bảo vệ tính mạng trên xa lộ',
            type: 'boss',
            status: 'locked',
            duration: '~3 phút',
            questionsCount: 5,
            rewardXp: 30,
            icon: '👑',
          },
        ],
      },
    ],

    // 4. CHỐNG SCAM & AN TOÀN SỐ
    cyber_safety: [
      {
        id: 'unit_cs_1',
        unitNumber: 1,
        title: 'NHẬN DIỆN LỪA ĐẢO TRỰC TUYẾN & BẪY OTP',
        description: 'Vạch mặt cuộc gọi mạo danh công an/ngân hàng, đường link trúng thưởng giả mạo và deepfake AI.',
        themeColor: '#0EA5E9',
        lessons: [
          {
            id: 'les_cyber_1',
            title: 'Bài 1: Cuộc gọi dọa bắt giam từ công an giả',
            subtitle: 'Quy tắc 5 giây bình tĩnh kiểm chứng',
            type: 'lesson',
            status: 'active',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '📞',
          },
          {
            id: 'les_cyber_2',
            title: 'Bài 2: Bẫy link OTP & Tuyển dụng online',
            subtitle: 'Tuyệt đối không chia sẻ mã 6 số',
            type: 'lesson',
            status: 'locked',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🔗',
          },
          {
            id: 'boss_cs_1',
            title: 'Trạm Boss: Mắt thần an ninh mạng',
            subtitle: 'Phá giải 5 chiêu trò scam tinh vi nhất',
            type: 'boss',
            status: 'locked',
            duration: '~3 phút',
            questionsCount: 5,
            rewardXp: 30,
            icon: '👑',
          },
        ],
      },
    ],

    // 5. PHÒNG CHỐNG BẠO LỰC & XÂM HẠI
    personal_safety: [
      {
        id: 'unit_ps_1',
        unitNumber: 1,
        title: 'RANH GIỚI CƠ THỂ & PHÒNG CHỐNG BẠO LỰC',
        description: 'Quy tắc 5 ngón tay bảo vệ bản thân, kỹ năng ứng phó bạo lực học đường và thoát khỏi đám đông giẫm đạp.',
        themeColor: '#8B5CF6',
        lessons: [
          {
            id: 'les_ps_1',
            title: 'Bài 1: Quy tắc 5 ngón tay ranh giới thân thể',
            subtitle: 'Ai được phép chạm và ai không',
            type: 'lesson',
            status: 'active',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '✋',
          },
          {
            id: 'les_ps_2',
            title: 'Bài 2: Ứng phó khi bị bắt nạt học đường',
            subtitle: 'Cách tìm sự trợ giúp & Tổng đài 111',
            type: 'lesson',
            status: 'locked',
            stars: 0,
            duration: '~2 phút',
            questionsCount: 4,
            rewardXp: 15,
            icon: '🛡️',
          },
          {
            id: 'boss_ps_1',
            title: 'Trạm Boss: Dũng sĩ tự bảo vệ',
            subtitle: 'Kỹ năng thoát thân và bảo vệ bạn bè',
            type: 'boss',
            status: 'locked',
            duration: '~3 phút',
            questionsCount: 5,
            rewardXp: 30,
            icon: '👑',
          },
        ],
      },
    ],
  },

  // Bảng xếp hạng tuần
  leaderboard: {
    leagueName: 'GIẢI VÀNG (GOLD LEAGUE)',
    timeLeft: '2 ngày 14 giờ',
    podium: [
      { rank: 1, name: 'Nguyễn Minh Quân', school: 'THPT FPT - 10A1', xp: 3250, avatar: '👦🏻' },
      { rank: 2, name: 'Trần Phương Anh', school: 'THPT Chuyên LHP', xp: 2980, avatar: '👧🏻' },
      { rank: 3, name: 'Lê Hoàng Bảo', school: 'THPT Lê Quý Đôn', xp: 2760, avatar: '👦🏽' },
    ],
    nearbyUsers: [
      { rank: 3, name: 'Hoàng Anh', xp: 1320, avatar: '🧑🏻' },
      { rank: 4, name: 'Bạn (Nam)', xp: 1250, avatar: '🤖', isMe: true },
      { rank: 5, name: 'Minh Trang', xp: 1180, avatar: '👧🏼' },
    ],
    message: 'Chỉ cần thêm 70 XP nữa để lọt vào Top 3 nhận cúp!',
  },

  // Nhiệm vụ hàng ngày
  dailyQuests: [
    {
      id: 'quest_1',
      title: 'Hoàn thành 2 bài học mới',
      icon: '🎯',
      current: 1,
      target: 2,
      reward: '+10 XP',
      completed: false,
    },
    {
      id: 'quest_2',
      title: 'Đạt 40 XP hôm nay',
      icon: '⚡',
      current: 30,
      target: 40,
      reward: '+1 Bùa Đóng Băng 🛡️',
      completed: false,
    },
    {
      id: 'quest_3',
      title: 'Đạt 1 bài học Hoàn hảo (Không mất tim)',
      icon: '✨',
      current: 1,
      target: 1,
      reward: '+15 XP',
      completed: true,
      claimed: false,
    },
  ],

  // Mẹo an toàn tuần
  weeklyTip: {
    title: 'Mẹo tuần này: Sạc xe điện an toàn',
    content: 'Khi sạc xe máy điện/xe đạp điện, tuyệt đối không cắm sạc qua đêm ở khu vực kín không có người trông coi. Luôn kiểm tra bình cứu hỏa mini trước cửa phòng!',
    icon: '💡',
  },

  // Cẩm nang học tập
  handbook: {
    emergencyDials: [
      { number: '114', name: 'Cứu nạn PCCC & Cháy', desc: 'Khi phát hiện khói, lửa, sập đổ công trình', color: '#EF4444', icon: '🚒' },
      { number: '115', name: 'Cấp cứu Y tế Toàn quốc', desc: 'Nạn nhân ngừng thở, chấn thương nặng, đột quỵ', color: '#0EA5E9', icon: '🚑' },
      { number: '113', name: 'Cảnh sát & An ninh', desc: 'Bạo lực, cướp giật, trộm cắp, tai nạn giao thông', color: '#F59E0B', icon: '👮' },
      { number: '111', name: 'Tổng đài Bảo vệ Trẻ em', desc: 'Bạo lực học đường, xâm hại, bóc lột trẻ em', color: '#8B5CF6', icon: '🛡️' },
    ],
    articles: [
      {
        id: 'burn_first_aid',
        pillar: 'Sơ cấp cứu',
        title: 'Quy trình xử lý Bỏng nước sôi & Nhiệt độ cao',
        badge: 'Nguyên tắc 3 Không',
        steps: [
          'Bước 1: Ngay lập tức đưa nạn nhân ra khỏi nguồn nhiệt gây bỏng.',
          'Bước 2: Xả nước mát sạch (15 - 20°C) liên tục trong 15-20 phút lên vùng da bị bỏng. Không dùng nước đá lạnh buốt.',
          'Bước 3: Che phủ nhẹ vết bỏng bằng gạc vô khuẩn hoặc khăn sạch, không băng quá chặt. Đưa đến cơ sở y tế.',
        ],
        warning: 'TUYỆT ĐỐI KHÔNG: Bôi kem đánh răng, mỡ trăn, nước mắm, xà phòng hoặc chọc thủng các bọng nước!',
      },
      {
        id: 'fire_escape',
        pillar: 'PCCC & Thoát hiểm',
        title: 'Thoát hiểm chung cư cao tầng khi xảy ra cháy',
        badge: 'Quy tắc Men theo tường',
        steps: [
          'Bước 1: Dùng mu bàn tay sờ tay nắm cửa. Nếu cửa nóng rực, tuyệt đối KHÔNG mở cửa mà dùng khăn ướt chèn kín khe cửa.',
          'Bước 2: Nếu hành lang an toàn, dùng khăn ẩm bịt kín mũi và miệng, hạ thấp người hoặc bò sát sàn nhà (nơi có nhiều oxy sạch).',
          'Bước 3: Thoát hiểm bằng thang bộ thoát hiểm có cửa chống cháy. Tuyệt đối KHÔNG BAO GIỜ dùng thang máy!',
        ],
        warning: 'Khói độc là nguyên nhân gây tử vong 80% trong các vụ cháy. Hít phải khói độc 3-5 hơi có thể bất tỉnh!',
      },
      {
        id: 'scam_prevention',
        pillar: 'An toàn số',
        title: 'Nhận diện cuộc gọi mạo danh Công an / Viện kiểm sát',
        badge: 'Quy tắc 5 Giây',
        steps: [
          'Bước 1: Nhận diện dấu hiệu: Người gọi tự xưng Công an, dọa có liên quan đến đường dây ma túy/rửa tiền, yêu cầu chuyển tiền vào "tài khoản an toàn".',
          'Bước 2: Bình tĩnh ghi nhớ: Cơ quan công an KHÔNG BAO GIỜ làm việc hoặc yêu cầu chuyển tiền qua điện thoại.',
          'Bước 3: Dập máy ngay lập tức và gọi đến công an khu vực hoặc đường dây nóng để xác minh.',
        ],
        warning: 'Không cung cấp mã OTP, thông tin tài khoản ngân hàng hoặc nhấn vào bất kỳ đường link nào gửi qua SMS/Zalo!',
      },
    ],
  },

  // Lớp học (Mặc định CHƯA tham gia, bắt buộc nhập mã lớp B2B Nhà trường)
  classroom: {
    joined: false,
    classInfo: null,
    assignments: [],
  },
};

// CƠ SỞ DỮ LIỆU 3 MÃ LỚP HỌC MẪU DÀNH CHO CÁC TRƯỜNG LIÊN KẾT
export const mockClassroomsDatabase = {
  // LỚP 1: THPT FPT CẦN THƠ
  'FPT-K10': {
    code: 'FPT-K10',
    className: 'Lớp 10A1 — THPT FPT Cần Thơ',
    school: 'THPT FPT Cần Thơ',
    topic: 'Kỹ năng Thoát hiểm Hỏa hoạn & PCCC',
    teacher: 'Thầy Nguyễn Văn Nam',
    teacherRole: 'GV Kỹ năng sinh tồn & Cố vấn PCCC',
    teacherAvatar: '👨🏻‍🏫',
    bannerGradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    totalStudents: 38,
    rankInClass: 2,
    assignments: [
      {
        id: 'asn_fpt_1',
        title: 'Tuần 3: Kỹ năng xử lý tai nạn giao thông & Nhận diện điểm mù xe tải',
        deadline: 'Chủ nhật tuần này (Còn 2 ngày)',
        status: 'pending',
        rewardXp: 50,
      },
      {
        id: 'asn_fpt_2',
        title: 'Tuần 3: Kỹ thuật bò thấp tránh khói độc khi còi báo cháy reo',
        deadline: 'Thứ 4 tuần tới (Còn 5 ngày)',
        status: 'pending',
        rewardXp: 60,
      },
      {
        id: 'asn_fpt_3',
        title: 'Tuần 2: Thoát hiểm nhà cao tầng & Kỹ năng PCCC thực chiến',
        deadline: 'Đã hoàn thành',
        status: 'submitted',
        score: '100 / 100 Điểm ✅',
      },
    ],
  },

  // LỚP 2: THPT CHUYÊN LÊ HỒNG PHONG TP.HCM
  'LHP-11B': {
    code: 'LHP-11B',
    className: 'Lớp 11 Sinh — THPT Chuyên Lê Hồng Phong TP.HCM',
    school: 'THPT Chuyên Lê Hồng Phong TP.HCM',
    topic: 'Kỹ năng Sơ cấp cứu Y tế & Chấn thương Học đường',
    teacher: 'Cô BS. Trần Thị Mai',
    teacherRole: 'Bác sĩ Trường học & Cố vấn Cấp cứu Chữ Thập Đỏ',
    teacherAvatar: '👩🏻‍⚕️',
    bannerGradient: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
    totalStudents: 35,
    rankInClass: 1,
    assignments: [
      {
        id: 'asn_lhp_1',
        title: 'Chuyên đề 1: Thực hành ép tim CPR ngoài lồng ngực & Thổi ngạt nhịp 30:2',
        deadline: 'Thứ 6 tuần tới (Còn 4 ngày)',
        status: 'pending',
        rewardXp: 75,
      },
      {
        id: 'asn_lhp_2',
        title: 'Chuyên đề 2: Xử lý bỏng nước sôi & Băng ép cố định gãy xương',
        deadline: 'Chủ nhật tuần tới (Còn 6 ngày)',
        status: 'pending',
        rewardXp: 65,
      },
      {
        id: 'asn_lhp_3',
        title: 'Chuyên đề 1: Nghiệm pháp Heimlich tống dị vật đường thở nguy kịch',
        deadline: 'Đã hoàn thành',
        status: 'submitted',
        score: '98 / 100 Điểm ✅',
      },
    ],
  },

  // LỚP 3: VINSCHOOL CENTRAL PARK
  'VSC-12A': {
    code: 'VSC-12A',
    className: 'Lớp 12A3 — Vinschool Central Park',
    school: 'Vinschool Central Park',
    topic: 'An toàn Số, Chống Scam & Phòng chống Bắt nạt Mạng',
    teacher: 'Thầy ThS. Lê Hoàng Quân',
    teacherRole: 'Chuyên gia An ninh mạng & Trưởng bộ môn Kỹ năng số',
    teacherAvatar: '👨🏻‍💻',
    bannerGradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    totalStudents: 32,
    rankInClass: 5,
    assignments: [
      {
        id: 'asn_vsc_1',
        title: 'Bài tập 1: Phát hiện video/giọng nói lừa đảo Deepfake & Link mạo danh',
        deadline: 'Hạn chót: 23:59 ngày mai (Gấp)',
        status: 'pending',
        rewardXp: 70,
      },
      {
        id: 'asn_vsc_2',
        title: 'Bài tập 2: Kỹ năng ứng phó bắt nạt trực tuyến (Cyberbullying) & Báo cáo an toàn',
        deadline: 'Thứ 2 tuần sau (Còn 3 ngày)',
        status: 'pending',
        rewardXp: 55,
      },
      {
        id: 'asn_vsc_3',
        title: 'Thực hành: Cài đặt xác thực 2 bước 2FA & Bảo vệ tài khoản định danh',
        deadline: 'Đã hoàn thành',
        status: 'submitted',
        score: '100 / 100 Điểm ✅',
      },
    ],
  },
};

// Aliases hỗ trợ nhập các biến thể mã lớp thông dụng
mockClassroomsDatabase['K10-PCCC'] = mockClassroomsDatabase['FPT-K10'];
mockClassroomsDatabase['LHP-YTE'] = mockClassroomsDatabase['LHP-11B'];
mockClassroomsDatabase['VSC-CYBER'] = mockClassroomsDatabase['VSC-12A'];

export const mockLessonCutQuestions = [
  {
    id: 'q1',
    type: 'scenario_choice',
    mimoDialogue: 'Bạn của bạn vô tình làm vỡ cốc thủy tinh, một mảnh vỡ cứa sâu vào cẳng tay khiến máu đỏ tươi phun thành tia mạnh!',
    question: 'HÀNH ĐỘNG AN TOÀN ĐẦU TIÊN & QUAN TRỌNG NHẤT BẠN PHẢI LÀM LÀ GÌ?',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    options: [
      { id: 'opt_1', text: 'Đắp lá cây hoặc bột cà phê lên miệng vết thương để cầm máu dân gian', isCorrect: false },
      { id: 'opt_2', text: 'Dùng gạc sạch hoặc khăn ép trực tiếp thật mạnh lên vết thương và nâng cao cẳng tay', isCorrect: true },
      { id: 'opt_3', text: 'Rửa vết thương dưới vòi nước thật mạnh cho sạch hết máu rồi mới tính tiếp', isCorrect: false },
      { id: 'opt_4', text: 'Dùng dây thun buộc chặt garo ở cổ tay gần vết thương', isCorrect: false },
    ],
    explanation: 'Ép trực tiếp lên vết thương là nguyên tắc vàng để chặn đứt dòng chảy của máu động mạch. Đắp lá cây hoặc bột cà phê gây nhiễm trùng uốn ván chết người!',
    dangerAlert: 'Đắp dị vật lạ vào vết thương hở là sai lầm chết người, vi khuẩn uốn ván sẽ xâm nhập gây nhiễm trùng máu trong 24 giờ!',
    xp: 10,
  },
  {
    id: 'q2',
    type: 'sequencing_steps',
    mimoDialogue: 'Hãy ghi nhớ thứ tự chuẩn y tế khi sơ cứu một ca chảy máu ngoài da nghiêm trọng.',
    question: 'SẮP XẾP ĐÚNG THỨ TỰ CÁC BƯỚC SƠ CỨU CẦM MÁU BẰNG GẠC ÉP:',
    correctSequence: [
      { id: 'step_1', text: '1. Đeo găng tay y tế hoặc túi nilon sạch để bảo vệ bản thân tránh phơi nhiễm' },
      { id: 'step_2', text: '2. Đặt gạc sạch trực tiếp lên vết thương và dùng lòng bàn tay ép mạnh liên tục' },
      { id: 'step_3', text: '3. Dùng băng cuộn quấn cố định gạc chặt tay nhưng không làm tím tái đầu chi' },
      { id: 'step_4', text: '4. Nâng cao phần chi bị thương cao hơn tim và đưa nạn nhân tới cơ sở y tế' },
    ],
    explanation: 'Bảo vệ an toàn cho người sơ cứu là bước 1. Sau đó ép trực tiếp, băng ép cố định và nâng cao chi giúp giảm áp lực máu dồn về vết thương!',
    xp: 15,
  },
  {
    id: 'q3',
    type: 'rapid_true_false',
    mimoDialogue: 'Nhiều người truyền tai nhau các phương pháp dân gian nguy hiểm.',
    question: 'KHI BỊ BỎNG NƯỚC SÔI, BÔI KEM ĐÁNH RĂNG HOẶC MỠ TRĂN NGAY LẬP TỨC LÀ ĐÚNG HAY SAI?',
    statement: 'Bôi kem đánh răng lên vết bỏng để làm dịu mát da.',
    correctAnswer: false,
    explanation: 'Kem đánh răng chứa chất kiềm và bạc hà kích ứng, mỡ trăn giữ nhiệt làm vết bỏng ăn sâu vào mô thịt. Chỉ được xả nước mát sạch!',
    dangerAlert: 'Kem đánh răng giữ nhiệt và gây hoại tử da nặng hơn! Nguyên tắc chuẩn là xả nước mát 15-20 phút!',
    xp: 10,
  },
  {
    id: 'q4',
    type: 'spot_red_flag',
    mimoDialogue: 'Hãy rèn luyện đôi mắt tinh tường trước những cái bẫy lừa đảo mạng tinh vi.',
    question: 'CHẠM VÀO ĐIỂM BẤT THƯỜNG / NGUY HIỂM TRONG TIN NHẮN SMS DƯỚI ĐÂY:',
    sender: 'Vietcombank-SMS',
    time: 'Vừa xong',
    messageSegments: [
      { id: 'seg_1', text: '[Vietcombank] Thong bao: Tai khoan cua Quy khach bi khoa do nghi van giao dich bat thuong.', isFlag: false },
      { id: 'seg_2', text: 'De mo khoa ngay, vui long dang nhap tai: http://vietcombannk-xacnhan247.com/login', isFlag: true },
      { id: 'seg_3', text: 'va nhap ma OTP gui ve dien thoai de xac thuc bao mat. Tran trong!', isFlag: false },
    ],
    explanation: 'Tên miền sai chính tả "vietcombannk" (thừa chữ n) và yêu cầu nhập mã OTP qua link web lạ. Ngân hàng KHÔNG BAO GIỜ yêu cầu nhập OTP qua đường link!',
    dangerAlert: 'Bấm vào link giả mạo và nhập OTP sẽ khiến kẻ gian chiếm quyền kiểm soát tài khoản và rút sạch tiền trong 3 giây!',
    xp: 15,
  },
];
