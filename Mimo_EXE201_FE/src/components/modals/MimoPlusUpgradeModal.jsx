import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Trước đây là modal "giả lập quét QR" tự ghi cờ Pro vào localStorage.
 * Nay chuyển người dùng sang trang nâng cấp thật (/learn/upgrade): thanh toán QR qua SePay,
 * quyền Pro chỉ được cấp khi Backend xác nhận đã nhận tiền.
 */
export default function MimoPlusUpgradeModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      if (onClose) onClose();
      navigate('/learn/upgrade');
    }
  }, [isOpen, onClose, navigate]);

  return null;
}
