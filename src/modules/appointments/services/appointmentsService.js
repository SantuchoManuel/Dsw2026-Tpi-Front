import { instance } from '../../shared/api/axiosInstance';

export const createAppointment = async (data) => {
  const response = await instance.post('api/appointments', data);

  return response.data;
};

export const searchAppointments = async (params) => {
  const response = await instance.get('api/appointments/search', { params });

  return response.data;
};

export const getAppointmentsByDate = async (date) => {
  const response = await instance.get('api/appointments', { params: { date } });

  return response.data;
};
