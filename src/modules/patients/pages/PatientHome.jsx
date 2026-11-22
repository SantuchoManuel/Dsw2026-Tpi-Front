import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import useBookAppointment from '../hook/useBookAppointment';
import SpecialtyDoctorSelector from '../components/SpecialtyDoctorSelector';
import DoctorInfoCard from '../components/DoctorInfoCard';
import AvailableSlotsCard from '../components/AvailableSlotsCard';
import ReasonField from '../components/ReasonField';
import BookingSummary from '../components/BookingSummary';
import BookingConfirmedModal from '../components/BookingConfirmedModal';

function PatientHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const booking = useBookAppointment({ user });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <SpecialtyDoctorSelector
        specialties={booking.specialties}
        doctors={booking.doctors}
        loading={booking.loadingDoctors}
        specialtyId={booking.selectedSpecialtyId}
        doctorId={booking.selectedDoctorId}
        onSpecialtyChange={booking.selectSpecialty}
        onDoctorChange={booking.selectDoctor}
      />

      <DoctorInfoCard doctor={booking.currentDoctor} />

      <AvailableSlotsCard
        hasDoctor={Boolean(booking.selectedDoctorId)}
        loading={booking.loadingSlots}
        weekOffset={booking.weekOffset}
        onPrevWeek={booking.goPrevWeek}
        onNextWeek={booking.goNextWeek}
        slotsByDay={booking.slotsByDay}
        selectedSlotId={booking.selectedSlotId}
        onSelectSlot={booking.toggleSlot}
      >
        {booking.selectedSlotId && (
          <ReasonField value={booking.reason} onChange={booking.setReason} />
        )}
      </AvailableSlotsCard>

      <BookingSummary
        doctor={booking.currentDoctor}
        slot={booking.currentSlot}
        canConfirm={booking.canConfirm}
        submitting={booking.submitting}
        errorMessage={booking.errorMessage}
        onConfirm={booking.confirmAppointment}
      />

      {booking.confirmedData && (
        <BookingConfirmedModal
          data={booking.confirmedData}
          dni={user?.dni}
          onViewAppointments={() => navigate('/appointments')}
          onBookAnother={booking.resetBooking}
        />
      )}
    </div>
  );
}

export default PatientHome;
