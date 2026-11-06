import apiClient from '../api/apiClient';

/**
 * Quyền lợi dành riêng cho thành viên Mimo Pro. Backend kiểm tra Pro (403 nếu không phải Pro).
 */
export const proService = {
  /** GET /api/v1/pro/risk-report: báo cáo rủi ro an toàn 30 ngày */
  async getRiskReport() {
    return apiClient.get('/pro/risk-report');
  },

  /** GET /api/v1/pro/deep-review: các câu từng làm sai (không kèm đáp án) */
  async getDeepReview() {
    return apiClient.get('/pro/deep-review');
  },

  /** POST /api/v1/pro/deep-review/answer: chấm điểm ở server, trả lời giải thích */
  async answerDeepReview({ questionId, submittedAnswer }) {
    return apiClient.post('/pro/deep-review/answer', { questionId, submittedAnswer });
  },
};
