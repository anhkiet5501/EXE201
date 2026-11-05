import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LearnerSidebar from './LearnerSidebar';
import LearnerTopHeader from './LearnerTopHeader';
import LearnerRightWidgets from './LearnerRightWidgets';
import RoleSwitcher from '../../components/common/RoleSwitcher';
import { learnerService } from '../../services/modules/learnerService';
import { mockLearnerData } from '../../services/mocks/mockLearner';
import { USE_MOCK, getApiErrorMessage } from '../../services/api/mockConfig';

// Ở chế độ thật: không dùng cây kỹ năng / chủ đề / bảng xếp hạng mẫu làm giá trị ban đầu
const initialDashboardData = USE_MOCK
  ? mockLearnerData
  : { ...mockLearnerData, domains: [], units: [], unitsByDomain: {}, leaderboard: undefined };

export default function LearnerLayout() {
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [activeDomain, setActiveDomain] = useState('first_aid');
  const [loading, setLoading] = useState(!USE_MOCK);
  const [loadError, setLoadError] = useState('');

  // Chuẩn hóa DTO cây lộ trình từ Backend sang cấu trúc UI của LearnerMapPage
  const mapLearningPathToUnits = (pathData) => {
    if (!pathData?.units || !Array.isArray(pathData.units)) return [];
    return pathData.units.map((unit) => ({
      id: unit.id,
      unitNumber: unit.order,
      title: unit.title,
      description: unit.description,
      themeColor: unit.order === 1 ? '#22C55E' : unit.order === 2 ? '#3B82F6' : '#F59E0B',
      lessons: (unit.nodes || []).map((node, idx) => ({
        id: node.id,
        title: node.title,
        subtitle: `Bài học an toàn • +${node.xpReward || 10} XP`,
        type: (node.type || 'lesson').toLowerCase(),
        order: node.order,
        rewardXp: node.xpReward || 10,
        status:
          node.userProgressStatus === 'current'
            ? 'active'
            : node.userProgressStatus === 'done'
            ? 'completed'
            : 'locked',
        icon:
          node.type === 'chest'
            ? '🎁'
            : node.type === 'boss'
            ? '👑'
            : idx % 2 === 0
            ? '🩹'
            : '🔥',
        questionsCount: 3,
        duration: '~3 phút',
      })),
    }));
  };

  const fetchDashboardData = async (selectedDomainId = null) => {
    setLoadError('');
    try {
      // 1. Lấy danh sách domains từ Backend
      const domainsRes = await learnerService.getDomains();
      const rawDomains = domainsRes.data || [];
      const domainList = rawDomains.length > 0 ? rawDomains : (dashboardData?.domains || []);

      // 2. Xác định domain cần tải lộ trình (chỉ truyền GUID thật, nếu không có truyền null để BE lấy mặc định)
      const isGuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
      const targetDomainId = isGuid(selectedDomainId)
        ? selectedDomainId
        : isGuid(activeDomain)
        ? activeDomain
        : isGuid(domainList[0]?.id)
        ? domainList[0].id
        : null;

      // 3. Tải song song Learning Path và Leaderboard
      const [pathRes, lbRes] = await Promise.all([
        learnerService.getLearningPath(targetDomainId),
        learnerService.getWeeklyLeaderboard(),
      ]);

      const pathData = pathRes?.data;
      const formattedUnits = pathData ? mapLearningPathToUnits(pathData) : [];

      setDashboardData((prev) => ({
        ...prev,
        domains: domainList,
        learningPath: pathData,
        units: USE_MOCK
          ? (formattedUnits.length > 0 ? formattedUnits : (prev?.units?.length > 0 ? prev.units : mockLearnerData.units))
          : formattedUnits,
        leaderboard: lbRes?.data || prev?.leaderboard,
      }));

      // Cập nhật activeDomain theo ID thật của lộ trình vừa nhận được
      if (pathData?.id) {
        setActiveDomain(pathData.id);
      } else if (targetDomainId && targetDomainId !== activeDomain) {
        setActiveDomain(targetDomainId);
      }
    } catch (err) {
      console.error('Error fetching learner dashboard data:', err);
      setLoadError(getApiErrorMessage(err, 'Không tải được dữ liệu từ máy chủ.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDomain = (domId) => {
    setActiveDomain(domId);
    setLoading(true);
    fetchDashboardData(domId);
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
        onSelectDomain={handleSelectDomain}
        domains={dashboardData?.domains || []}
      />

      {/* 2. KHU VỰC TRUNG TÂM & CỘT PHẢI */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* THANH TRẠNG THÁI TRÊN CÙNG (STATS BAR) */}
        <LearnerTopHeader
          stats={dashboardData?.stats}
          domains={dashboardData?.domains || []}
          activeDomain={activeDomain}
          onSelectDomain={handleSelectDomain}
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
              <>
              {loadError && (
                <div
                  style={{
                    padding: '12px 16px',
                    marginBottom: '16px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '12px',
                    color: '#B91C1C',
                    fontSize: '13.5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span>⚠️ {loadError} Máy chủ có thể đang khởi động, hãy thử lại sau vài giây.</span>
                  <button
                    onClick={() => {
                      setLoading(true);
                      fetchDashboardData();
                    }}
                    style={{ border: 'none', background: '#DC2626', color: '#fff', borderRadius: '8px', padding: '6px 12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Thử lại
                  </button>
                </div>
              )}
              <Outlet
                context={{
                  data: dashboardData,
                  activeDomain,
                  setActiveDomain,
                  refreshData: fetchDashboardData,
                }}
              />
              </>
            )}
          </main>

          {/* CỘT TIỆN ÍCH BÊN PHẢI (340px) */}
          {isMapPage && !loading && (
            <LearnerRightWidgets
              leaderboard={dashboardData?.leaderboard}
              dailyQuests={dashboardData?.dailyQuests || []}
              weeklyTip={dashboardData?.weeklyTip}
              onClaimQuest={(questId) => {
                learnerService.claimQuest(questId).then(() => fetchDashboardData()).catch((err) => setLoadError(getApiErrorMessage(err, 'Không nhận được thưởng nhiệm vụ.')));
              }}
            />
          )}
        </div>
      </div>
      <RoleSwitcher />
    </div>
  );
}
