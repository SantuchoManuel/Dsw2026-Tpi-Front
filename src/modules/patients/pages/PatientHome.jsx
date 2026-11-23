import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import { groupSlotsByDay } from '../helpers/calendarHelpers';
import useBookingDoctors from '../hooks/useBookingDoctors';
import useDoctorSlots from '../hooks/useDoctorSlots';
import useConfirmAppointment from '../hooks/useConfirmAppointment';
import SpecialtyDoctorSelector from '../components/SpecialtyDoctorSelector';
import DoctorInfoCard from '../components/DoctorInfoCard';
import WeeklySlotsCard from '../components/WeeklySlotsCard';
import BookingSummaryBanner from '../components/BookingSummaryBanner';
import BookingConfirmedModal from '../components/BookingConfirmedModal';

function PatientHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    specialties,
    doctors,
    currentDoctor,
    selectedSpecialtyId,
    selectSpecialty,
    selectedDoctorId,
    setSelectedDoctorId,
    loading: loadingDoctors,
  } = useBookingDoctors();

  const {
    slots,
    loading: loadingSlots,
    selectedSlotId,
    setSelectedSlotId,
    currentSlot,
    removeSlot,
  } = useDoctorSlots(selectedDoctorId);

  const {
    reason,
    setReason,
    submitting,
    errorMessage,
    confirmedData,
    confirm,
    reset,
  } = useConfirmAppointment();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayKey, setSelectedDayKey] = useState('');
  const slotsByDay = groupSlotsByDay(slots);

  useEffect(() => {
    setWeekOffset(0);
    setSelectedDayKey('');
  }, [selectedDoctorId]);

  const handleConfirmAppointment = async () => {
    const ok = await confirm(selectedDoctorId, selectedSlotId);

    if (ok) removeSlot(selectedSlotId);
  };

  const handleBookAnother = () => {
    reset();
    setSelectedSlotId('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <SpecialtyDoctorSelector
        specialties={specialties}
        doctors={doctors}
        loadingSpecialties={loadingDoctors}
        loadingDoctors={loadingDoctors}
        selectedSpecialtyId={selectedSpecialtyId}
        onSelectSpecialty={selectSpecialty}
        selectedDoctorId={selectedDoctorId}
        onSelectDoctor={setSelectedDoctorId}
      />

      <DoctorInfoCard doctor={currentDoctor} />

      <WeeklySlotsCard
        selectedDoctorId={selectedDoctorId}
        loadingSlots={loadingSlots}
        slotsByDay={slotsByDay}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
        selectedDayKey={selectedDayKey}
        setSelectedDayKey={setSelectedDayKey}
        selectedSlotId={selectedSlotId}
        setSelectedSlotId={setSelectedSlotId}
        reason={reason}
        setReason={setReason}
      />

      <BookingSummaryBanner
        currentDoctor={currentDoctor}
        currentSlot={currentSlot}
        selectedSlotId={selectedSlotId}
        reason={reason}
        submitting={submitting}
        errorMessage={errorMessage}
        onConfirm={handleConfirmAppointment}
      />

      <BookingConfirmedModal
        confirmedData={confirmedData}
        dni={user?.dni}
        onViewAppointments={() => navigate('/appointments')}
        onBookAnother={handleBookAnother}
      />
    </div>
  );
}

export default PatientHome;
