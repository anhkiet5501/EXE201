import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const paymentService = {
  /**
   * Tạo đơn chuyển khoản (SePay + VietQR) cho gói Mimo Pro.
   * @param {string} planCode Mã gói (PREMIUM_1M, PREMIUM_3M, PREMIUM_6M)
   * @returns {Promise<{ data: { txnRef, planCode, planName, amount, transferContent, bankCode, accountNumber, accountName, qrUrl, expiresAt, status } }>}
   */
  async createOrder(planCode) {
    return apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_ORDER, { planCode });
  },

  /**
   * Trạng thái đơn: Pending | Success | Failed | Refunded | Expired
   * @param {string} txnRef Mã đơn (cũng là nội dung chuyển khoản)
   */
  async getOrderStatus(txnRef) {
    return apiClient.get(API_ENDPOINTS.PAYMENT.ORDER_STATUS(txnRef));
  },

  /** Lịch sử giao dịch thanh toán của người dùng hiện tại */
  async getPaymentHistory() {
    return apiClient.get(API_ENDPOINTS.PAYMENT.HISTORY);
  },

  /** Tương thích luồng VNPay cũ: gửi tham số vnp_* để Backend xác thực chữ ký */
  async verifyVnPayReturn(queryString) {
    const q = queryString.startsWith('?') ? queryString : `?${queryString}`;
    return apiClient.get(`${API_ENDPOINTS.PAYMENT.VNPAY_RETURN}${q}&json=true`);
  },
};
