import Button from '../../shared/components/Button';

function BookingConfirmedModal({
  confirmedData,
  dni,
  onViewAppointments,
  onBookAnother,
}) {
  if (!confirmedData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-med-primary-900">
          ¡Turno Confirmado!
        </h3>
        <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
          Tu turno con{' '}
          <strong className="text-med-text-main">
            {confirmedData.doctorName}
          </strong>{' '}
          fue reservado para el{' '}
          <strong className="text-med-text-main">
            {new Date(confirmedData.date).toLocaleDateString('es-AR', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
            })}{' '}
            a las{' '}
            {new Date(confirmedData.date).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            hs
          </strong>
          .
        </p>
        <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
          <p>
            <strong>Motivo:</strong> {confirmedData.reason}
          </p>
          <p>
            <strong>DNI Paciente:</strong> {dni}
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button className="w-full text-xs py-2.5" onClick={onViewAppointments}>
            Ver Mis Turnos
          </Button>
          <Button
            variant="secondary"
            className="w-full text-xs py-2.5"
            onClick={onBookAnother}
          >
            Reservar Otro
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmedModal;