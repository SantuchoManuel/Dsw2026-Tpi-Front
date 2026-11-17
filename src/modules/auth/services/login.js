import { instance } from '../../shared/api/axiosInstance';

export const login = async (Email, password) => {
  const response = await instance.post('api/auth/login', {
    Email,
    password,
  });

  return { data: response.data.token, error: null };
};
