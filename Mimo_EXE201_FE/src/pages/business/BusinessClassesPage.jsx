import React, { useState, useEffect } from 'react';
import { businessService } from '../../services/modules/businessService';
import { sound, fireConfetti } from '../../utils/audioEffects';

export default function BusinessClassesPage() {
  const [classes, setClasses] = useState([]);
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [assignedTeacherName, setAssignedTeacherName] = useState('Thầy Nguyễn Văn Nam (GV PCCC)');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Khối 10');
  const [newClassRoom, setNewClassRoom] = useState('');
  const [newClassTopic, setNewClassTopic] = useState('Kỹ năng PCCC & Thoát hiểm');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    businessService.getClasses().then((res) => {
      if (res?.data) setClasses(res.data);
    });
  };

  const handleOpenAssign = (cls) => {
    sound.playClick();
    setSelectedClass(cls);
    setAssignedTeacherName(cls.teacherName || 'Thầy Nguyễn Văn Nam (GV PCCC)');
    setShowAssignModal(true);
  };

  const handleSaveAssign = (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    sound.playVictory();
    businessService.assignTeacherToClass(selectedClass.id, 'user_assigned', assignedTeacherName).then(() => {
      alert(`✅ Đã phân công "${assignedTeacherName}" phụ trách lớp ${selectedClass.name}!`);
      setShowAssignModal(false);
      loadClasses();
    });
  };

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    sound.playVictory();
    fireConfetti();
    businessService.createClass({
      name: newClassName,
      grade: newClassGrade,
      room: newClassRoom || 'Phòng 306 - Tòa Alpha',
      focusTopic: newClassTopic,
      studentsCount: 40,
    }).then(() => {
      alert(`🎉 Đã mở lớp học mới "${newClassName}" thành công!`);
      setShowCreateModal(false);
      setNewClassName('');
      loadClasses();
    });
  };

  // Lọc lớp
  const filteredClasses = classes.filter((c) => {
    const matchGrade = filterGrade === 'ALL' || c.grade === filterGrade;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchSearch;
  });

  return (
    <div>
      {/* HEADER */}
      <div className="biz-page-header">
        <div>
          <h1 className="biz-page-title">
            <span>🏫</span>
            <span>Quản Lý Khối & Danh Sách Lớp Học</span>
          </h1>
          <p className="biz-page-subtitle">
            Hệ thống 15 lớp học của trường (Khối 10: 10A1-10A5, Khối 11: 11A1-11A5, Khối 12: 12A1-12A5)
          </p>
        </div>

        <button
          type="button"
          className="biz-btn-primary"
          onClick={() => {
            sound.playClick();
            setShowCreateModal(true);
          }}
        >
          <span>➕</span>
          <span>Mở Lớp Học Mới</span>
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="biz-card" style={{ padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Tìm theo tên lớp, mã lớp, tên giáo viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '240px',
            padding: '9px 14px',
            borderRadius: '8px',
            border: '1.5px solid #CBD5E1',
            fontSize: '13px',
          }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'Khối 10', 'Khối 11', 'Khối 12'].map((g) => (
            <button
              key={g}
              type="button"
              className={filterGrade === g ? 'biz-btn-primary' : 'biz-btn-secondary'}
              style={{ padding: '8px 14px', fontSize: '12.5px' }}
              onClick={() => {
                sound.playClick();
                setFilterGrade(g);
              }}
            >
              {g === 'ALL' ? 'Tất Cả Các Lớp' : g}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH LỚP HỌC */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="biz-card"
            style={{
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `4px solid ${cls.grade === 'Khối 10' ? '#0284C7' : cls.grade === 'Khối 11' ? '#7C3AED' : '#059669'}`,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>
                    {cls.grade} • {cls.code}
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
                    {cls.name}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: cls.complianceRate >= 90 ? '#DCFCE7' : '#FEF3C7',
                    color: cls.complianceRate >= 90 ? '#15803D' : '#D97706',
                  }}
                >
                  {cls.complianceRate}% Hoàn thành
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '10px' }}>
                📍 {cls.room} • 👥 <strong>{cls.studentsCount} học sinh</strong>
              </div>

              <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '4px' }}>
                🎯 Chuyên đề: <strong>{cls.focusTopic}</strong>
              </div>

              {/* GIÁO VIÊN PHỤ TRÁCH */}
              <div
                style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12.5px',
                }}
              >
                <div style={{ color: '#64748B', fontSize: '11px', fontWeight: 700 }}>GIÁO VIÊN PHỤ TRÁCH:</div>
                <div style={{ color: '#0284C7', fontWeight: 800, marginTop: '2px' }}>
                  👨‍🏫 {cls.teacherName}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="biz-btn-secondary"
                style={{ flex: 1, padding: '7px', fontSize: '12px', justifyContent: 'center' }}
                onClick={() => handleOpenAssign(cls)}
              >
                🔄 Đổi Giáo Viên
              </button>

              <button
                type="button"
                className="biz-btn-primary"
                style={{ flex: 1, padding: '7px', fontSize: '12px', justifyContent: 'center' }}
                onClick={() => {
                  sound.playClick();
                  alert(`📋 Đang xuất sổ điểm và danh sách học sinh của ${cls.name}...`);
                }}
              >
                📊 Sổ Điểm Lớp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PHÂN CÔNG GIÁO VIÊN */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '24px', width: '420px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800 }}>
              🔄 Phân Công Giáo Viên Phụ Trách
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: 0 }}>
              Chọn giáo viên bộ môn sẽ vào quản lý và giao bài cho lớp <strong>{selectedClass?.name}</strong>:
            </p>

            <form onSubmit={handleSaveAssign}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Chọn Giáo Viên Trong Trường:
                </label>
                <select
                  value={assignedTeacherName}
                  onChange={(e) => setAssignedTeacherName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="Thầy Nguyễn Văn Nam (GV PCCC)">Thầy Nguyễn Văn Nam — Giáo viên môn PCCC & Cứu nạn</option>
                  <option value="Cô BS. Trần Thị Mai (GV Y Tế)">Cô BS. Trần Thị Mai — Giáo viên môn Y tế & Sơ cấp cứu</option>
                  <option value="Thầy Lê Nhật Quang (GV Kỹ Năng)">Thầy Lê Nhật Quang — Giáo viên Kỹ năng sinh tồn Khối 11</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="biz-btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="biz-btn-primary">
                  Lưu Phân Công
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MỞ LỚP HỌC MỚI */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '24px', width: '450px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800 }}>
              ➕ Mở Lớp Học Mới Cho Trường
            </h3>

            <form onSubmit={handleCreateClass}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Tên Lớp Học:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lớp 10A6 — Bán Trú"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Khối:
                  </label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="Khối 10">Khối 10</option>
                    <option value="Khối 11">Khối 11</option>
                    <option value="Khối 12">Khối 12</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Phòng Học:
                  </label>
                  <input
                    type="text"
                    placeholder="Phòng 306"
                    value={newClassRoom}
                    onChange={(e) => setNewClassRoom(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Chuyên Đề Kỹ Năng Trọng Tâm:
                </label>
                <input
                  type="text"
                  placeholder="Kỹ năng PCCC & Thoát hiểm"
                  value={newClassTopic}
                  onChange={(e) => setNewClassTopic(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="biz-btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="biz-btn-primary">
                  Tạo Lớp Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
