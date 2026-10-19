import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Guard kiểm tra đăng nhập và quyền (Role)
 * @param {Array<string>} allowedRoles - Danh sách role được phép vào (ví dụ: ['LEARNER', 'ADMIN'])
 */
export const RoleGuard = ({ allowedRoles = [] }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // 1. Chưa đăng nhập -> Đá về /login (lưu location để login xong quay lại nếu cần)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Đã đăng nhập nhưng không có role hoặc role không khớp -> Đá về trang 403 Forbidden
  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/403" replace />;
  }

  // 3. Đúng quyền -> Cho phép render các trang con
  return <Outlet />;
};

export default RoleGuard;
