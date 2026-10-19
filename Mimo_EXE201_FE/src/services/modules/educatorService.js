import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { mockSuccess } from '../mocks/mockHelper';
import { mockEducatorData } from '../mocks/mockEducator';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const educatorService = {
  async getClasses() {
    if (USE_MOCK) {
      return mockSuccess(mockEducatorData.classes);
    }
    return apiClient.get(API_ENDPOINTS.EDUCATOR.CLASSES);
  },
};
