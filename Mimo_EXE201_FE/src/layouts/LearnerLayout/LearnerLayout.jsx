import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LearnerSidebar from './LearnerSidebar';
import LearnerTopHeader from './LearnerTopHeader';
import LearnerRightWidgets from './LearnerRightWidgets';
import { learnerService } from '../../services/modules/learnerService';

export default function LearnerLayout() {
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeDomain, setActiveDomain] = useState('first_aid');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    learnerService
      .getDashboardData()
      .then((res) => {
        setDashboardData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching learner dashboard data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Xác định xem trang hiện tại có nên hiển thị Cột tiện ích bên phải không
  // Mặc định: trang lộ trình chính (/learn) sẽ hiển thị 3 cột chuẩn
  const isMapPage = location.pathname === '/learn';
  const isUpgradePage = location.pathname === '/learn/upgrade';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-page)',
        fontFamily: 'var(--font-family)',
        color: 'var(--text-main)',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      {/* 1. THANH ĐIỀU HƯỚNG TRÁI CỐ ĐỊNH (LEFT SIDEBAR - 270px) */}
      <LearnerSidebar
        activeDomain={activeDomain}
        onSelectDomain={(domId) => setActiveDomain(domId)}
        domains={dashboardData?.domains || []}
      />

      {/* 2. KHU VỰC TRUNG TÂM & CỘT PHẢI */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* THANH TRẠNG THÁI TRÊN CÙNG (STATS BAR) */}
        <LearnerTopHeader
          stats={dashboardData?.stats}
          domains={dashboardData?.domains || []}
          activeDomain={activeDomain}
          onSelectDomain={(domId) => setActiveDomain(domId)}
        />

        {/* THÂN CHÍNH: CỘT GIỮA + CỘT PHẢI WIDGETS */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {/* CỘT NỘI DUNG CHÍNH */}
          <main
            style={{
              flex: 1,
              maxWidth: isMapPage ? '640px' : isUpgradePage ? '1180px' : '980px',
              padding: isMapPage ? '28px 16px' : '28px 32px',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#0EA5E9', fontWeight: 700 }}>
                <img
                  src="/images/mascot.png"
                  alt="Mimo Mascot"
                  className="anim-float"
                  style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '12px' }}
                />
                <div>Đang nạp dữ liệu bài học an toàn...</div>
              </div>
            ) : (
              <Outlet
                context={{
                  data: dashboardData,
                  activeDomain,
                  setActiveDomain,
                  refreshData: fetchDashboardData,
                }}
              />
            )}
          </main>

          {/* CỘT TIỆN ÍCH BÊN PHẢI (340px) */}
          {isMapPage && !loading && (
            <LearnerRightWidgets
              leaderboard={dashboardData?.leaderboard}
              dailyQuests={dashboardData?.dailyQuests || []}
              weeklyTip={dashboardData?.weeklyTip}
              onClaimQuest={(questId) => {
                learnerService.claimQuest(questId).then(() => fetchDashboardData());
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
