import { useState } from 'react';
import useAuth from '../../auth/hook/useAuth';
import { createAppointment } from '../../appointments/services/appointmentsService';

// motivo de la consulta + confirmar el turno
const useConfirmAppointment = () => {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedData, setConfirmedData] = useState(null);

  // devuelve true si se pudo reservar
  const confirm = async (doctorId, slotId) => {
    if (!doctorId || !slotId || !reason.trim()) {
      setErrorMessage('Seleccioná un doctor, un horario y escribí el motivo de la consulta.');
      return false;
    }

    if (!user?.dni) {
      setErrorMessage('No se encontró el DNI del paciente.');
      return false;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const result = await createAppointment({
        doctorId,
        availabilitySlotId: slotId,
        patient: { dni: Number(user.dni) },
        reason: reason.trim(),
      });
      setConfirmedData(result);
      return true;
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.details?.[0]?.issue ||
          err?.response?.data?.message ||
          'No se pudo confirmar el turno.'
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // para "Reservar otro"
  const reset = () => {
    setConfirmedData(null);
    setReason('');
  };

  return { reason, setReason, submitting, errorMessage, confirmedData, confirm, reset };
};

export default useConfirmAppointment;