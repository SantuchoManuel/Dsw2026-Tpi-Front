import { useState, useEffect } from 'react';
import useAuth from '../../auth/hook/useAuth';
import { getDoctors, getDoctorSlots } from '../../doctors/services/doctorsService';
import { createAppointment } from '../../appointments/services/appointmentsService';

export function useAppointmentBooking() {
    const { user } = useAuth();
    // Datos
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    // Selecciones
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [reason, setReason] = useState('');
    // Carga
    const [loadingSpecialties, setLoadingSpecialties] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmedModal, setConfirmedModal] = useState(false);
    const [confirmedData, setConfirmedData] = useState(null);
    const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || null;
    const currentSlot = slots.find((s) => (s.availabilitySlotId || s.id) === selectedSlotId) || null;

    useEffect(() => {
        const fetchSpecialtiesFromDoctors = async () => {
            try {
                setLoadingSpecialties(true);
                const data = await getDoctors({ pageSize: 100, pageIndex: 1 });
                const allDoctors = data.data || [];
                // Extraemos especialidades únicas de los doctores
                const seen = new Set();
                const uniqueSpecialties = [];

                allDoctors.forEach((doc) => {
                    if (doc.speciality && !seen.has(doc.speciality.specialityId)) {
                        seen.add(doc.speciality.specialityId);
                        uniqueSpecialties.push(doc.speciality);
                    }
                });
                setSpecialties(uniqueSpecialties);
            } catch (err) {
                console.error('Error cargando especialidades:', err);
            } finally {
                setLoadingSpecialties(false);
            }
        };

        fetchSpecialtiesFromDoctors();
    }, []);

    useEffect(() => {
        if (!selectedSpecialtyId) {
            setDoctors([]);
            setSelectedDoctorId('');
            setSlots([]);
            setSelectedSlotId('');

            return;
        }

        // Filtramos los doctores que ya cargamos
        const fetchDoctorsBySpecialty = async () => {
            try {
                setLoadingDoctors(true);
                const data = await getDoctors({ pageSize: 100, pageIndex: 1 });
                const filtered = (data.data || []).filter(
                    (d) => d.speciality?.specialityId === selectedSpecialtyId
                );

                setDoctors(filtered);
                setSelectedDoctorId('');
                setSlots([]);
                setSelectedSlotId('');
            } catch (err) {
                console.error('Error cargando doctores:', err);
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctorsBySpecialty();
    }, [selectedSpecialtyId]);

    useEffect(() => {
        if (!selectedDoctorId) {
            setSlots([]);
            setSelectedSlotId('');

            return;
        }

        const fetchSlots = async () => {
            try {
                setLoadingSlots(true);
                const data = await getDoctorSlots(selectedDoctorId);
                // Filtramos solo los turnos disponibles para reservar
                const availableSlots = (data || []).filter(
                    (s) =>
                        s.status === 'AVAILABLE' ||
                        s.status === 0 ||
                        s.status === '0' ||
                        !s.status
                );

                setSlots(availableSlots);
                setSelectedSlotId('');
            } catch (err) {
                console.error('Error cargando turnos del doctor:', err);
                setSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [selectedDoctorId]);

    const handleConfirmAppointment = async () => {
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
            const result = await createAppointment({
                doctorId: selectedDoctorId,
                availabilitySlotId: selectedSlotId,
                patient: { dni: Number(user.dni) },
                reason: reason.trim(),
            });

            setConfirmedData(result);
            setConfirmedModal(true);
            // Actualizamos los slots para no mostrar el que acabamos de reservar
            setSlots((prev) =>
                prev.filter((s) => (s.availabilitySlotId || s.id) !== selectedSlotId)
            );
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

    return {
        specialties,
        doctors,
        slots,
        currentDoctor,
        currentSlot,
        selectedSpecialtyId,
        setSelectedSpecialtyId,
        selectedDoctorId,
        setSelectedDoctorId,
        selectedSlotId,
        setSelectedSlotId,
        reason,
        setReason,
        loading: {
            specialties: loadingSpecialties, doctors: loadingDoctors, slots: loadingSlots, submitting,
        },
        errorMessage,
        confirmedModal,
        setConfirmedModal,
        confirmedData,
        confirmAppointment: handleConfirmAppointment,
    };
}