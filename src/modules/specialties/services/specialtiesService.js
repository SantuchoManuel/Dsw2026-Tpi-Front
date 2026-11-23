import { instance } from '../../shared/api/axiosInstance';

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

export const createSpecialty = async ({ name, description }) => {
  const response = await instance.post('api/specialities', {
    name,
    description,
  });

  return response.data;
};

export const updateSpecialty = async (id, { name, description }) => {
  const response = await instance.put(`api/specialities/${id}`, {
    name,
    description,
  });

  return response.data;
};

export const deleteSpecialty = async (id) => {
  const response = await instance.delete(`api/specialities/${id}`);

  return response.data;
};
