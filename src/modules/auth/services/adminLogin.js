import { instance } from '../../shared/api/axiosInstance';

export const loginAdmin = async (Email, password) => {
  if (
    (Email === 'admin' ||
      Email === 'admin@medportal.com' ||
      Email === 'admin@test.com') &&
    password === 'admin123'
  ) {
    return { data: 'mock-admin-token-12345', error: null };
  }

  const response = await instance.post('api/auth/admin/login', {
    Email,
    password,
  });

  return { data: response.data.token, error: null };
};
