import { instance } from '../../shared/api/axiosInstance';

export const createAppointment = async (data) => {
  const response = await instance.post('api/appointments', data);

  return response.data;
};
