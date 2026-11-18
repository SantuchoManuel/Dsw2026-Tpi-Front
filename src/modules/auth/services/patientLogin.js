import { instance } from '..//..//shared/api/axiosInstance';

export const loginPatient = async (email, dni) => {
  const response = await instance.post('api/auth/patient/login', {
    email,
    dni: Number(dni), //usamos el number para que el back lo reciba como int
  });

  return { data: response.data, error: null };
};
