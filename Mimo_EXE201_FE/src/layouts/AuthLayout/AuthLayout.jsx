import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AuthLayout: Khung bọc cho các trang Login, Register, Forgot Password
 */
export default function AuthLayout() {
  return <Outlet />;
}
