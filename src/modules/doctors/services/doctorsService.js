import { instance } from '../../shared/api/axiosInstance';

export const getDoctors = async ({
  pageSize = 10,
  pageIndex = 1,
  name = '',
} = {}) => {
  const params = { pageSize, pageIndex };

  if (name && name.trim()) {
    params.name = name.trim();
  }

  const response = await instance.get('api/doctors', { params });

  return response.data;
};

export const getDoctorAvailabilities = async (doctorId) => {
  const response = await instance.get(`api/doctors/${doctorId}/availabilities`);

  return response.data;
};

export const getDoctorSlots = async (doctorId) => {
  const response = await instance.get(`api/doctors/${doctorId}/slots`);

  return response.data;
};

export const createDoctor = async (data) => {
  const response = await instance.post('api/doctors', data);

  return response.data;
};

export const updateDoctor = async (id, data) => {
  const response = await instance.put(`api/doctors/${id}`, data);

  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await instance.delete(`api/doctors/${id}`);

  return response.data;
};

export const createAvailability = async (data) => {
  const response = await instance.post('api/availabilities', data);

  return response.data;
};

export const updateAvailability = async (data) => {
  const response = await instance.put('api/availabilities', data);

  return response.data;
};
