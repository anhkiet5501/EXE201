/**
 * Tiện ích điều hướng theo Role người dùng sau khi đăng nhập
 */
export const ROLES = {
  LEARNER: 'LEARNER',
  CURATOR: 'CURATOR',
  EDUCATOR: 'EDUCATOR',
  ADMIN: 'ADMIN',
};

export const getRedirectPathByRole = (role) => {
  switch (role) {
    case ROLES.LEARNER:
      return '/learn';
    case ROLES.CURATOR:
      return '/studio';
    case ROLES.EDUCATOR:
      return '/learn/classroom';
    case ROLES.ADMIN:
      return '/admin';
    default:
      return '/';
  }
};
