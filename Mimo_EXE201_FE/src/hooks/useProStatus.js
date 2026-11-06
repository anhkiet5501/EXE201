import { useAuth } from '../contexts/AuthContext';

/**
 * Trạng thái Mimo Pro của người dùng hiện tại. Nguồn dữ liệu: /auth/me (Backend) qua AuthContext.
 * Backend là nguồn sự thật; hook chỉ đọc lại để hiển thị.
 */
export function useProStatus() {
  const { user } = useAuth();

  const isPro = user?.isPro === true;
  const expiresAt = user?.proExpiresAt ? new Date(user.proExpiresAt) : null;
  const msLeft = expiresAt ? expiresAt.getTime() - new Date().getTime() : null;
  const daysLeft = msLeft === null ? null : Math.max(0, Math.ceil(msLeft / 86400000));

  return {
    isPro,
    planCode: user?.planCode || 'FREE',
    planName: isPro ? user?.planName || 'Mimo Pro' : 'Mimo Free',
    expiresAt,
    daysLeft,
    streakFreezes: user?.streakFreezeCount ?? 0,
  };
}

export default useProStatus;
