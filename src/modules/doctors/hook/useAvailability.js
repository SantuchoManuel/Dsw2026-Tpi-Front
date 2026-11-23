import { useEffect, useState } from 'react';
import { getDoctors, createAvailability } from '../services/doctorsService';

const DEFAULT_SCHEDULE = [
  { day: 'Lunes', active: true, startTime: '08:00', endTime: '16:00' },
  { day: 'Martes', active: true, startTime: '08:00', endTime: '16:00' },
  { day: 'Miércoles', active: true, startTime: '08:00', endTime: '12:00' },
  { day: 'Jueves', active: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Viernes', active: true, startTime: '08:00', endTime: '14:00' },
  { day: 'Sábado', active: false, startTime: '', endTime: '' },
];

const useAvailability = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [weeklySchedule, setWeeklySchedule] = useState(DEFAULT_SCHEDULE);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllDoctors = async () => {
      try {
        const data = await getDoctors({ pageSize: 100, pageIndex: 1 });

        setDoctors(data.data || []);
      } catch (err) {
        console.error('Error al cargar doctores:', err);
      }
    };

    fetchAllDoctors();
  }, [isOpen]);

  const selectedDoctor = doctors.find(
    (d) => String(d.id) === String(selectedDoctorId)
  );

  const open = () => {
    setError('');
    setSuccess('');
    setSelectedDoctorId('');
    setWeeklySchedule(DEFAULT_SCHEDULE);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const toggleDay = (index) => {
    setWeeklySchedule((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              active: !item.active,
              startTime: !item.active ? '08:00' : '',
              endTime: !item.active ? '16:00' : '',
            }
          : item
      )
    );
  };

  const changeTime = (index, field, value) => {
    setWeeklySchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const save = async () => {
    if (!selectedDoctorId) {
      setError('Por favor seleccione un profesional.');

      return;
    }

    const activeDays = weeklySchedule
      .filter((d) => d.active)
      .map((d) => ({ day: d.day, startTime: d.startTime, endTime: d.endTime }));

    if (activeDays.length === 0) {
      setError('Debe activar al menos un día con horario.');

      return;
    }

    try {
      setError('');
      setSuccess('');
      await createAvailability({
        doctorId: selectedDoctorId,
        days: activeDays,
      });
      setSuccess('¡Disponibilidad guardada con exito!');
      setTimeout(() => {
        setIsOpen(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.details?.[0]?.issue ||
          err?.response?.data?.message ||
          'Error al guardar la disponibilidad horaria.'
      );
    }
  };

  return {
    isOpen,
    doctors,
    selectedDoctorId,
    setSelectedDoctorId,
    selectedDoctor,
    weeklySchedule,
    toggleDay,
    changeTime,
    error,
    success,
    open,
    close,
    save,
  };
};

export default useAvailability;
