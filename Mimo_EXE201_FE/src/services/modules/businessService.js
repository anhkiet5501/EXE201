import { mockSuccess, mockError } from '../mocks/mockHelper';
import { mockBusinessData } from '../mocks/mockBusiness';

const STORAGE_KEYS = {
  CLASSES: 'mimo_business_classes',
  KEYS: 'mimo_business_teacher_keys',
  CAMPAIGNS: 'mimo_business_campaigns',
  ORGANIZATION: 'mimo_business_organization',
};

// Helper: lấy dữ liệu từ localStorage hoặc khởi tạo từ mock
function getStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

function setStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const businessService = {
  // 1. Lấy thông tin tổng quan trường / doanh nghiệp
  async getOverview() {
    const org = getStoredData(STORAGE_KEYS.ORGANIZATION, mockBusinessData.organization);
    const classes = getStoredData(STORAGE_KEYS.CLASSES, mockBusinessData.classes);
    
    // Tính toán lại metrics theo thời gian thực
    const totalStudents = classes.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
    const completedStudents = classes.reduce((sum, c) => sum + (c.completedStudents || 0), 0);
    const complianceRate = totalStudents > 0 ? ((completedStudents / totalStudents) * 100).toFixed(1) : 0;

    return mockSuccess({
      ...org,
      metrics: {
        ...org.metrics,
        complianceRate: Number(complianceRate),
        totalStudents,
        completedStudents,
      },
    });
  },

  // 2. Lấy danh sách các Khối & Lớp học (15 lớp)
  async getClasses() {
    const classes = getStoredData(STORAGE_KEYS.CLASSES, mockBusinessData.classes);
    return mockSuccess(classes);
  },

  // 3. Phân công Giáo viên cho Lớp học
  async assignTeacherToClass(classId, teacherId, teacherName) {
    const classes = getStoredData(STORAGE_KEYS.CLASSES, mockBusinessData.classes);
    const updated = classes.map((c) => {
      if (c.id === classId) {
        return { ...c, teacherId, teacherName };
      }
      return c;
    });
    setStoredData(STORAGE_KEYS.CLASSES, updated);
    return mockSuccess(updated.find((c) => c.id === classId));
  },

  // 4. Mở thêm lớp học mới
  async createClass(classData) {
    const classes = getStoredData(STORAGE_KEYS.CLASSES, mockBusinessData.classes);
    const newClass = {
      id: `cls_${Date.now()}`,
      code: classData.code || `FPT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name: classData.name,
      grade: classData.grade || 'Khối 10',
      room: classData.room || 'Phòng học mới',
      studentsCount: Number(classData.studentsCount) || 35,
      completedStudents: 0,
      complianceRate: 0,
      teacherId: classData.teacherId || null,
      teacherName: classData.teacherName || 'Chưa phân công',
      status: 'ACTIVE',
      focusTopic: classData.focusTopic || 'Kỹ năng PCCC & Thoát hiểm',
    };
    const updated = [newClass, ...classes];
    setStoredData(STORAGE_KEYS.CLASSES, updated);
    return mockSuccess(newClass);
  },

  // 5. Lấy danh sách Mã Bản Quyền Giáo Viên (Teacher License Keys)
  async getTeacherKeys() {
    const keys = getStoredData(STORAGE_KEYS.KEYS, mockBusinessData.teacherLicenseKeys);
    return mockSuccess(keys);
  },

  // 6. Sinh Mã Bản Quyền Giáo Viên Mới
  async generateTeacherKey({ note, assignedClassCodes }) {
    const keys = getStoredData(STORAGE_KEYS.KEYS, mockBusinessData.teacherLicenseKeys);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKey = {
      id: `key_${Date.now()}`,
      code: `GV-FPT-${randomSuffix}`,
      note: note || 'Mã phân công giáo viên bộ môn mới',
      assignedClassCodes: assignedClassCodes || ['FPT-10A1'],
      status: 'READY',
      activatedBy: null,
    };
    const updated = [newKey, ...keys];
    setStoredData(STORAGE_KEYS.KEYS, updated);
    return mockSuccess(newKey);
  },

  // 7. KÍCH HOẠT MÃ GIÁO VIÊN (Dành cho User thường nâng cấp lên EDUCATOR)
  async activateTeacherKey(inputCode, user) {
    const cleanCode = (inputCode || '').trim().toUpperCase();
    const keys = getStoredData(STORAGE_KEYS.KEYS, mockBusinessData.teacherLicenseKeys);
    
    // Tìm mã tương ứng
    const foundIndex = keys.findIndex((k) => k.code.toUpperCase() === cleanCode);
    if (foundIndex === -1) {
      return mockError('Mã bản quyền giáo viên không hợp lệ hoặc không tồn tại!');
    }

    const targetKey = keys[foundIndex];
    if (targetKey.status === 'ACTIVATED') {
      return mockError(`Mã này đã được kích hoạt bởi ${targetKey.activatedBy?.name || 'người khác'}!`);
    }

    // Đánh dấu mã đã kích hoạt
    const updatedKey = {
      ...targetKey,
      status: 'ACTIVATED',
      activatedBy: {
        userId: user?.id || 'user_current',
        name: user?.name || 'Thầy/Cô Giáo Mới',
        email: user?.email || 'teacher@mimo.com',
        activatedAt: new Date().toLocaleString('vi-VN'),
      },
    };

    keys[foundIndex] = updatedKey;
    setStoredData(STORAGE_KEYS.KEYS, keys);

    // Cập nhật thông tin User trong localStorage
    try {
      const storedUserRaw = localStorage.getItem('mimo_current_user');
      if (storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw);
        storedUser.role = 'EDUCATOR';
        storedUser.school = 'THPT FPT Cần Thơ';
        storedUser.assignedClassCodes = targetKey.assignedClassCodes;
        localStorage.setItem('mimo_current_user', JSON.stringify(storedUser));
      }
    } catch (e) {
      console.error('Error updating current user in localStorage:', e);
    }

    return mockSuccess({
      message: 'Kích hoạt quyền Giáo Viên thành công!',
      role: 'EDUCATOR',
      school: 'THPT FPT Cần Thơ',
      assignedClasses: targetKey.assignedClassCodes,
    });
  },

  // 8. Lấy danh sách Chiến dịch đào tạo bắt buộc
  async getCampaigns() {
    const campaigns = getStoredData(STORAGE_KEYS.CAMPAIGNS, mockBusinessData.campaigns);
    return mockSuccess(campaigns);
  },

  // 9. Tạo Chiến dịch đào tạo mới
  async createCampaign(campaignData) {
    const campaigns = getStoredData(STORAGE_KEYS.CAMPAIGNS, mockBusinessData.campaigns);
    const newCamp = {
      id: `camp_${Date.now()}`,
      title: campaignData.title,
      target: campaignData.target || 'Toàn trường',
      assignedTopic: campaignData.assignedTopic || 'PCCC & Kỹ năng thoát hiểm',
      deadline: campaignData.deadline || '2026-11-15 17:00',
      passingScore: Number(campaignData.passingScore) || 80,
      totalAssigned: 200,
      completedCount: 0,
      complianceRate: 0,
      status: 'RUNNING',
    };
    const updated = [newCamp, ...campaigns];
    setStoredData(STORAGE_KEYS.CAMPAIGNS, updated);
    return mockSuccess(newCamp);
  },

  // 10. Rung chuông nhắc nhở học sinh trong chiến dịch
  async nudgeCampaign(campaignId) {
    return mockSuccess({
      success: true,
      message: '🔔 Đã rung chuông gửi thông báo khẩn đến tất cả học sinh chưa hoàn thành!',
    });
  },

  // 11. Lấy phân tích lỗ hổng PCCC / Red flags
  async getSkillGapAnalysis() {
    return mockSuccess(mockBusinessData.skillGapAnalysis);
  },

  // 12. Lấy danh sách báo cáo kiểm định
  async getAuditReports() {
    return mockSuccess(mockBusinessData.auditReports);
  },
};
