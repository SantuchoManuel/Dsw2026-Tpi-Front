import { instance } from '../../shared/api/axiosInstance';

export const getAppointments = async (dni) => {
  const params = { dni: Number(dni) }

  const response = await instance.get('api/appointments/patient', { params });

  return response.data;
};



/*
export const getSpecialties = async ({
  pageSize = 10,
  pageIndex = 1,
  name = '',
} = {}) => {
  const params = { pageSize, pageIndex };

  if (name && name.trim().length > 0) {
    params.name = name.trim();
  }

  const response = await instance.get('api/specialities', { params });

  return response.data;
};

export const loginPatient = async (email, dni) => {
  const response = await instance.post('api/auth/patient/login', {
    email,
    dni: Number(dni), //usamos el number para que el back lo reciba como int
  });

  return { data: response.data, error: null };
};
*/