import { instance } from '../../shared/api/axiosInstance';

//para obtener la lista de doctores con paginacion y filtro para buscarlo por un nombre
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

//para obtener las disponibilidades de un doctor por su ID
export const getDoctorAvailabilities = async (doctorId) => {
  const response = await instance.get(`api/doctors/${doctorId}/availabilities`);

  return response.data;
};

//registrar un nuevo doctor
export const createDoctor = async (data) => {
  const response = await instance.post('api/doctors', data);

  return response.data;
};

//modificar un doctor ya creado
export const updateDoctor = async (id, data) => {
  const response = await instance.put(`api/doctors/${id}`, data);

  return response.data;
};

//eliminar un doctor
export const deleteDoctor = async (id) => {
  const response = await instance.delete(`api/doctors/${id}`);

  return response.data;
};

//para crear o asignar disponibilidad horaria a un medico
export const createAvailability = async (data) => {
  const response = await instance.post('api/availabilities', data);

  return response.data;
};

//para actualizar la disponibilidad horaria de un medico
export const updateAvailability = async (data) => {
  const response = await instance.put('api/availabilities', data);

  return response.data;
};
