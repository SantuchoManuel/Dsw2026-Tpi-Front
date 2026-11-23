import { useEffect, useState } from 'react';
import { getDoctorSlots } from '../../doctors/services/doctorsService';

const getSlotId = (slot) => slot.availabilitySlotId || slot.id;

const isAvailable = (s) =>
  s.status === 'AVAILABLE' || s.status === 0 || s.status === '0' || !s.status;

// trae los turnos disponibles del doctor elegido
const useDoctorSlots = (doctorId) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState('');

  useEffect(() => {
    setSelectedSlotId('');

    if (!doctorId) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoading(true);
        const data = await getDoctorSlots(doctorId);
        setSlots((data || []).filter(isAvailable));
      } catch (err) {
        console.error('Error cargando turnos del doctor:', err);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId]);

  const currentSlot = slots.find((s) => getSlotId(s) === selectedSlotId) || null;

  // saca de la lista el turno que se acaba de reservar
  const removeSlot = (slotId) =>
    setSlots((prev) => prev.filter((s) => getSlotId(s) !== slotId));

  return { slots, loading, selectedSlotId, setSelectedSlotId, currentSlot, removeSlot };
};

export default useDoctorSlots;