import React, { useState, useEffect } from 'react';
import { businessService } from '../../services/modules/businessService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function BusinessTeachersPage() {
  const [keys, setKeys] = useState([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [note, setNote] = useState('');
  const [selectedClasses, setSelectedClasses] = useState(['FPT-10A1', 'FPT-10A2']);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = () => {
    businessService.getTeacherKeys().then((res) => {
      if (res?.data) setKeys(res.data);
    });
  };

  const handleCopy = (code) => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    sound.playVictory();
    fireConfetti();
    businessService.generateTeacherKey({
      note: note.trim() || 'Mã giáo viên bộ môn mới',
      assignedClassCodes: selectedClasses,
    }).then(() => {
      alert('🎉 Đã sinh Mã Bản Quyền Giáo Viên mới thành công! Nhà trường hãy gửi mã này cho Thầy/Cô.');
      setShowGenerateModal(false);
      setNote('');
      loadKeys();
    });
  };

  const toggleClassSelect = (clsCode) => {
    if (selectedClasses.includes(clsCode)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== clsCode));
    } else {
      setSelectedClasses([...selectedClasses, clsCode]);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="biz-page-header">
        <div>
          <h1 className="biz-page-title">
            <span>🔑</span>
            <span>Mã Bản Quyền Giáo Viên (Teacher Activation Codes)</span>
          </h1>
          <p className="biz-page-subtitle">
            Cấp mã kích hoạt quyền Giáo Viên cho các Thầy/Cô để tự động nhận lớp và quản lý học sinh trên MIMO
          </p>
        </div>

        <button
          type="button"
          className="biz-btn-primary"
          onClick={() => {
            sound.playClick();
            setShowGenerateModal(true);
          }}
        >
          <span>➕</span>
          <span>Tạo Mã Giáo Viên Mới</span>
        </button>
      </div>

      {/* HƯỚNG DẪN QUY TRÌNH HOẠT ĐỘNG */}
      <div
        className="biz-card"
        style={{
          background: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          padding: '16px 20px',
        }}
      >
        <span style={{ fontSize: '28px' }}>💡</span>
        <div style={{ fontSize: '13px', color: '#1E40AF', lineHeight: 1.6 }}>
          <strong>Quy trình hoạt động:</strong> Ban Giám Hiệu tạo một mã bản quyền (Ví dụ: <code>GV-FPT-K10</code>) và phân công các lớp phụ trách $\rightarrow$ Gửi mã này qua Zalo/Email cho Giáo viên $\rightarrow$ Giáo viên vào tài khoản MIMO của mình bấm <strong>"Kích hoạt quyền Giáo viên"</strong> nhập mã này vào $\rightarrow$ Tài khoản tự động được nâng cấp lên Giáo viên và nhận đúng các lớp được giao!
        </div>
      </div>

      {/* DANH SÁCH MÃ GIÁO VIÊN */}
      <div className="biz-card">
        <div className="biz-card-title">
          <span>📋 Danh Sách Mã Giáo Viên Đã Cấp ({keys.length} mã)</span>
          {copiedCode && (
            <span style={{ fontSize: '12.5px', color: '#16A34A', fontWeight: 800 }}>
              ✅ Đã copy mã "{copiedCode}" vào bộ nhớ tạm!
            </span>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '12px 14px' }}>MÃ KÍCH HOẠT</th>
                <th style={{ padding: '12px 14px' }}>LỚP ĐƯỢC PHÂN CÔNG</th>
                <th style={{ padding: '12px 14px' }}>MÔ TẢ / GHI CHÚ</th>
                <th style={{ padding: '12px 14px' }}>TRẠNG THÁI</th>
                <th style={{ padding: '12px 14px' }}>NGƯỜI KÍCH HOẠT</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <code
                      style={{
                        background: '#0F172A',
                        color: '#38BDF8',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 900,
                        fontSize: '13px',
                        letterSpacing: '1px',
                      }}
                    >
                      {k.code}
                    </code>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {k.assignedClassCodes?.map((c) => (
                        <span
                          key={c}
                          style={{
                            background: '#E0F2FE',
                            color: '#0369A1',
                            fontWeight: 800,
                            fontSize: '11px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>
                    {k.note}
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    {k.status === 'ACTIVATED' ? (
                      <span
                        style={{
                          background: '#DCFCE7',
                          color: '#15803D',
                          fontWeight: 800,
                          fontSize: '11.5px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        🟢 ĐÃ KÍCH HOẠT
                      </span>
                    ) : (
                      <span
                        style={{
                          background: '#FEF3C7',
                          color: '#B45309',
                          fontWeight: 800,
                          fontSize: '11.5px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        🟡 SẴN SÀNG GỬI
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', fontSize: '12.5px' }}>
                    {k.activatedBy ? (
                      <div>
                        <strong style={{ color: '#0F172A' }}>{k.activatedBy.name}</strong>
                        <div style={{ color: '#64748B', fontSize: '11px' }}>{k.activatedBy.email}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Chưa có người kích hoạt</span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      type="button"
                      className="biz-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleCopy(k.code)}
                    >
                      📋 Copy Mã
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TẠO MÃ GIÁO VIÊN MỚI */}
      {showGenerateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '24px', width: '500px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800 }}>
              🔑 Tạo Mã Bản Quyền Giáo Viên Mới
            </h3>

            <form onSubmit={handleGenerate}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Ghi chú phân công môn học / giáo viên:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phụ trách môn PCCC Khối 12 (12A1, 12A2)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Chọn Các Lớp Phân Công Cho Mã Này (Bấm để chọn):
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxHeight: '140px', overflowY: 'auto', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  {['FPT-10A1', 'FPT-10A2', 'FPT-10A3', 'FPT-10A4', 'FPT-10A5', 'FPT-11A1', 'FPT-11A2', 'FPT-11A3', 'FPT-11A4', 'FPT-11A5', 'FPT-12A1', 'FPT-12A2', 'FPT-12A3', 'FPT-12A4', 'FPT-12A5'].map((code) => {
                    const isSelected = selectedClasses.includes(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleClassSelect(code)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: isSelected ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
                          background: isSelected ? '#E0F2FE' : '#FFF',
                          color: isSelected ? '#0369A1' : '#475569',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '} {code}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="biz-btn-secondary"
                  onClick={() => setShowGenerateModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="biz-btn-primary">
                  Sinh Mã Bản Quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
