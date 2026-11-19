import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import { getAppointments } from '../services/GetAppointmentsService';
import { deleteAppointment } from '../services/DeleteAppointmentsService';

function AppointmentsPage() {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sampleAppointments = [
    {
      id: 1,
      doctor: 'Dra. María González',
      specialty: 'Cardiología',
      date: '2026-10-28',
      time: '10:30 hs',
      status: 'Confirmado',
    },
    {
      id: 2,
      doctor: 'Dr. Lucas Fernández',
      specialty: 'Traumatología',
      date: '2026-11-05',
      time: '15:00 hs',
      status: 'Pendiente',
    },
  ];

  const fetchAppointments = async () => {
    if (!user?.dni) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getAppointments(user.dni);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar turnos:', err);
      setError(err?.response?.data?.message || 'Error al obtener tus turnos médicos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.dni]);


  const handleDeleteAppointment = async (id) => {
    try {
      await deleteAppointment(id);
      fetchAppointments(); // Refresca los turnos
    } catch (err) {
      alert(err?.response?.data?.message || 'No se pudo cancelar el turno.');
    }
  };

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
        <Button onClick={() => navigate('/')}>
          + Solicitar Nuevo Turno
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {appointments.length === 0 ? (
          <p className="text-sm text-med-text-sub col-span-2 text-center py-8">
            No tienes turnos programados.
          </p>
        ) : (
          appointments.map((appt) => {
            const fechaObj = new Date(appt.fecha);
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
                      {fechaObj.toLocaleDateString('es-AR')}
                    </strong>{' '}
                    a las{' '}
                    <strong className="text-med-text-main font-semibold">
                      {fechaObj.toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
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
