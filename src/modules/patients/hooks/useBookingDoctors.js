import { useEffect, useState } from 'react';
import { getDoctors } from '../../doctors/services/doctorsService';

// trae los doctores una sola vez y arma las especialidades a partir de ellos
const useBookingDoctors = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getDoctors({ pageSize: 100, pageIndex: 1 });
        setAllDoctors(data.data || []);
      } catch (err) {
        console.error('Error cargando doctores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // especialidades sin repetir
  const specialties = [];
  allDoctors.forEach((doc) => {
    const sp = doc.speciality;
    if (sp && !specialties.some((s) => s.specialityId === sp.specialityId)) {
      specialties.push(sp);
    }
  });

  // doctores de la especialidad elegida
  const doctors = allDoctors.filter(
    (d) => d.speciality?.specialityId === selectedSpecialtyId
  );
  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || null;

  // al cambiar de especialidad limpiamos el doctor
  const selectSpecialty = (id) => {
    setSelectedSpecialtyId(id);
    setSelectedDoctorId('');
  };

  return {
    specialties,
    doctors,
    currentDoctor,
    selectedSpecialtyId,
    selectSpecialty,
    selectedDoctorId,
    setSelectedDoctorId,
    loading,
  };
};

export default useBookingDoctors;