import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useNavigate } from 'react-router-dom';
import { usePatientAppointments } from '../hooks/usePatientAppointments';

function AppointmentsPage() {
  const navigate = useNavigate();
  const { appointments, loading, cancelAppointment } = usePatientAppointments();

  const handleDeleteAppointment = async (id) => {
    const result = await cancelAppointment(id);

    if (!result.success) {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-sm text-med-text-sub">Cargando tus turnos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consulta y gestiona las citas médicas programadas.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>+ Solicitar Nuevo Turno</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {appointments.length === 0 ? (
          <p className="text-sm text-med-text-sub col-span-2 text-center py-8">
            No tienes turnos programados.
          </p>
        ) : (
          appointments.map((appt) => {
            const fechaObj = new Date(appt.date);
            const fechaValida = !isNaN(fechaObj.getTime());

            return (
              <Card
                key={appt.id}
                className="relative flex flex-col justify-between gap-4 p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      Activo
                      {appt.state}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-med-primary-900">
                    {appt.doctorName}
                  </h3>
                  <p className="text-sm text-med-text-sub mt-2">
                    Fecha:{' '}
                    <strong className="text-med-text-main font-semibold">
                      {fechaValida ? fechaObj.toLocaleDateString('es-AR') : '—'}
                    </strong>{' '}
                    a las{' '}
                    <strong className="text-med-text-main font-semibold">
                      {fechaValida
                        ? fechaObj.toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}{' '}
                    </strong>
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t border-med-border">
                  <Button
                    variant="outline"
                    className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeleteAppointment(appt.id)}
                  >
                    Cancelar Turno
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AppointmentsPage;
