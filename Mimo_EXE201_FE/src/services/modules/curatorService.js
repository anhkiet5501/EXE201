import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { mockSuccess } from '../mocks/mockHelper';
import { mockCuratorData } from '../mocks/mockCurator';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const curatorService = {
  async getMyCourses() {
    if (USE_MOCK) {
      return mockSuccess(mockCuratorData.myCourses);
    }
    return apiClient.get(API_ENDPOINTS.CURATOR.COURSES);
  },
};
