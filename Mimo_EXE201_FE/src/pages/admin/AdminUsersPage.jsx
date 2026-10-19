import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/modules/adminService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [filterLostStreak, setFilterLostStreak] = useState(false);

  // User 360 Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    adminService.getUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRescueStreak = (userId, userName) => {
    sound.playVictory();
    fireConfetti();
    adminService.rescueUserStreak(userId).then((res) => {
      setUsers(res.data);
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, streak: prev.maxStreak, lostStreakRecently: false }));
      }
      showToast(`🔥 Đã cứu chuỗi Streak thành công cho ${userName}! Ngọn lửa đã bùng cháy trở lại.`);
    });
  };

  const handleRefillHearts = (userId, userName) => {
    sound.playClick();
    adminService.refillUserHearts(userId).then((res) => {
      setUsers(res.data);
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, hearts: 5 }));
      }
      showToast(`❤️ Đã nạp đầy 5 Trái Tim sinh tồn cho ${userName}!`);
    });
  };

  const handleRewardXP = (userId, userName, amount = 100) => {
    sound.playClick();
    adminService.rewardUserXP(userId, amount).then((res) => {
      setUsers(res.data);
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, xp: prev.xp + amount }));
      }
      showToast(`🎁 Đã tặng +${amount} XP tri ân cho ${userName}!`);
    });
  };

  const handleToggleBan = (userId, userName) => {
    sound.playClick();
    adminService.toggleUserBan(userId).then((res) => {
      setUsers(res.data);
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, status: prev.status === 'BANNED' ? 'ACTIVE' : 'BANNED' }));
      }
      showToast(`🚫 Đã cập nhật trạng thái truy cập cho ${userName}.`);
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === 'ALL' || u.plan === filterPlan;
    const matchLostStreak = !filterLostStreak || u.lostStreakRecently;
    return matchSearch && matchPlan && matchLostStreak;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Đang tải danh bạ người dùng...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* TOAST THÔNG BÁO */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 999999,
          fontWeight: 700,
          fontSize: '13.5px',
        }}>
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#0F172A', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
              MODULE 4
            </span>
            <span style={{ color: '#0284C7', fontWeight: 700, fontSize: '13px' }}>
              User Directory &amp; CSKH Support 360
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            👥 Quản Lý Người Dùng &amp; Trung Tâm CSKH 360
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0' }}>
            Hỗ trợ giải quyết khiếu nại đứt chuỗi Streak, nạp Tim khẩn cấp và kiểm soát gian lận điểm số.
          </p>
        </div>

        {/* THỐNG KÊ NHANH */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Tổng Học Viên</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>{users.length}</div>
          </div>
          <div style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 700 }}>Cần Cứu Chuỗi</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#D97706' }}>
              {users.filter((u) => u.lostStreakRecently).length}
            </div>
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E2E8F0',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
          <span style={{ fontSize: '16px', color: '#64748B' }}>🔍</span>
          <input
            type="text"
            placeholder="Tìm theo tên học viên, email hoặc trường học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '13.5px', color: '#0F172A' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              fontWeight: 700,
              background: '#F8FAFC',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">Tất cả gói cước</option>
            <option value="FREE">Tài khoản Miễn phí</option>
            <option value="PRO">MIMO Plus / Pro</option>
            <option value="SCHOOL_LICENSE">Bản quyền Trường học</option>
          </select>

          <button
            type="button"
            onClick={() => setFilterLostStreak(!filterLostStreak)}
            style={{
              background: filterLostStreak ? '#FEF3C7' : '#FFFFFF',
              color: filterLostStreak ? '#B45309' : '#475569',
              border: `1.5px solid ${filterLostStreak ? '#F59E0B' : '#CBD5E1'}`,
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔥</span>
            <span>Chỉ xem khiếu nại đứt chuỗi ({users.filter((u) => u.lostStreakRecently).length})</span>
          </button>
        </div>
      </div>

      {/* BẢNG DANH SÁCH NGƯỜI DÙNG */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Học Viên</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Trường / Tổ chức</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Chuỗi Streak</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Tim</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Điểm XP</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Gói Cước</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Trạng Thái</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 800, color: '#64748B', textAlign: 'center' }}>Hành Động CSKH</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={u.avatar}
                      alt={u.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13.5px' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                  {u.schoolName}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {u.lostStreakRecently ? (
                    <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                      ⚠️ Mất {u.maxStreak} ngày
                    </span>
                  ) : (
                    <span style={{ fontWeight: 800, color: u.streak > 0 ? '#F97316' : '#94A3B8', fontSize: '13.5px' }}>
                      🔥 {u.streak} ngày
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#EF4444', fontSize: '13px' }}>
                  ❤️ {u.hearts}/5
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#F59E0B', fontSize: '13.5px' }}>
                  ⭐ {u.xp.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: u.plan === 'PRO' ? '#DCFCE7' : (u.plan === 'SCHOOL_LICENSE' ? '#EFF6FF' : '#F1F5F9'),
                    color: u.plan === 'PRO' ? '#15803D' : (u.plan === 'SCHOOL_LICENSE' ? '#0284C7' : '#64748B'),
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}>
                    {u.plan}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {u.status === 'ACTIVE' && (
                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                      ✓ Hoạt động
                    </span>
                  )}
                  {u.status === 'SUSPICIOUS' && (
                    <span style={{ background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                      ⚠️ Nghi vấn Bot
                    </span>
                  )}
                  {u.status === 'BANNED' && (
                    <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                      ✕ Đã Khóa
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      type="button"
                      title="Xem hồ sơ chi tiết 360"
                      onClick={() => { sound.playClick(); setSelectedUser(u); }}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '12px',
                        color: '#334155',
                      }}
                    >
                      👁️ Chi tiết
                    </button>

                    {u.lostStreakRecently && (
                      <button
                        type="button"
                        title="Cứu chuỗi Streak khẩn cấp"
                        onClick={() => handleRescueStreak(u.id, u.name)}
                        style={{
                          background: '#F97316',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '12px',
                          boxShadow: '0 2px 6px rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        🔥 Cứu Chuỗi
                      </button>
                    )}

                    <button
                      type="button"
                      title="Nạp đầy 5 tim"
                      onClick={() => handleRefillHearts(u.id, u.name)}
                      style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '12px',
                      }}
                    >
                      ❤️ +5
                    </button>

                    <button
                      type="button"
                      title={u.status === 'BANNED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                      onClick={() => handleToggleBan(u.id, u.name)}
                      style={{
                        background: u.status === 'BANNED' ? '#DCFCE7' : '#F1F5F9',
                        color: u.status === 'BANNED' ? '#15803D' : '#64748B',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '12px',
                      }}
                    >
                      {u.status === 'BANNED' ? '🔓 Mở' : '🚫 Khóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL USER 360 VIEW */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(5px)',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '560px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F1F5F9' }}
                />
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    {selectedUser.name}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>{selectedUser.email}</div>
                  <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 700, marginTop: '2px' }}>
                    🏫 {selectedUser.schoolName}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                ✕
              </button>
            </div>

            {/* KHIẾU NẠI ĐỨT CHUỖI NẾU CÓ */}
            {selectedUser.lostStreakRecently && (
              <div style={{
                background: '#FEF3C7',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309', fontWeight: 800, fontSize: '13.5px', marginBottom: '6px' }}>
                  <span>⚠️</span>
                  <span>Đơn Khiếu Nại Mất Chuỗi {selectedUser.maxStreak} Ngày:</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#78350F', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{selectedUser.complaintText}"
                </p>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleRescueStreak(selectedUser.id, selectedUser.name)}
                    style={{
                      background: '#F97316',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🔥</span>
                    <span>Phê Duyệt: Khôi Phục Chuỗi {selectedUser.maxStreak} Ngày</span>
                  </button>
                </div>
              </div>
            )}

            {/* THÔNG SỐ GAME HÓA */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Chuỗi Hiện Tại</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#F97316' }}>🔥 {selectedUser.streak} ngày</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Số Tim</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#EF4444' }}>❤️ {selectedUser.hearts}/5</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Tổng Điểm XP</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#F59E0B' }}>⭐ {selectedUser.xp}</div>
              </div>
            </div>

            {/* CSKH ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleRefillHearts(selectedUser.id, selectedUser.name)}
                style={{ flex: 1, background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                ❤️ Nạp Đầy Tim
              </button>
              <button
                type="button"
                onClick={() => handleRewardXP(selectedUser.id, selectedUser.name, 100)}
                style={{ flex: 1, background: '#FEF3C7', color: '#B45309', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                🎁 Tặng +100 XP
              </button>
              <button
                type="button"
                onClick={() => handleToggleBan(selectedUser.id, selectedUser.name)}
                style={{ flex: 1, background: selectedUser.status === 'BANNED' ? '#DCFCE7' : '#0F172A', color: selectedUser.status === 'BANNED' ? '#15803D' : '#FFFFFF', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                {selectedUser.status === 'BANNED' ? '🔓 Mở Khóa' : '🚫 Khóa Tài Khoản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
