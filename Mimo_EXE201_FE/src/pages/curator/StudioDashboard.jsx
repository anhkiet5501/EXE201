import React, { useEffect, useState } from 'react';
import { curatorService } from '../../services/modules/curatorService';

export default function StudioDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    curatorService.getMyCourses()
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>🎨 Studio Tác giả</h1>
          <p style={{ color: '#c084fc', marginTop: '4px' }}>Quản lý và soạn thảo các khóa học kỹ năng sống</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#9333ea', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          + Tạo khóa học mới
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#c084fc' }}>Đang tải danh sách bài soạn...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {courses.map((course) => (
            <div key={course.id} style={{ background: '#1c132d', border: '1px solid #3b1b6d', borderRadius: '16px', padding: '20px' }}>
              <span style={{ fontSize: '11px', background: course.status === 'PUBLISHED' ? '#065f46' : '#78350f', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                {course.status}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '12px 0 6px', color: '#f5f3ff' }}>{course.title}</h3>
              <p style={{ color: '#a78bfa', fontSize: '13px', marginBottom: '16px' }}>
                {course.modulesCount} modules • {course.learnersCount} học viên
              </p>
              <button style={{ width: '100%', padding: '8px', background: '#3b1b6d', color: '#e9d5ff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                Mở trình soạn thảo →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
