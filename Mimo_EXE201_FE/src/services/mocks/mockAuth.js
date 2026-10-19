/**
 * Mock data tài khoản mẫu cho 4 Role để test đăng nhập
 */
export const mockAccounts = [
  {
    id: 'user_bgh',
    email: 'bgh.fpt@mimo.com',
    password: '123',
    name: 'Thầy Hiệu Trưởng Lê Trọng Đạt (BGH)',
    role: 'ADMIN',
    school: 'THPT FPT Cần Thơ',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PrincipalDat',
  },
  {
    id: 'user_3',
    email: 'educator@mimo.com',
    password: '123',
    name: 'Thầy Nguyễn Văn Nam (GV PCCC)',
    role: 'EDUCATOR',
    orgRole: 'TEACHER', // Giáo viên bộ môn
    school: 'THPT FPT Cần Thơ',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherNam',
  },
  {
    id: 'user_mai',
    email: 'gv.mai@mimo.com',
    password: '123',
    name: 'Cô BS. Trần Thị Mai (GV Y Tế)',
    role: 'EDUCATOR',
    orgRole: 'TEACHER',
    school: 'THPT Chuyên Lê Hồng Phong',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherMai',
  },
  {
    id: 'user_1',
    email: 'learner@mimo.com',
    password: '123',
    name: 'Nguyễn Văn Học (Learner)',
    role: 'LEARNER',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Learner',
  },
  {
    id: 'user_2',
    email: 'curator@mimo.com',
    password: '123',
    name: 'Trần Thị Sáng Tạo (Curator)',
    role: 'CURATOR',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Curator',
  },
  {
    id: 'user_4',
    email: 'admin@mimo.com',
    password: '123',
    name: 'Quản Trị Viên (Admin Hệ Thống)',
    role: 'ADMIN',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
  },
];
