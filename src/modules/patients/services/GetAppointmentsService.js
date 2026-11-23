import { instance } from '../../shared/api/axiosInstance';

export const getAppointments = async (dni) => {
  const params = { dni: Number(dni) };

  const response = await instance.get('api/appointments/patient', { params });

  return response.data;
};
