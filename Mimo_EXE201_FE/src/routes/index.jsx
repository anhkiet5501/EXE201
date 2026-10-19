import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import LearnerLayout from '../layouts/LearnerLayout/LearnerLayout';
import CuratorLayout from '../layouts/CuratorLayout/CuratorLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import BusinessLayout from '../layouts/BusinessLayout/BusinessLayout';

// Business Pages
import BusinessDashboard from '../pages/business/BusinessDashboard';
import BusinessClassesPage from '../pages/business/BusinessClassesPage';
import BusinessTeachersPage from '../pages/business/BusinessTeachersPage';
import BusinessCampaignsPage from '../pages/business/BusinessCampaignsPage';
import BusinessSkillGapPage from '../pages/business/BusinessSkillGapPage';
import BusinessReportsPage from '../pages/business/BusinessReportsPage';
import BusinessBillingPage from '../pages/business/BusinessBillingPage';

// Guards
import RoleGuard from '../components/guards/RoleGuard';

// Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Learner Pages
import LearnerMapPage from '../pages/learner/LearnerMapPage';
import QuestsPage from '../pages/learner/QuestsPage';
import LeaderboardPage from '../pages/learner/LeaderboardPage';
import ShopRewardPage from '../pages/learner/ShopRewardPage';
import ProfileLearnerPage from '../pages/learner/ProfileLearnerPage';
import AchievementsPage from '../pages/learner/AchievementsPage';
import SafetyHandbookPage from '../pages/learner/SafetyHandbookPage';
import MyClassroomPage from '../pages/learner/MyClassroomPage';
import PracticeRoomPage from '../pages/learner/PracticeRoomPage';
import LessonPlayPage from '../pages/learner/LessonPlayPage';
import UpgradePlanPage from '../pages/learner/UpgradePlanPage';

// Curator Pages
import StudioDashboard from '../pages/curator/StudioDashboard';
import CuratorBuilderPage from '../pages/curator/CuratorBuilderPage';
import CuratorAssetsPage from '../pages/curator/CuratorAssetsPage';
import CuratorAnalyticsPage from '../pages/curator/CuratorAnalyticsPage';
import CuratorFeedbackPage from '../pages/curator/CuratorFeedbackPage';
import CuratorGuidelinesPage from '../pages/curator/CuratorGuidelinesPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminApprovalsPage from '../pages/admin/AdminApprovalsPage';
import AdminGamificationPage from '../pages/admin/AdminGamificationPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminSchoolsPage from '../pages/admin/AdminSchoolsPage';
import AdminFeedbackPage from '../pages/admin/AdminFeedbackPage';
import AdminMonetizationPage from '../pages/admin/AdminMonetizationPage';

// Error Pages
import Forbidden403 from '../pages/error/Forbidden403';
import NotFound404 from '../pages/error/NotFound404';

export const router = createBrowserRouter([
  // 1. CÁC TRANG CỘNG ĐỒNG / PUBLIC
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },

  // 2. CÁC TRANG AUTH (LOGIN, REGISTER, QUÊN MẬT KHẨU)
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  // 3. PHÂN HỆ HỌC VIÊN (LEARNER & GIÁO VIÊN HỌC TRẢI NGHIỆM)
  {
    path: '/learn',
    element: <RoleGuard allowedRoles={['LEARNER', 'EDUCATOR', 'ADMIN']} />,
    children: [
      // Chế độ chơi tình huống Zen Mode (Không có Sidebar để tập trung 100%)
      { path: 'lesson/:lessonId', element: <LessonPlayPage /> },
      {
        element: <LearnerLayout />,
        children: [
          { index: true, element: <LearnerMapPage /> },
          { path: 'quests', element: <QuestsPage /> },
          { path: 'leaderboard', element: <LeaderboardPage /> },
          { path: 'handbook', element: <SafetyHandbookPage /> },
          { path: 'classroom', element: <MyClassroomPage /> },
          { path: 'practice', element: <PracticeRoomPage /> },
          { path: 'shop', element: <ShopRewardPage /> },
          { path: 'achievements', element: <AchievementsPage /> },
          { path: 'profile', element: <ProfileLearnerPage /> },
          { path: 'upgrade', element: <UpgradePlanPage /> },
        ],
      },
    ],
  },

  // 4. PHÂN HỆ TÁC GIẢ SÁNG TẠO NỘI DUNG (CURATOR STUDIO)
  {
    path: '/studio',
    element: <RoleGuard allowedRoles={['CURATOR', 'ADMIN']} />,
    children: [
      {
        element: <CuratorLayout />,
        children: [
          { index: true, element: <StudioDashboard /> },
          { path: 'builder', element: <CuratorBuilderPage /> },
          { path: 'editor', element: <CuratorBuilderPage /> },
          { path: 'courses', element: <StudioDashboard /> },
          { path: 'assets', element: <CuratorAssetsPage /> },
          { path: 'analytics', element: <CuratorAnalyticsPage /> },
          { path: 'feedback', element: <CuratorFeedbackPage /> },
          { path: 'guidelines', element: <CuratorGuidelinesPage /> },
        ],
      },
    ],
  },

  // 5. PHÂN HỆ QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN)
  {
    path: '/admin',
    element: <RoleGuard allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'approvals', element: <AdminApprovalsPage /> },
          { path: 'gamification', element: <AdminGamificationPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'schools', element: <AdminSchoolsPage /> },
          { path: 'feedback', element: <AdminFeedbackPage /> },
          { path: 'monetization', element: <AdminMonetizationPage /> },
        ],
      },
    ],
  },

  // 6. PHÂN HỆ DOANH NGHIỆP & TRƯỜNG HỌC (BUSINESS / ENTERPRISE)
  {
    path: '/business',
    element: <RoleGuard allowedRoles={['ADMIN', 'EDUCATOR', 'LEARNER']} />,
    children: [
      {
        element: <BusinessLayout />,
        children: [
          { index: true, element: <BusinessDashboard /> },
          { path: 'classes', element: <BusinessClassesPage /> },
          { path: 'teachers', element: <BusinessTeachersPage /> },
          { path: 'campaigns', element: <BusinessCampaignsPage /> },
          { path: 'skill-gap', element: <BusinessSkillGapPage /> },
          { path: 'reports', element: <BusinessReportsPage /> },
          { path: 'billing', element: <BusinessBillingPage /> },
        ],
      },
    ],
  },

  // 7. CÁC TRANG LỖI
  { path: '/403', element: <Forbidden403 /> },
  { path: '*', element: <NotFound404 /> },
]);
