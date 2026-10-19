import React, { useState, useEffect } from 'react';
import { curatorService } from '../../services/modules/curatorService';

export default function CuratorAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form upload
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Sơ cấp cứu');
  const [uploadUrl, setUploadUrl] = useState('');

  useEffect(() => {
    curatorService.getMediaAssets()
      .then((res) => setAssets(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'ALL',
    'Sơ cấp cứu',
    'PCCC & Nhà bếp',
    'An toàn số',
    'Kỹ năng sinh tồn',
  ];

  const filteredAssets = assets.filter((item) => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadUrl) {
      alert('Vui lòng nhập đầy đủ tiêu đề và link ảnh!');
      return;
    }
    curatorService.uploadAsset({
      title: uploadTitle,
      category: uploadCategory,
      url: uploadUrl,
      type: 'IMAGE',
      format: 'WebP',
      size: '115 KB',
      tags: ['Mới tải lên', uploadCategory],
    }).then((res) => {
      setAssets([res.data, ...assets]);
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadUrl('');
      alert('Tải ảnh lên Thư viện thành công!');
    });
  };

  return (
    <div className="curator-assets-page">
      <style>{`
        .curator-assets-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .assets-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #140d28;
          border: 1px solid #2e1852;
          padding: 20px 24px;
          border-radius: 16px;
        }

        .assets-header h1 {
          font-size: 20px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 4px;
        }

        .assets-header p {
          color: #c084fc;
          font-size: 13px;
          margin: 0;
        }

        .btn-upload-asset {
          background: linear-gradient(135deg, #9333ea, #7c3aed);
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(147, 51, 234, 0.35);
        }

        /* ─── BANNER QUY CHUẨN AN TOÀN HÌNH ẢNH ─── */
        .guidelines-callout {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(147, 51, 234, 0.1));
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .guidelines-callout .icon {
          font-size: 28px;
        }

        .guidelines-callout-content h4 {
          font-size: 14px;
          font-weight: 800;
          color: #4ade80;
          margin: 0 0 4px;
        }

        .guidelines-callout-content ul {
          margin: 0;
          padding-left: 18px;
          font-size: 12.5px;
          color: #cbd5e1;
          line-height: 1.5;
        }

        /* ─── TOOLBAR LỌC ─── */
        .assets-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .category-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cat-pill-btn {
          background: #170e2d;
          border: 1px solid #331c57;
          color: #94a3b8;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-pill-btn.active {
          background: #7c3aed;
          border-color: #9333ea;
          color: #ffffff;
        }

        .assets-search {
          position: relative;
          width: 280px;
        }

        .assets-search input {
          width: 100%;
          background: #170e2d;
          border: 1px solid #331c57;
          border-radius: 10px;
          padding: 8px 12px 8px 34px;
          color: #f8fafc;
          font-size: 13px;
          outline: none;
        }

        .assets-search .icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 14px;
        }

        /* ─── GRID ASSETS ─── */
        .assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .asset-card {
          background: #150d29;
          border: 1px solid #2e1852;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }

        .asset-card:hover {
          transform: translateY(-3px);
          border-color: #7c3aed;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .asset-thumb-box {
          width: 100%;
          height: 160px;
          background: #000;
          overflow: hidden;
          position: relative;
        }

        .asset-thumb-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .asset-card:hover .asset-thumb-box img {
          transform: scale(1.04);
        }

        .asset-badge-safe {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(34, 197, 94, 0.9);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 20px;
        }

        .asset-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .asset-title {
          font-size: 14px;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.35;
        }

        .asset-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
        }

        .asset-tags-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .asset-tag {
          background: #20133c;
          border: 1px solid #3c1e69;
          color: #c084fc;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .btn-copy-link {
          margin-top: auto;
          background: #20133c;
          border: 1px solid #4a277c;
          color: #cbd5e1;
          padding: 7px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .btn-copy-link:hover {
          background: #2d1b54;
          color: #ffffff;
          border-color: #7c3aed;
        }

        /* ─── MODAL TẢI ẢNH ─── */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modal-card {
          width: 480px;
          background: #170e2d;
          border: 1px solid #3b1d6e;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .modal-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 16px;
        }

        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .modal-field label {
          font-size: 12px;
          font-weight: 700;
          color: #cbd5e1;
        }

        .modal-field input, .modal-field select {
          background: #1f143a;
          border: 1px solid #3b2269;
          border-radius: 10px;
          padding: 9px 12px;
          color: #f8fafc;
          font-size: 13px;
          outline: none;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
      `}</style>

      {/* Header */}
      <div className="assets-header">
        <div>
          <h1>🗄️ Kho Tài Nguyên Đa Phương Tiện (Media & Assets)</h1>
          <p>Ảnh minh họa, GIF mô phỏng và Vector an toàn chuẩn y khoa & cứu nạn</p>
        </div>
        <button className="btn-upload-asset" onClick={() => setShowUploadModal(true)}>
          <span>📤</span>
          <span>+ Tải Ảnh/GIF Mới</span>
        </button>
      </div>

      {/* Quy chuẩn an toàn hình ảnh */}
      <div className="guidelines-callout">
        <span className="icon">🛡️</span>
        <div className="guidelines-callout-content">
          <h4>BỘ QUY CHUẨN AN TOÀN HÌNH ẢNH CHO CHUYÊN GIA BIÊN SOẠN (SAFETY IMAGERY GUIDELINES):</h4>
          <ul>
            <li><strong>Không sử dụng hình ảnh máu me, rùng rợn:</strong> Tránh gây hoảng loạn tâm lý hoặc sang chấn cho học sinh nhỏ tuổi.</li>
            <li><strong>Ưu tiên minh họa 3D hoặc đồ họa kỹ thuật bán thực tế:</strong> Làm rõ bản chất quy trình cứu hộ, dễ quan sát chi tiết.</li>
            <li><strong>Định dạng tối ưu:</strong> Chuẩn WebP dung lượng &lt;150KB để app tải trong 0.5s trên mạng di động 4G.</li>
          </ul>
        </div>
      </div>

      {/* Toolbar lọc */}
      <div className="assets-filter-bar">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'ALL' ? 'Tất cả danh mục' : cat}
            </button>
          ))}
        </div>

        <div className="assets-search">
          <span className="icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm theo tên ảnh, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Danh sách thẻ Assets */}
      <div className="assets-grid">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="asset-card">
            <div className="asset-thumb-box">
              <img src={asset.url} alt={asset.title} />
              <span className="asset-badge-safe">✓ Chuẩn An Toàn</span>
            </div>

            <div className="asset-info">
              <h4 className="asset-title">{asset.title}</h4>

              <div className="asset-meta-row">
                <span>📁 {asset.category}</span>
                <span>⚡ {asset.format} • {asset.size}</span>
              </div>

              <div className="asset-tags-row">
                {asset.tags.map((t, idx) => (
                  <span key={idx} className="asset-tag">#{t}</span>
                ))}
              </div>

              <button
                className="btn-copy-link"
                onClick={() => handleCopy(asset.url, asset.id)}
              >
                <span>{copiedId === asset.id ? '✅ Đã Chép Link!' : '📋 Sao Chép Link Dùng'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Upload */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>📤 Tải Ảnh / GIF Mới Lên Thư Viện</h3>
            <form onSubmit={handleUploadSubmit}>
              <div className="modal-field">
                <label>Tiêu đề mô tả tài nguyên:</label>
                <input
                  type="text"
                  placeholder="VD: Cầm máu vết thương cẳng tay"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label>Danh mục chuyên môn:</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                >
                  <option value="Sơ cấp cứu">Sơ cấp cứu</option>
                  <option value="PCCC & Nhà bếp">PCCC & Nhà bếp</option>
                  <option value="An toàn số">An toàn số</option>
                  <option value="Kỹ năng sinh tồn">Kỹ năng sinh tồn</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Đường dẫn ảnh (URL hoặc WebP Unsplash/CDN):</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  style={{
                    background: '#261647',
                    border: '1px solid #3d2370',
                    color: '#cbd5e1',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowUploadModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#7c3aed',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Xác nhận tải lên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
