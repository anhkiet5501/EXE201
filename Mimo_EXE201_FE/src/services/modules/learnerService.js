import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { USE_MOCK } from '../api/mockConfig';
import { mockSuccess } from '../mocks/mockHelper';
import { mockLearnerData, mockLessonCutQuestions, mockClassroomsDatabase } from '../mocks/mockLearner';

/**
 * Gọi API thật. Chỉ khi chạy chế độ mock (VITE_USE_MOCK=true) mới rơi về dữ liệu mẫu khi lỗi.
 * Ở chế độ thường, lỗi từ Backend được ném ra để giao diện báo đúng cho người dùng
 * (không còn hiển thị dữ liệu giả như thể là dữ liệu thật).
 */
const withMockFallback = async (realCall, mockFactory, label = 'API') => {
  if (!USE_MOCK) {
    return realCall();
  }
  try {
    return await realCall();
  } catch (err) {
    console.warn(`[MOCK MODE] ${label} lỗi, dùng dữ liệu mẫu:`, err?.message);
    return mockFactory();
  }
};

export const learnerService = {
  // -------------------------------------------------------------
  // NHÁNH A: CÂY KỸ NĂNG & LỘ TRÌNH HỌC (CURRICULUM)
  // -------------------------------------------------------------

  /** GET /api/v1/domains */
  async getDomains() {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.CURRICULUM.DOMAINS),
      () => mockSuccess(mockLearnerData.domains || []),
      'getDomains'
    );
  },

  /** GET /api/v1/path?domainId=... */
  async getLearningPath(domainId = null) {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.CURRICULUM.PATH(domainId)),
      () => mockSuccess(mockLearnerData),
      'getLearningPath'
    );
  },

  /** GET /api/v1/units/{id} */
  async getUnitDetail(unitId) {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.CURRICULUM.UNIT_DETAIL(unitId)),
      () => mockSuccess({}),
      'getUnitDetail'
    );
  },

  // -------------------------------------------------------------
  // NHÁNH C: BẢNG XẾP HẠNG TUẦN (WEEKLY LEADERBOARD)
  // -------------------------------------------------------------

  /** GET /api/v1/leaderboard/current */
  async getWeeklyLeaderboard() {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.LEADERBOARD.CURRENT),
      () => mockSuccess(mockLearnerData.leaderboard || {}),
      'getWeeklyLeaderboard'
    );
  },

  // -------------------------------------------------------------
  // PHÂN HỆ MEDIA & SUPABASE STORAGE
  // -------------------------------------------------------------

  /** POST /api/v1/media/upload/avatar */
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(API_ENDPOINTS.MEDIA.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /** POST /api/v1/media/upload/question-image */
  async uploadQuestionImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(API_ENDPOINTS.MEDIA.UPLOAD_QUESTION_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getDashboardData() {
    const realCall = async () => {
      const [domainsRes, pathRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.CURRICULUM.DOMAINS),
        apiClient.get(API_ENDPOINTS.CURRICULUM.PATH()),
      ]);

      return {
        data: {
          ...mockLearnerData,
          domains: domainsRes?.data,
          learningPath: pathRes?.data,
          units: pathRes?.data?.units || [],
        },
      };
    };

    return withMockFallback(realCall, () => mockSuccess(mockLearnerData), 'getDashboardData');
  },

  async getLessonDetail(lessonId) {
    const mockLesson = () =>
      mockSuccess({
        id: lessonId,
        title: 'Bài 2: Vết thương chảy máu & Cầm máu',
        unitTitle: 'Chặng 1: Xử lý Vết thương & Bỏng sinh hoạt',
        questions: mockLessonCutQuestions,
      });

    if (USE_MOCK) {
      return mockLesson();
    }
    return apiClient.get(API_ENDPOINTS.LEARNER.LESSON_DETAIL(lessonId));
  },

  // -------------------------------------------------------------
  // NHÁNH B: GAMEPLAY ENGINE & CHẤM ĐIỂM THỜI GIAN THỰC
  // -------------------------------------------------------------

  /**
   * Khởi tạo phiên học mới cho Node bài học.
   * POST /api/v1/lessons/{nodeId}/start
   * Lỗi từ Backend (hết tim, bài bị khóa, chưa xuất bản, mất mạng...) được ném ra nguyên vẹn.
   */
  async startLesson(nodeId, assignmentId = null) {
    if (!USE_MOCK) {
      return apiClient.post(API_ENDPOINTS.GAMEPLAY.START_LESSON(nodeId), {
        assignmentId: assignmentId || null,
      });
    }

    // Chế độ mock: ánh xạ ID mẫu sang GUID đã seed và cho phép fallback offline
    let targetNodeId = nodeId;
    const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nodeId);
    if (!isGuid) {
      if (nodeId === 'les_burn_1') targetNodeId = 'c1111111-1111-1111-1111-111111111111';
      else if (nodeId === 'les_cut_2') targetNodeId = 'c2222222-2222-2222-2222-222222222222';
      else targetNodeId = 'c1111111-1111-1111-1111-111111111111';
    }

    return withMockFallback(
      () =>
        apiClient.post(API_ENDPOINTS.GAMEPLAY.START_LESSON(targetNodeId), {
          assignmentId: assignmentId || null,
        }),
      () =>
        mockSuccess({
          sessionId: `mock-session-${Date.now()}`,
          nodeId: targetNodeId,
          nodeTitle: 'Bài 1.1: Bỏng nước sôi sinh hoạt & chập điện',
          heartsRemaining: 5,
          isPro: false,
          questions: mockLessonCutQuestions,
        }),
      'startLesson'
    );
  },

  /** POST /api/v1/sessions/{id}/answer */
  async submitAnswer(sessionId, { questionId, submittedAnswer, timeSpentSeconds = 10 }, idempotencyKey = null) {
    if (USE_MOCK && sessionId?.startsWith('mock-session-')) {
      return mockSuccess({
        questionId,
        isCorrect: true,
        explanation: 'Lời giải thích mẫu: bạn đã thao tác chính xác!',
        heartsRemaining: 5,
        currentComboStreak: 1,
        xpEarned: 10,
        comboBonusXp: 0,
        isSessionFailed: false,
      });
    }

    const headers = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    return await apiClient.post(
      API_ENDPOINTS.GAMEPLAY.SUBMIT_ANSWER(sessionId),
      {
        questionId,
        submittedAnswer,
        timeSpentSeconds,
      },
      { headers }
    );
  },

  /** POST /api/v1/sessions/{id}/complete */
  async completeSession(sessionId) {
    if (USE_MOCK && sessionId?.startsWith('mock-session-')) {
      return mockSuccess({
        sessionId,
        status: 'completed',
        totalXpEarned: 35,
        heartsLost: 0,
        heartsRemaining: 5,
        maxComboStreak: 3,
        isPerfectLesson: true,
        perfectBonusXp: 5,
        streakInfo: {
          streak: 8,
          status: 'Increased',
          freezeConsumed: false,
          freezesRemaining: 1,
        },
      });
    }

    return await apiClient.post(API_ENDPOINTS.GAMEPLAY.COMPLETE_SESSION(sessionId));
  },

  // -------------------------------------------------------------
  // NHÁNH B: PHÒNG ÔN TẬP & HỒI TIM
  // -------------------------------------------------------------

  /** GET /api/v1/practice/wrong-questions */
  async getWrongQuestions() {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.PRACTICE.WRONG_QUESTIONS),
      () => mockSuccess([]),
      'getWrongQuestions'
    );
  },

  /** POST /api/v1/practice/answer */
  async submitPracticeAnswer({ questionId, submittedAnswer, timeSpentSeconds = 10 }) {
    return await apiClient.post(API_ENDPOINTS.PRACTICE.SUBMIT_ANSWER, {
      questionId,
      submittedAnswer,
      timeSpentSeconds,
    });
  },

  async claimQuest(questId) {
    if (USE_MOCK) {
      return mockSuccess({ success: true, message: 'Nhận thưởng thành công!' });
    }
    return apiClient.post(API_ENDPOINTS.QUESTS.CLAIM(questId));
  },

  async getMyClassroom() {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.CLASSROOM.ME),
      () => mockSuccess(mockLearnerData.classroom),
      'getMyClassroom'
    );
  },

  async joinClassroom(code) {
    const realCall = () => apiClient.post(API_ENDPOINTS.CLASSROOM.JOIN, { code, classCode: code });

    if (!USE_MOCK) {
      // Giữ nguyên thông điệp lỗi thật của Backend (mã sai, hết ghế, lớp đầy...)
      return realCall();
    }

    try {
      return await realCall();
    } catch (err) {
      console.warn('[MOCK MODE] API Join Classroom lỗi, dùng dữ liệu mẫu:', err?.message);
      const normalizedCode = (code || '').trim().toUpperCase();
      const targetClass = mockClassroomsDatabase[normalizedCode];

      if (targetClass) {
        mockLearnerData.classroom = {
          joined: true,
          classInfo: {
            code: targetClass.code,
            className: targetClass.className,
            school: targetClass.school,
            topic: targetClass.topic,
            teacher: targetClass.teacher,
            teacherRole: targetClass.teacherRole,
            teacherAvatar: targetClass.teacherAvatar,
            bannerGradient: targetClass.bannerGradient,
            totalStudents: targetClass.totalStudents,
            rankInClass: targetClass.rankInClass,
          },
          assignments: targetClass.assignments,
        };
        return mockSuccess({
          success: true,
          classroom: mockLearnerData.classroom,
          className: targetClass.className,
        });
      }

      throw new Error('Mã lớp học không hợp lệ hoặc không tồn tại trong hệ thống liên kết!');
    }
  },

  async leaveClassroom() {
    return withMockFallback(
      () => apiClient.post(API_ENDPOINTS.CLASSROOM.LEAVE),
      () => {
        mockLearnerData.classroom = {
          joined: false,
          classInfo: null,
          assignments: [],
        };
        return mockSuccess({ success: true, message: 'Đã rời lớp học thành công' });
      },
      'leaveClassroom'
    );
  },

  // -------------------------------------------------------------
  // 6. NHIỆM VỤ HÀNG NGÀY (DAILY QUESTS)
  // -------------------------------------------------------------
  async getDailyQuests() {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.QUESTS.DAILY),
      () =>
        mockSuccess({
          dateKey: new Date().toISOString().split('T')[0],
          resetInSeconds: 3600,
          quests: [],
        }),
      'getDailyQuests'
    );
  },

  async claimDailyQuest(questId) {
    return await apiClient.post(API_ENDPOINTS.QUESTS.CLAIM(questId));
  },

  // -------------------------------------------------------------
  // 7. CỬA HÀNG ĐỔI THƯỞNG (SHOP REWARDS)
  // -------------------------------------------------------------
  async getShopItems() {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.SHOP.ITEMS),
      () =>
        mockSuccess({
          totalXp: 0,
          hearts: 5,
          streakFreezeCount: 0,
          isPro: false,
          items: [],
        }),
      'getShopItems'
    );
  },

  async purchaseShopItem(itemId) {
    return await apiClient.post(API_ENDPOINTS.SHOP.PURCHASE, { itemId });
  },

  // -------------------------------------------------------------
  // 8. HUY HIỆU DANH HIỆU (ACHIEVEMENTS)
  // -------------------------------------------------------------
  async getAchievements() {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.ACHIEVEMENTS.LIST),
      () => mockSuccess({ totalBadges: 8, unlockedBadgesCount: 0, badges: [] }),
      'getAchievements'
    );
  },

  // -------------------------------------------------------------
  // 9. CẨM NANG AN TOÀN SỐNG (SAFETY HANDBOOK)
  // -------------------------------------------------------------
  async getHandbook(pillar = null, search = null) {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.HANDBOOK.LIST(pillar, search)),
      () => mockSuccess({ pillars: [], emergencyHotlines: [], articles: [] }),
      'getHandbook'
    );
  },

  async getHandbookArticle(id) {
    return await apiClient.get(API_ENDPOINTS.HANDBOOK.DETAIL(id));
  },

  // -------------------------------------------------------------
  // 10. HỒ SƠ THẬT & THỐNG KÊ HỌC TẬP (PROFILE & STUDY STATS)
  // -------------------------------------------------------------
  async getStudyStats() {
    return withMockFallback(
      () => apiClient.get(API_ENDPOINTS.USERS.STUDY_STATS),
      () =>
        mockSuccess({
          totalMinutesLearned: 0,
          totalLessonsCompleted: 0,
          totalXp: 0,
          currentStreak: 0,
          weeklyStats: [],
          skillRadar: [],
          recentBadges: [],
        }),
      'getStudyStats'
    );
  },

  async updateProfile(profileData) {
    return await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
  },
};
