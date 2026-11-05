/**
 * Danh sách Endpoints API của Backend (gom nhóm theo Role/Module)
 */
export const API_ENDPOINTS = {
  // Xác thực chung
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REGISTER_ORGANIZATION: '/auth/register-organization',
    REGISTER_CURATOR: '/auth/register-curator',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },

  // 1. Phân hệ Học viên (Learner)
  LEARNER: {
    MAP_NODES: '/learner/map',
    LESSON_DETAIL: (id) => `/learner/lessons/${id}`,
    SUBMIT_QUIZ: (id) => `/learner/lessons/${id}/submit`,
    QUESTS: '/learner/quests',
    LEADERBOARD: '/learner/leaderboard',
    PROFILE: '/learner/profile',
  },

  // Phân hệ Học liệu & Cây kỹ năng (Curriculum & Learning Path - Nhánh A)
  CURRICULUM: {
    DOMAINS: '/domains',
    DOMAIN_DETAIL: (id) => `/domains/${id}`,
    PATH: (domainId) =>
      typeof domainId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(domainId)
        ? `/path?domainId=${domainId}`
        : '/path',
    UNIT_DETAIL: (id) => `/units/${id}`,
    LESSON_DETAIL: (nodeId) => `/lessons/${nodeId}`,
  },

  // Phân hệ Bảng xếp hạng tuần (Weekly Leaderboard - Nhánh C)
  LEADERBOARD: {
    CURRENT: '/leaderboard/current',
    SEED_MOCK: '/leaderboard/seed-mock',
  },

  // Phân hệ Đa phương tiện & Lưu trữ Cloud (Media & Supabase Storage)
  MEDIA: {
    UPLOAD_AVATAR: '/media/upload/avatar',
    UPLOAD_QUESTION_IMAGE: '/media/upload/question-image',
    UPLOAD: '/media/upload',
    DELETE: '/media',
  },

  // Phân hệ Gameplay Engine & Chấm điểm thời gian thực (Nhánh B)
  GAMEPLAY: {
    START_LESSON: (nodeId) => `/lessons/${nodeId}/start`,
    SUBMIT_ANSWER: (sessionId) => `/sessions/${sessionId}/answer`,
    COMPLETE_SESSION: (sessionId) => `/sessions/${sessionId}/complete`,
  },

  // Phân hệ Phòng ôn tập & Hồi tim (Nhánh B)
  PRACTICE: {
    WRONG_QUESTIONS: '/practice/wrong-questions',
    SUBMIT_ANSWER: '/practice/answer',
  },

  // 2. Phân hệ Tác giả soạn bài (Curator Studio)
  CURATOR: {
    PROFILE: '/curator/profile',
    QUESTIONS: '/curator/questions',
    QUESTION_DETAIL: (id) => `/curator/questions/${id}`,
    SUBMIT_QUESTION: (id) => `/curator/questions/${id}/submit-approval`,
    LESSONS: '/curator/lessons',
    UPDATE_LESSON_QUESTIONS: (nodeId) => `/curator/lessons/${nodeId}/questions`,
    SUBMIT_LESSON: (nodeId) => `/curator/lessons/${nodeId}/submit-approval`,
    PREVIEW_ANSWER: '/curator/preview/answer',
    ANALYTICS: '/curator/analytics',
    FEEDBACK: '/curator/feedback',
    RESOLVE_FEEDBACK: (id) => `/curator/feedback/${id}/resolve`,
    COURSES: '/curator/lessons',
    CREATE_COURSE: '/curator/lessons',
    LESSON_EDITOR: (id) => `/curator/lessons/${id}`,
    SUBMIT_FOR_REVIEW: (id) => `/curator/lessons/${id}/submit-approval`,
  },

  // 3. Phân hệ Tổ chức & Doanh nghiệp (B2B / Organization)
  BUSINESS: {
    OVERVIEW: '/business/overview',
    CLASSES: '/business/classes',
    CREATE_CLASS: '/business/classes',
    UPDATE_CLASS: (id) => `/business/classes/${id}`,
    DELETE_CLASS: (id) => `/business/classes/${id}`,
    ASSIGN_TEACHER: (classId) => `/business/classes/${classId}/assign-teacher`,
    TEACHER_KEYS: '/business/teachers/keys',
    GENERATE_KEY: '/business/teachers/keys',
    REVOKE_KEY: (keyId) => `/business/teachers/keys/${keyId}/revoke`,
    CAMPAIGNS: '/business/campaigns',
    CREATE_CAMPAIGN: '/business/campaigns',
    SKILL_GAP: '/business/skill-gap',
    REPORTS: '/business/reports',
    BILLING: '/business/billing',
  },

  // 4. Lớp học & Thành viên (Classes & Memberships)
  CLASSES: {
    JOIN_BY_CODE: '/classes/join-by-code',
    LEAVE: (classId) => `/classes/${classId}/leave`,
    HEATMAP: (classId) => `/classes/${classId}/heatmap`,
    PROGRESS: (classId) => `/classes/${classId}/progress`,
  },

  // 5. Học sinh & Lớp học của tôi (Learner Classroom)
  CLASSROOM: {
    ME: '/classroom/me',
    JOIN: '/classroom/join',
    LEAVE: '/classroom/leave',
  },

  // 6. Phân hệ Giáo viên (Educator)
  EDUCATOR: {
    OVERVIEW: '/educator/classes',
    CLASSES: '/educator/classes',
    STUDENTS: (classId) => `/classes/${classId}/progress`,
    CLAIM_LICENSE: '/educator/claim-license',
  },

  // 4. Phân hệ Quản trị (Admin)
  ADMIN: {
    DASHBOARD: '/admin/analytics',
    SKILL_GAPS: '/admin/skill-gaps',
    BROADCAST_ALERT: '/admin/broadcast-alert',
    APPROVALS: '/admin/approvals',
    APPROVAL_DETAIL: (id) => `/admin/approvals/${id}`,
    APPROVE_LESSON: (id) => `/admin/approvals/${id}/approve`,
    REJECT_LESSON: (id) => `/admin/approvals/${id}/reject`,
    ROLLBACK_LESSON: (id) => `/admin/approvals/${id}/rollback`,
    CURATORS: '/admin/curators',
    SETTINGS: '/admin/settings',
    SETTINGS_RESET: '/admin/settings/reset',
    USERS: '/admin/users',
    RESCUE_STREAK: (userId) => `/admin/users/${userId}/rescue-streak`,
    REFILL_HEARTS: (userId) => `/admin/users/${userId}/refill-hearts`,
    REWARD_XP: (userId) => `/admin/users/${userId}/reward-xp`,
    TOGGLE_BAN: (userId) => `/admin/users/${userId}/toggle-ban`,
    SCHOOLS: '/admin/schools',
    UPDATE_SCHOOL: (schoolId) => `/admin/schools/${schoolId}`,
    GENERATE_CLASSES: (schoolId) => `/admin/schools/${schoolId}/generate-classes`,
    FEEDBACKS: '/admin/feedbacks',
    RESOLVE_FEEDBACK: (id) => `/admin/feedbacks/${id}/resolve`,
    MONETIZATION: '/admin/monetization',
    REFUND: (id) => `/admin/monetization/refund/${id}`,
  },

  // 5. Thanh toán chuyển khoản SePay (VietQR) & lịch sử giao dịch
  PAYMENT: {
    CREATE_ORDER: '/payment/create-order',
    ORDER_STATUS: (txnRef) => `/payment/order/${encodeURIComponent(txnRef)}`,
    VNPAY_RETURN: '/payment/vnpay-return',
    HISTORY: '/payment/history',
  },

  // 6. Nhiệm vụ hàng ngày (Quests)
  QUESTS: {
    DAILY: '/quests/daily',
    CLAIM: (id) => `/quests/${id}/claim`,
  },

  // 7. Cửa hàng đổi thưởng (Shop)
  SHOP: {
    ITEMS: '/shop/items',
    PURCHASE: '/shop/purchase',
  },

  // 8. Huy hiệu danh hiệu (Achievements)
  ACHIEVEMENTS: {
    LIST: '/achievements',
  },

  // 9. Cẩm nang an toàn sống (Safety Handbook)
  HANDBOOK: {
    LIST: (pillar, search) => {
      const params = new URLSearchParams();
      if (pillar && pillar !== 'Tất cả') params.append('pillar', pillar);
      if (search) params.append('search', search);
      const qs = params.toString();
      return qs ? `/handbook?${qs}` : '/handbook';
    },
    DETAIL: (id) => `/handbook/${id}`,
  },

  // 10. Hồ sơ & Thống kê học tập (Profile & Study Stats)
  USERS: {
    ME: '/users/me',
    STUDY_STATS: '/users/me/study-stats',
    UPDATE_PROFILE: '/users/me/profile',
  },
};
