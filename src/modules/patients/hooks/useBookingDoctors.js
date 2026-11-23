import { useEffect, useState } from 'react';
import { getDoctors } from '../../doctors/services/doctorsService';

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

  const specialties = [];
  allDoctors.forEach((doc) => {
    const sp = doc.speciality;
    if (sp && !specialties.some((s) => s.specialityId === sp.specialityId)) {
      specialties.push(sp);
    }
  });

  const doctors = allDoctors.filter(
    (d) => d.speciality?.specialityId === selectedSpecialtyId
  );
  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || null;

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