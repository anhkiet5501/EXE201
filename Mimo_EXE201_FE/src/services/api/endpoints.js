/**
 * Danh sách Endpoints API của Backend (gom nhóm theo Role/Module)
 */
export const API_ENDPOINTS = {
  // Xác thực chung
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
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

  // 2. Phân hệ Tác giả soạn bài (Curator Studio)
  CURATOR: {
    COURSES: '/curator/courses',
    CREATE_COURSE: '/curator/courses',
    LESSON_EDITOR: (id) => `/curator/lessons/${id}`,
    SUBMIT_FOR_REVIEW: (id) => `/curator/lessons/${id}/submit`,
  },

  // 3. Phân hệ Nhà trường (Educator)
  EDUCATOR: {
    OVERVIEW: '/educator/overview',
    CLASSES: '/educator/classes',
    STUDENTS: (classId) => `/educator/classes/${classId}/students`,
    ASSIGNMENTS: '/educator/assignments',
  },

  // 4. Phân hệ Quản trị (Admin)
  ADMIN: {
    DASHBOARD: '/admin/analytics',
    USERS: '/admin/users',
    APPROVALS: '/admin/approvals',
    APPROVE_LESSON: (id) => `/admin/approvals/${id}/approve`,
    REJECT_LESSON: (id) => `/admin/approvals/${id}/reject`,
  },
};
