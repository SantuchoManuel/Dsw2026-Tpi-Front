import { useEffect, useMemo, useState } from 'react';
import * as doctorsService from '../../doctors/services/doctorsService';
import * as appointmentsService from '../../appointments/services/appointmentsService';
import {
  getSlotId,
  groupSlotsByDay,
  isSlotAvailable,
} from '../utils/slotUtils';

function useBookAppointment({
  user,
  doctorsApi = doctorsService,
  appointmentsApi = appointmentsService,
} = {}) {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [reason, setReason] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Doctores (una sola carga)
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingDoctors(true);
        const data = await doctorsApi.getDoctors({
          pageSize: 100,
          pageIndex: 1,
        });

        setAllDoctors(data.data || []);
      } catch (err) {
        console.error('Error cargando doctores:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    load();
  }, [doctorsApi]);

  // Especialidades unicas derivadas de los doctores
  const specialties = useMemo(() => {
    const map = new Map();

    allDoctors.forEach((doc) => {
      if (doc.speciality) map.set(doc.speciality.specialityId, doc.speciality);
    });

    return [...map.values()];
  }, [allDoctors]);

  const doctors = useMemo(
    () =>
      selectedSpecialtyId
        ? allDoctors.filter(
            (d) => d.speciality?.specialityId === selectedSpecialtyId
          )
        : [],
    [allDoctors, selectedSpecialtyId]
  );

  // Turnos del doctor elegido
  useEffect(() => {
    if (!selectedDoctorId) {
      setSlots([]);
      setSelectedSlotId('');

      return;
    }

    const load = async () => {
      try {
        setLoadingSlots(true);
        const data = await doctorsApi.getDoctorSlots(selectedDoctorId);

        setSlots((data || []).filter(isSlotAvailable));
        setSelectedSlotId('');
        setWeekOffset(0);
      } catch (err) {
        console.error('Error cargando turnos del doctor:', err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    load();
  }, [selectedDoctorId, doctorsApi]);

  const currentDoctor =
    allDoctors.find((d) => d.id === selectedDoctorId) || null;
  const currentSlot =
    slots.find((s) => getSlotId(s) === selectedSlotId) || null;
  const slotsByDay = useMemo(() => groupSlotsByDay(slots), [slots]);

  const selectSpecialty = (id) => {
    setSelectedSpecialtyId(id);
    setSelectedDoctorId('');
    setSelectedSlotId('');
  };

  const toggleSlot = (slotId) =>
    setSelectedSlotId((prev) => (prev === slotId ? '' : slotId));

  const goPrevWeek = () => setWeekOffset((w) => Math.max(0, w - 1));
  const goNextWeek = () => setWeekOffset((w) => w + 1);

  const confirmAppointment = async () => {
    if (!selectedDoctorId || !selectedSlotId || !reason.trim()) {
      setErrorMessage(
        'Seleccioná un doctor, un horario y escribí el motivo de la consulta.'
      );

      return;
    }

    if (!user?.dni) {
      setErrorMessage('No se encontró el DNI del paciente.');

      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const result = await appointmentsApi.createAppointment({
        doctorId: selectedDoctorId,
        availabilitySlotId: selectedSlotId,
        patient: { dni: Number(user.dni) },
        reason: reason.trim(),
      });

      setConfirmedData(result);
      setSlots((prev) => prev.filter((s) => getSlotId(s) !== selectedSlotId));
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.details?.[0]?.issue ||
          err?.response?.data?.message ||
          'No se pudo confirmar el turno.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setSelectedSlotId('');
    setReason('');
    setConfirmedData(null);
  };

  return {
    specialties,
    doctors,
    loadingDoctors,
    loadingSlots,
    selectedSpecialtyId,
    selectedDoctorId,
    selectedSlotId,
    reason,
    weekOffset,
    slotsByDay,
    currentDoctor,
    currentSlot,
    submitting,
    errorMessage,
    confirmedData,
    canConfirm: Boolean(selectedSlotId && reason.trim()),
    selectSpecialty,
    selectDoctor: setSelectedDoctorId,
    toggleSlot,
    setReason,
    goPrevWeek,
    goNextWeek,
    confirmAppointment,
    resetBooking,
  };
}

export default useBookAppointment;
