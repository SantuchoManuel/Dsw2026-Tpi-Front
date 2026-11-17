import { instance } from '../../shared/api/axiosInstance';

export const loginPatient = async (Email, Dni) => {
  if (
    (Email === 'paciente' ||
      Email === 'paciente@medportal.com' ||
      Email === 'paciente@test.com') &&
    Dni === 12345678
  ) {
    return { data: 'mock-patient-token-67890', error: null };
  }

  const response = await instance.post('api/auth/patient/login', {
    Email,
    Dni,
  });

  return { data: response.data.token, error: null };
};
