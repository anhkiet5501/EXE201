import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { mockSuccess } from '../mocks/mockHelper';
import { mockCuratorData } from '../mocks/mockCurator';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // default true for FE development

export const curatorService = {
  // 1. Thông tin chuyên gia
  async getProfile() {
    if (USE_MOCK) {
      return mockSuccess(mockCuratorData.currentCurator);
    }
    return apiClient.get('/curator/profile');
  },

  // 2. Danh sách kịch bản (Module 1)
  async getScenarios() {
    if (USE_MOCK) {
      return mockSuccess(mockCuratorData.scenarios);
    }
    return apiClient.get(API_ENDPOINTS.CURATOR.COURSES);
  },

  // Legacy alias
  async getMyCourses() {
    return this.getScenarios();
  },

  // 3. Chi tiết kịch bản đang soạn (Module 2)
  async getScenarioDetail(scenarioId) {
    if (USE_MOCK) {
      return mockSuccess(mockCuratorData.builderActiveScenario);
    }
    return apiClient.get(`/curator/scenarios/${scenarioId}`);
  },

  async saveScenario(scenarioData) {
    if (USE_MOCK) {
      return mockSuccess({ ...scenarioData, updatedAt: new Date().toISOString().split('T')[0] });
    }
    return apiClient.post('/curator/scenarios', scenarioData);
  },

  async submitForReview(scenarioId) {
    if (USE_MOCK) {
      return mockSuccess({ scenarioId, status: 'PENDING', message: 'Kịch bản đã được gửi đến Hội đồng Thẩm định Y khoa và Super Admin!' });
    }
    return apiClient.post(`/curator/scenarios/${scenarioId}/submit-review`);
  },

  // 4. Kho Media & Assets (Module 3)
  async getMediaAssets() {
    if (USE_MOCK) {
      return mockSuccess(mockCuratorData.mediaAssets);
    }
    return apiClient.get('/curator/assets');
  },

  async uploadAsset(assetData) {
    if (USE_MOCK) {
      const newAsset = {
        id: `asset_${Date.now()}`,
        usageCount: 0,
        safeLevel: 'SAFE_EDUCATIONAL',
        ...assetData,
      };
      return mockSuccess(newAsset);
    }
    return apiClient.post('/curator/assets', assetData);
  },

  // 5. Phân tích hiệu quả & độ khó (Module 4)
  async getAnalytics(scenarioId) {
    if (USE_MOCK) {
      return mockSuccess(mockCuratorData.analytics);
    }
    return apiClient.get(`/curator/analytics/${scenarioId}`);
  },

  // 6. Góp ý chuyên môn & Peer Review (Module 5)
  async getExpertFeedbacks() {
    if (USE_MOCK) {
      return mockSuccess(mockCuratorData.expertFeedbacks);
    }
    return apiClient.get('/curator/feedback');
  },

  async resolveFeedback(feedbackId, resolutionNote) {
    if (USE_MOCK) {
      return mockSuccess({ feedbackId, resolutionNote, status: 'RESOLVED' });
    }
    return apiClient.post(`/curator/feedback/${feedbackId}/resolve`, { resolutionNote });
  },

  // 7. Quy chuẩn biên soạn (Module 6)
  async getGuidelines() {
    if (USE_MOCK) {
      return mockSuccess(mockCuratorData.guidelines);
    }
    return apiClient.get('/curator/guidelines');
  },
};
