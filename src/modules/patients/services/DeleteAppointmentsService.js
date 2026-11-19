import { instance } from '../../shared/api/axiosInstance';

export const deleteAppointment = async (id) => {
    const response = await instance.delete(`api/appointments/${id}`);
    return response.data;
};