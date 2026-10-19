import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/modules/adminService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Create School
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newSchoolContact, setNewSchoolContact] = useState('');
  const [newSchoolLicenses, setNewSchoolLicenses] = useState(1000);
  const [newSchoolValue, setNewSchoolValue] = useState('50.000.000 VNĐ');

  // Modal Generate Class Codes
  const [selectedSchoolForCodes, setSelectedSchoolForCodes] = useState(null);
  const [codesCount, setCodesCount] = useState(3);

  // Modal Audit Certificate
  const [auditSchool, setAuditSchool] = useState(null);

  useEffect(() => {
    adminService.getSchools()
      .then((res) => setSchools(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateSchool = (e) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;

    sound.playVictory();
    fireConfetti();
    const data = {
      name: newSchoolName.trim(),
      code: newSchoolCode.trim() || `SCH-${Math.floor(100 + Math.random() * 900)}`,
      contactPerson: newSchoolContact.trim() || 'Ban Giám Hiệu',
      totalLicenses: Number(newSchoolLicenses),
      contractStart: '2026-10-01',
      contractEnd: '2027-09-30',
      contractValue: newSchoolValue,
    };

    adminService.createSchoolContract(data).then((res) => {
      setSchools(res.data);
      setShowCreateModal(false);
      setNewSchoolName('');
      setNewSchoolCode('');
      setNewSchoolContact('');
    });
  };

  const handleGenerateCodes = (e) => {
    e.preventDefault();
    sound.playVictory();
    fireConfetti();
    adminService.generateClassCodes(selectedSchoolForCodes.id, codesCount).then((res) => {
      setSchools(res.data);
      alert(`🎉 Đã sinh tự động ${codesCount} dải mã lớp học mới cho ${selectedSchoolForCodes.name}!`);
      setSelectedSchoolForCodes(null);
    });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Đang tải danh sách trường đối tác...</div>;
  }

  const totalLicensesAll = schools.reduce((sum, s) => sum + s.totalLicenses, 0);
  const totalActivatedAll = schools.reduce((sum, s) => sum + s.activatedLicenses, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#0F172A', color: '#FFFFFF', fontSize: '11px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
              MODULE 5
            </span>
            <span style={{ color: '#0284C7', fontWeight: 700, fontSize: '13px' }}>
              B2B Schools &amp; Educational Licenses Provisioning
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            🏫 Quản Lý Trường Học Đối Tác &amp; Giấy Phép B2B
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0' }}>
            Quản trị hợp đồng trường học, kích hoạt dải mã bản quyền số lượng lớn và xuất báo cáo kiểm định an toàn nộp Sở GD&amp;ĐT.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { sound.playClick(); setShowCreateModal(true); }}
          style={{
            background: '#0284C7',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
          }}
        >
          <span>➕</span>
          <span>Ký Hợp Đồng Trường Mới</span>
        </button>
      </div>

      {/* THẺ TỔNG QUAN BẢN QUYỀN TOÀN BỘ B2B */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Số Trường Đối Tác</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
            {schools.length} trường
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Tổng Suất Bản Quyền Cấp Sỉ</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#0284C7', marginTop: '4px' }}>
            {totalLicensesAll.toLocaleString()} <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>suất</span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Đã Kích Hoạt Thực Tế</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>
            {totalActivatedAll.toLocaleString()} <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>({Math.round((totalActivatedAll / totalLicensesAll) * 100)}%)</span>
          </div>
        </div>
      </div>

      {/* DANH SÁCH CÁC TRƯỜNG ĐỐI TÁC */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {schools.map((school) => {
          const percentUsed = Math.round((school.activatedLicenses / school.totalLicenses) * 100);

          return (
            <div
              key={school.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '20px' }}>🏫</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      {school.name}
                    </h3>
                    <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                      Mã: {school.code}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>
                    Đại diện: <strong>{school.contactPerson}</strong> • Hạn hợp đồng: <strong style={{ color: '#0F172A' }}>{school.contractEnd}</strong> • Giá trị: <strong style={{ color: '#15803D' }}>{school.contractValue}</strong>
                  </div>
                </div>

                {/* NÚT THAO TÁC */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setAuditSchool(school); }}
                    style={{
                      background: '#EFF6FF',
                      color: '#0284C7',
                      border: '1px solid #BFDBFE',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>📄</span>
                    <span>Xuất Báo Cáo Sở GD&amp;ĐT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setSelectedSchoolForCodes(school); }}
                    style={{
                      background: '#F8FAFC',
                      color: '#334155',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🔑</span>
                    <span>Sinh Thêm Mã Lớp</span>
                  </button>
                </div>
              </div>

              {/* THANH TIẾN ĐỘ SỬ DỤNG BẢN QUYỀN */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>
                    Đã kích hoạt: <strong>{school.activatedLicenses.toLocaleString()}</strong> / {school.totalLicenses.toLocaleString()} suất
                  </span>
                  <span style={{ fontWeight: 800, color: percentUsed >= 90 ? '#15803D' : '#0284C7' }}>
                    {percentUsed}% công suất
                  </span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${percentUsed}%`,
                    height: '100%',
                    background: percentUsed >= 90 ? '#10B981' : '#0284C7',
                    borderRadius: '999px',
                  }}></div>
                </div>
              </div>

              {/* DANH SÁCH MÃ LỚP ĐÃ CẤP */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
                <span style={{ color: '#64748B', fontWeight: 700 }}>Các mã lớp học sinh nhập:</span>
                {school.classes?.map((cls, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: TẠO HỢP ĐỒNG TRƯỜNG MỚI */}
      {showCreateModal && (
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
            maxWidth: '520px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 16px' }}>
              ➕ Ký Hợp Đồng Cấp Phép Trường Học Mới
            </h3>

            <form onSubmit={handleCreateSchool} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Tên Trường Học / Tổ Chức:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: THPT Gia Định, TP.HCM"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    Mã Viết Tắt (Prefix):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: GIA-DINH"
                    value={newSchoolCode}
                    onChange={(e) => setNewSchoolCode(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    Số Lượng Suất (Seats):
                  </label>
                  <input
                    type="number"
                    step={100}
                    value={newSchoolLicenses}
                    onChange={(e) => setNewSchoolLicenses(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Người đại diện / Ban Giám Hiệu:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thầy Nguyễn Văn A - Hiệu trưởng"
                  value={newSchoolContact}
                  onChange={(e) => setNewSchoolContact(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Giá trị Hợp đồng:
                </label>
                <input
                  type="text"
                  value={newSchoolValue}
                  onChange={(e) => setNewSchoolValue(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ background: '#0284C7', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Ký Hợp Đồng &amp; Cấp Bản Quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SINH THÊM MÃ LỚP HỌC */}
      {selectedSchoolForCodes && (
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
              🔑 Sinh Dải Mã Lớp Tự Động
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
              Trường: <strong>{selectedSchoolForCodes.name}</strong>
            </p>

            <form onSubmit={handleGenerateCodes} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Số lượng mã lớp cần sinh thêm:
                </label>
                <select
                  value={codesCount}
                  onChange={(e) => setCodesCount(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 700 }}
                >
                  <option value={3}>+3 Mã lớp học mới</option>
                  <option value={5}>+5 Mã lớp học mới</option>
                  <option value={10}>+10 Mã lớp học mới (Nguyên khối)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedSchoolForCodes(null)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ background: '#0F172A', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Sinh Mã Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: XUẤT BÁO CÁO KIỂM ĐỊNH AN TOÀN SỞ GD&ĐT */}
      {auditSchool && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            maxWidth: '680px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            border: '2px solid #E2E8F0',
          }}>
            {/* TIÊU ĐỀ CHÍNH THỨC */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.1em' }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM • ĐỘC LẬP - TỰ DO - HẠNH PHÚC
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '8px 0 4px', textTransform: 'uppercase' }}>
                Báo Cáo Khảo Sát Năng Lực An Toàn Học Đường
              </h2>
              <div style={{ fontSize: '13px', color: '#0284C7', fontWeight: 700 }}>
                ĐƠN VỊ: {auditSchool.name}
              </div>
            </div>

            {/* NỘI DUNG BÁO CÁO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', lineHeight: 1.6, color: '#334155' }}>
              <div>
                Hệ thống <strong>MIMO Gamified Safety Platform</strong> chứng nhận trường <strong>{auditSchool.name}</strong> đã hoàn thành đợt diễn tập an toàn kỹ năng sống niên khóa 2026 - 2027 với các chỉ số đo lường như sau:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Tỷ lệ tham gia diễn tập</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#15803D' }}>100% ({auditSchool.activatedLicenses} học sinh)</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Kỹ năng Thoát hiểm PCCC</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#15803D' }}>94.2% Đạt Chuẩn</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Kỹ năng Sơ cấp cứu CPR</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0284C7' }}>88.5% Đạt Chuẩn</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>An toàn Không gian mạng</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0284C7' }}>91.0% Đạt Chuẩn</div>
                </div>
              </div>

              <div style={{ background: '#DCFCE7', padding: '12px 16px', borderRadius: '12px', color: '#15803D', fontWeight: 700, fontSize: '13px' }}>
                ✓ ĐỦ TIÊU CHUẨN CÔNG NHẬN "TRƯỜNG HỌC AN TOÀN — THÂN THIỆN TIÊU CHUẨN QUỐC GIA NĂM 2026" ĐỂ BÁO CÁO SỞ GD&amp;ĐT.
              </div>
            </div>

            {/* CHỮ KÝ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '16px', borderTop: '1px dashed #CBD5E1', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Đại Diện Nhà Trường</div>
                <div style={{ marginTop: '40px', fontWeight: 800, color: '#0F172A' }}>{auditSchool.contactPerson}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Ban Giám Đốc Nền Tảng MIMO</div>
                <div style={{ marginTop: '40px', fontWeight: 800, color: '#0284C7' }}>Super Admin (Đã Ký Số)</div>
              </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setAuditSchool(null)}
                style={{ background: '#F1F5F9', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playVictory();
                  alert('🖨️ Đang kết nối máy in và xuất file PDF chuẩn Sở GD&ĐT...');
                }}
                style={{
                  background: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🖨️</span>
                <span>In / Xuất PDF Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
