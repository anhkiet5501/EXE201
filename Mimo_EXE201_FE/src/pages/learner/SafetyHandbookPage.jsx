import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { sound } from '../../utils/audioEffects';

export default function SafetyHandbookPage() {
  const { data } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('all');

  const handbook = data?.handbook || { emergencyDials: [], articles: [] };

  const pillars = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Sơ cấp cứu', name: '🚑 Sơ cấp cứu' },
    { id: 'PCCC & Thoát hiểm', name: '🔥 PCCC & Thoát hiểm' },
    { id: 'An toàn số', name: '🛡️ An toàn số & Scam' },
  ];

  // Lọc bài viết
  const filteredArticles = handbook.articles?.filter((art) => {
    const matchesPillar = selectedPillar === 'all' || art.pillar === selectedPillar;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.pillar.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPillar && matchesSearch;
  }) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. HEADER CẨM NANG HỌC TẬP */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '32px' }}>📚</span>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            Cẩm nang học tập & Kỹ năng
          </h1>
        </div>
        <p style={{ color: '#64748B', fontSize: '14.5px', margin: '6px 0 0 0' }}>
          Thư viện tra cứu nhanh các quy trình y tế, an toàn khẩn cấp gối đầu giường dành cho học sinh.
        </p>
      </div>

      {/* 2. BẢNG GỌI KHẨN CẤP SOS 1-CHẠM (EMERGENCY DIALS) */}
      <div
        style={{
          background: '#FEF2F2',
          border: '2px solid #FECACA',
          borderRadius: '24px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>🚨</span>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', margin: 0 }}>
              Bảng Tổng Đài Khẩn Cấp SOS Một Chạm
            </h3>
            <div style={{ fontSize: '12.5px', color: '#B91C1C' }}>
              Chạm để gọi ngay khi gặp nguy hiểm đến tính mạng hoặc an ninh
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {handbook.emergencyDials?.map((dial) => (
            <a
              key={dial.number}
              href={`tel:${dial.number}`}
              onClick={() => sound.playClick()}
              style={{
                textDecoration: 'none',
                background: '#FFFFFF',
                border: '2px solid #FCA5A5',
                borderBottom: '4px solid #EF4444',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'transform 0.1s',
                color: '#0F172A',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0,
                }}
              >
                {dial.icon}
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: dial.color, lineHeight: 1 }}>
                  {dial.number}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
                  {dial.name}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 3. THANH TÌM KIẾM NHANH (INSTANT SEARCH) */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="🔍 Tìm nhanh kỹ năng: bỏng, cháy, lừa đảo, hóc dị vật..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '16px',
              border: '2px solid #E2E8F0',
              fontSize: '14.5px',
              fontFamily: 'var(--font-family)',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#FFFFFF',
            }}
          />
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {pillars.map((pil) => (
            <button
              key={pil.id}
              onClick={() => {
                sound.playClick();
                setSelectedPillar(pil.id);
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '999px',
                border: '2px solid',
                borderColor: selectedPillar === pil.id ? '#22C55E' : '#E2E8F0',
                background: selectedPillar === pil.id ? '#DCFCE7' : '#FFFFFF',
                color: selectedPillar === pil.id ? '#15803D' : '#64748B',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {pil.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4. DANH SÁCH BÀI HƯỚNG DẪN QUY TRÌNH CHUẨN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
            Không tìm thấy bài viết nào phù hợp với từ khóa "{searchTerm}".
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              style={{
                background: '#FFFFFF',
                border: '2px solid #E2E8F0',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    background: '#EFF6FF',
                    color: '#1E40AF',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}
                >
                  {art.pillar}
                </span>
                <span
                  style={{
                    background: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}
                >
                  {art.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0' }}>
                {art.title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {art.steps?.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: '#334155',
                    }}
                  >
                    <span style={{ color: '#22C55E', fontWeight: 800 }}>✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {art.warning && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '13px',
                    color: '#B91C1C',
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  ⚠️ <strong>LƯU Ý QUAN TRỌNG:</strong> {art.warning}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
