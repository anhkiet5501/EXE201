import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/modules/adminService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function AdminMonetizationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Plan Price state
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPrice, setNewPrice] = useState(0);

  // Transactions local state for refund simulation
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    adminService.getMonetizationData()
      .then((res) => {
        setData(res.data);
        setTransactions(res.data.transactions || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenEdit = (plan) => {
    sound.playClick();
    setEditingPlan(plan);
    setNewPrice(plan.price || plan.pricePerSeat);
  };

  const handleSavePrice = (e) => {
    e.preventDefault();
    sound.playVictory();
    fireConfetti();

    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => {
        if (p.id === editingPlan.id) {
          return p.price ? { ...p, price: Number(newPrice) } : { ...p, pricePerSeat: Number(newPrice) };
        }
        return p;
      }),
    }));

    alert('🎉 Đã cập nhật bảng giá gói cước mới thành công!');
    setEditingPlan(null);
  };

  const handleRefund = (txId, customerName, amount) => {
    if (!window.confirm(`Xác nhận hoàn tiền ${amount.toLocaleString()} VNĐ cho khách hàng "${customerName}"?`)) return;

    sound.playClick();
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, status: 'REFUNDED' } : tx))
    );
    alert(`💸 Đã thực hiện lệnh hoàn tiền thành công cho mã giao dịch ${txId}!`);
  };

  if (loading || !data) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Đang tải báo cáo doanh thu &amp; gói cước...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#0F172A', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
              MODULE 7
            </span>
            <span style={{ color: '#0284C7', fontWeight: 700, fontSize: '13px' }}>
              Monetization, Pricing &amp; Payment Gateway Operations
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            💰 Quản Lý Doanh Thu, Gói Cước &amp; Cổng Thanh Toán
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0' }}>
            Giám sát dòng tiền B2C + B2B, cấu hình bảng giá thuê bao, theo dõi uptime cổng thanh toán và tra soát hoàn tiền.
          </p>
        </div>
      </div>

      {/* TỔNG QUAN DOANH THU */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '22px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>Doanh Thu Tháng Này (MRR)</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>
            {data.monthlyRevenue.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 700 }}>VNĐ</span>
          </div>
          <div style={{ fontSize: '12px', color: '#15803D', fontWeight: 700, marginTop: '6px' }}>
            ▲ +{data.growthPercent}% so với tháng trước
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '22px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>Doanh Thu B2C Cá Nhân</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#0284C7', marginTop: '4px' }}>
            {data.b2cRevenue.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 700 }}>VNĐ</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
            525 thuê bao MIMO Plus đang hoạt động
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '22px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>Doanh Thu B2B Trường Học</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#8B5CF6', marginTop: '4px' }}>
            {data.b2bRevenue.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 700 }}>VNĐ</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
            4 hợp đồng trường học (5.210 suất)
          </div>
        </div>
      </div>

      {/* KHỐI 1: CẤU HÌNH GÓI CƯỚC THUÊ BAO */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        padding: '26px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
      }}>
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            📦 Bảng Giá Gói Dịch Vụ &amp; Bản Quyền (Pricing Strategy)
          </h2>
          <p style={{ color: '#64748B', fontSize: '13px', margin: '4px 0 0' }}>
            Admin có thể điều chỉnh giá bán niêm yết trực tiếp mà không cần sửa mã nguồn.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {data.plans.map((p) => (
            <div
              key={p.id}
              style={{
                border: '1.5px solid #CBD5E1',
                borderRadius: '20px',
                padding: '20px',
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    background: p.type === 'B2C' ? '#EFF6FF' : '#F3E8FF',
                    color: p.type === 'B2C' ? '#0284C7' : '#7C3AED',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}>
                    {p.type} GÓI
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{p.billingCycle}</span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
                  {p.name}
                </h3>

                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '14px' }}>
                  {(p.price || p.pricePerSeat)?.toLocaleString()} <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>đ / {p.price ? 'chu kỳ' : 'suất'}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                  {p.features?.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#16A34A', fontWeight: 800 }}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '8px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ✏️ Thay đổi giá niêm yết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KHỐI 2: GIÁM SÁT CỔNG THANH TOÁN (PAYMENT GATEWAYS UPTIME) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        padding: '24px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 16px' }}>
          💳 Giám Sát Cổng Thanh Toán Trực Tuyến
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {data.gateways?.map((gw, idx) => (
            <div
              key={idx}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{gw.name}</strong>
                <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                  {gw.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Tỷ lệ thành công: <strong style={{ color: '#15803D' }}>{gw.successRate}</strong>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Độ trễ trung bình: <strong>{gw.latency}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KHỐI 3: NHẬT KÝ GIAO DỊCH & TRA SOÁT HOÀN TIỀN (TRANSACTIONS & REFUND) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            🧾 Nhật Ký Giao Dịch Gần Đây &amp; Tra Soát Hoàn Tiền
          </h2>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
              <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Mã GD</th>
              <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Khách Hàng</th>
              <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Gói Dịch Vụ</th>
              <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Số Tiền</th>
              <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Phương Thức</th>
              <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Thời Gian</th>
              <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Trạng Thái</th>
              <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 800, color: '#64748B', textAlign: 'center' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>
                  {tx.id}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#334155', fontSize: '13.5px' }}>
                  {tx.customer}
                </td>
                <td style={{ padding: '14px 18px', fontSize: '13px', color: '#64748B' }}>
                  {tx.plan}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 900, color: '#0F172A', fontSize: '14px' }}>
                  {tx.amount.toLocaleString()} đ
                </td>
                <td style={{ padding: '14px 18px', fontSize: '12.5px', color: '#64748B' }}>
                  {tx.method}
                </td>
                <td style={{ padding: '14px 18px', fontSize: '12px', color: '#94A3B8' }}>
                  {tx.time}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  {tx.status === 'SUCCESS' ? (
                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                      ✓ Thành công
                    </span>
                  ) : (
                    <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                      ↩ Đã hoàn tiền
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  {tx.status === 'SUCCESS' && (
                    <button
                      type="button"
                      onClick={() => handleRefund(tx.id, tx.customer, tx.amount)}
                      style={{
                        background: '#FFFFFF',
                        color: '#DC2626',
                        border: '1px solid #FCA5A5',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Hoàn tiền
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL THAY ĐỔI GIÁ GÓI CƯỚC */}
      {editingPlan && (
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
            maxWidth: '460px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px' }}>
              ✏️ Thay Đổi Giá Niêm Yết Gói Cước
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
              Gói: <strong>{editingPlan.name}</strong>
            </p>

            <form onSubmit={handleSavePrice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Giá mới (VNĐ):
                </label>
                <input
                  type="number"
                  step={1000}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '16px', fontWeight: 800, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ background: '#0F172A', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Lưu Giá Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
