/**
 * Helper hỗ trợ tạo Mock Data giả lập mạng thực tế (có độ trễ delay)
 */
export const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockSuccess = async (data, delayMs = 400) => {
  await mockDelay(delayMs);
  return {
    success: true,
    data,
  };
};

export const mockError = async (message, status = 400, delayMs = 400) => {
  await mockDelay(delayMs);
  const error = new Error(message);
  error.response = {
    status,
    data: { message, success: false },
  };
  throw error;
};
