import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { mockSuccess } from '../mocks/mockHelper';
import { mockLearnerData, mockLessonCutQuestions, mockClassroomsDatabase } from '../mocks/mockLearner';

// Mặc định cho phép fallback mock data khi chạy local demo nếu backend chưa sẵn sàng
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const learnerService = {
  async getDashboardData() {
    if (USE_MOCK) {
      return mockSuccess(mockLearnerData);
    }
    try {
      return await apiClient.get(API_ENDPOINTS.LEARNER.MAP_NODES);
    } catch {
      return mockSuccess(mockLearnerData);
    }
  },

  async getLessonDetail(lessonId) {
    if (USE_MOCK) {
      return mockSuccess({
        id: lessonId,
        title: 'Bài 2: Vết thương chảy máu & Cầm máu',
        unitTitle: 'Chặng 1: Xử lý Vết thương & Bỏng sinh hoạt',
        questions: mockLessonCutQuestions,
      });
    }
    try {
      return await apiClient.get(API_ENDPOINTS.LEARNER.LESSON_DETAIL(lessonId));
    } catch {
      return mockSuccess({
        id: lessonId,
        title: 'Bài 2: Vết thương chảy máu & Cầm máu',
        unitTitle: 'Chặng 1: Xử lý Vết thương & Bỏng sinh hoạt',
        questions: mockLessonCutQuestions,
      });
    }
  },

  async claimQuest(questId) {
    if (USE_MOCK) {
      return mockSuccess({ success: true, message: 'Nhận thưởng thành công!' });
    }
    return apiClient.post('/api/learner/quests/claim', { questId });
  },

  async joinClassroom(code) {
    if (USE_MOCK) {
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

      const error = new Error('Mã lớp học không hợp lệ hoặc không tồn tại trong hệ thống liên kết!');
      throw error;
    }
    return apiClient.post('/api/learner/classroom/join', { code });
  },

  async leaveClassroom() {
    if (USE_MOCK) {
      mockLearnerData.classroom = {
        joined: false,
        classInfo: null,
        assignments: [],
      };
      return mockSuccess({ success: true, message: 'Đã rời lớp học thành công' });
    }
    return apiClient.post('/api/learner/classroom/leave');
  },
};
