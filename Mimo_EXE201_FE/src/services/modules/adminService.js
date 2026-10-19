import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { mockSuccess } from '../mocks/mockHelper';
import { mockAdminData } from '../mocks/mockAdmin';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const adminService = {
  // 1. Dashboard & Metrics
  async getAnalytics() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getMetrics());
    }
    return apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  },

  async getSkillGaps() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getSkillGaps());
    }
    return apiClient.get('/admin/skill-gaps');
  },

  async broadcastSkillAlert(topicId, customMessage) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.broadcastSkillAlert(topicId, customMessage));
    }
    return apiClient.post('/admin/broadcast-alert', { topicId, customMessage });
  },

  // 2. Content Approvals
  async getPendingReviews() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getReviews());
    }
    return apiClient.get(API_ENDPOINTS.ADMIN.APPROVALS);
  },

  async approveReview(reviewId) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.approveReview(reviewId));
    }
    return apiClient.post(`${API_ENDPOINTS.ADMIN.APPROVALS}/${reviewId}/approve`);
  },

  async rejectReview(reviewId, reason) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.rejectReview(reviewId, reason));
    }
    return apiClient.post(`${API_ENDPOINTS.ADMIN.APPROVALS}/${reviewId}/reject`, { reason });
  },

  async rollbackReview(reviewId) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.rollbackReview(reviewId));
    }
    return apiClient.post(`${API_ENDPOINTS.ADMIN.APPROVALS}/${reviewId}/rollback`);
  },

  async getCurators() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getCurators());
    }
    return apiClient.get('/admin/curators');
  },

  // 3. Gamification Settings
  async getGamificationSettings() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getSettings());
    }
    return apiClient.get(API_ENDPOINTS.ADMIN.SETTINGS);
  },

  async saveGamificationSettings(settings) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.saveSettings(settings));
    }
    return apiClient.put(API_ENDPOINTS.ADMIN.SETTINGS, settings);
  },

  async resetGamificationSettings() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.resetSettings());
    }
    return apiClient.post(`${API_ENDPOINTS.ADMIN.SETTINGS}/reset`);
  },

  // 4. Users & CSKH Support
  async getUsers() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getUsers());
    }
    return apiClient.get(API_ENDPOINTS.ADMIN.USERS);
  },

  async rescueUserStreak(userId) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.rescueStreak(userId));
    }
    return apiClient.post(`/admin/users/${userId}/rescue-streak`);
  },

  async refillUserHearts(userId) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.refillHearts(userId));
    }
    return apiClient.post(`/admin/users/${userId}/refill-hearts`);
  },

  async rewardUserXP(userId, amount) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.rewardXP(userId, amount));
    }
    return apiClient.post(`/admin/users/${userId}/reward-xp`, { amount });
  },

  async toggleUserBan(userId) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.toggleBanUser(userId));
    }
    return apiClient.post(`/admin/users/${userId}/toggle-ban`);
  },

  // 5. Schools B2B
  async getSchools() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getSchools());
    }
    return apiClient.get('/admin/schools');
  },

  async createSchoolContract(schoolData) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.createSchool(schoolData));
    }
    return apiClient.post('/admin/schools', schoolData);
  },

  async generateClassCodes(schoolId, count) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.generateClassCodes(schoolId, count));
    }
    return apiClient.post(`/admin/schools/${schoolId}/generate-classes`, { count });
  },

  // 6. Feedback & Tickets
  async getFeedbacks() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getFeedbacks());
    }
    return apiClient.get('/admin/feedbacks');
  },

  async resolveFeedback(feedbackId, xpGift) {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.resolveFeedback(feedbackId, xpGift));
    }
    return apiClient.post(`/admin/feedbacks/${feedbackId}/resolve`, { xpGift });
  },

  // 7. Monetization & Billing
  async getMonetizationData() {
    if (USE_MOCK) {
      return mockSuccess(mockAdminData.getMonetization());
    }
    return apiClient.get('/admin/monetization');
  },
};
