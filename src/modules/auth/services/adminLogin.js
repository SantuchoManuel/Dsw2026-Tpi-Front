import { instance } from '../../shared/api/axiosInstance';

//con instance.post axios se conecta a la url del back
export const loginAdmin = async (email, password) => {
  const response = await instance.post('api/auth/admin/login', {
    email,
    password,
  });

  return { data: response.data, error: null }; //response.data tiene lo que seria el token { token: "...", role: "ADMINISTRADOR"}
};
