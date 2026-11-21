import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import { getDoctors, getDoctorAvailabilities, getDoctorSlots } from '../../doctors/services/doctorsService';
import { createAppointment } from '../../appointments/services/appointmentsService';

function PatientHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);

  const [slots, setSlots] = useState([]);


  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [reason, setReason] = useState('');
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [confirmedModal, setConfirmedModal] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || null;
  const currentSlot =
    slots.find((s) => (s.availabilitySlotId || s.id) === selectedSlotId) || null;

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

  const parseSlotDate = (slot) => {
    if (!slot) return null;
    if (slot.date) return new Date(slot.date);
      const dateStr = slot.date;
    const timeStr = slot.startTime || slot.horaDeInicio || '00:00';
    if (!dateStr) return null;
    return new Date(`${dateStr}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDoctorId || !selectedSlotId || !reason.trim()) {
      setErrorMessage('Seleccioná un doctor, un horario y escribí el motivo de la consulta.');
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

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* 1. Card Superior: Selector de Especialidad y Doctor */}
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Seleccione la especialidad y el profesional para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Especialidad */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Seleccionar Especialidad
            </label>
            <div className="relative">
              <select
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer"
                disabled={loadingSpecialties}
              >
                <option value="">
                  {loadingSpecialties ? 'Cargando...' : 'Seleccione una especialidad'}
                </option>
                {specialties.map((sp) => (
                  <option key={sp.specialityId} value={sp.specialityId}>
                    {sp.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
                ▼
              </span>
            </div>
          </div>

          {/* Doctor */}
          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Seleccionar Doctor
            </label>
            <div className="relative">
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer"
                disabled={!selectedSpecialtyId || loadingDoctors}
              >
                <option value="">
                  {loadingDoctors ? 'Cargando...' : !selectedSpecialtyId ? 'Primero seleccione una especialidad' : doctors.length === 0 ? 'Sin doctores disponibles' : 'Seleccione un doctor'}
                </option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
                ▼
              </span>
            </div>
          </div>

          {/* Botón Buscar Disponibilidad */}
          <div className="md:col-span-3">
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2.5 rounded-lg shadow-sm"
              onClick={() => { }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Buscar Disponibilidad</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Card de Información del Doctor Seleccionado (Sin reseñas de doctor) */}
      <Card className="p-5 sm:p-6 border-med-border">
        {!currentDoctor ? (
          <p className="text-xs text-med-text-muted text-center py-2">
            Seleccioná una especialidad y un doctor para ver su información.
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200">
                👨‍⚕️
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
                  {currentDoctor.name}
                </h2>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-med-primary-100 text-med-primary-700">
                  Verificado
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-med-primary-700 mt-0.5">
                {currentDoctor.speciality?.name || 'Sin especialidad'}
              </p>
              <p className="text-xs text-med-text-muted mt-0.5">
                Matrícula: {currentDoctor.licenseNumber || 'S/D'}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* 3. Selector Semanal de Turnos */}
      <Card className="p-5 sm:p-6 border-med-border">
        <div className="mb-4">
          <h3 className="font-bold text-sm sm:text-base text-med-primary-900">
            Horarios Disponibles
          </h3>
          <p className="text-xs text-med-text-sub mt-0.5">
            Seleccioná un turno disponible para continuar.
          </p>
        </div>
        {!selectedDoctorId ? (
          <p className="text-xs text-med-text-muted text-center py-6">
            Seleccioná un doctor para ver sus horarios.
          </p>
        ) : loadingSlots ? (
          <p className="text-xs text-med-text-muted text-center py-6">
            Cargando horarios...
          </p>
        ) : slots.length === 0 ? (
          <p className="text-xs text-med-text-muted text-center py-6">
            Este doctor no tiene turnos disponibles en este momento.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {slots.map((slot) => {
              const slotId = slot.availabilitySlotId || slot.id;
              const fecha = parseSlotDate(slot);
              const isSelected = selectedSlotId === slotId;
              const timeDisplay = slot.startTime || (fecha ? fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '');

              return (
                <button
                  key={slotId}
                  type="button"
                  onClick={() => setSelectedSlotId(slotId)}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${isSelected
                    ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
                    : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                    }`}
                >
                  <span className="block font-bold capitalize">
                    {fecha
                      ? fecha.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })
                      : slot.date}
                  </span>
                  <span className="block mt-0.5">
                    {timeDisplay} hs
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {/* Campo Motivo */}
        {selectedSlotId && (
          <div className="mt-5 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Motivo de la consulta <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Control de presión arterial, dolor de cabeza frecuente..."
              className="w-full border border-med-border rounded-lg px-3.5 py-2 text-sm text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-2 focus:ring-med-primary-600 resize-none"
            />
          </div>
        )}
      </Card>

      {/* 4. Banner / Resumen de Selección y Confirmación */}
      <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="border-l-4 border-med-primary-900 pl-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
            Resumen de Selección
          </span>
          {currentSlot && currentDoctor ? (
            <>
              <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
                <span>📅</span>
                <span>
                  {(() => {
                    const d = parseSlotDate(currentSlot);
                    if (!d) return '';
                    const dateFormatted = d.toLocaleDateString('es-AR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    });
                    const timeFormatted =
                      currentSlot.startTime ||
                      d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                    return `${dateFormatted} - ${timeFormatted} hs`;
                  })()}
                </span>
              </p>
              <p className="text-xs text-med-text-sub mt-0.5">
                {currentDoctor.name} • {currentDoctor.speciality?.name}
              </p>
            </>
          ) : (
            <p className="text-sm text-med-text-muted mt-0.5">
              Seleccioná un turno para ver el resumen.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {errorMessage && (
            <p className="text-xs text-red-600 text-right">{errorMessage}</p>
          )}
          <Button
            type="button"
            onClick={handleConfirmAppointment}
            disabled={!selectedSlotId || !reason.trim() || submitting}
            className="flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{submitting ? 'Confirmando...' : 'Confirmar Turno'}</span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Modal de Confirmación Exitosa */}
      {confirmedModal && confirmedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-med-primary-900">¡Turno Confirmado!</h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno con{' '}
              <strong className="text-med-text-main">{confirmedData.doctorName}</strong>{' '}
              fue reservado para el{' '}
              <strong className="text-med-text-main">
                {new Date(confirmedData.date).toLocaleDateString('es-AR', {
                  weekday: 'long', day: '2-digit', month: 'long'
                })}{' '}
                a las{' '}
                {new Date(confirmedData.date).toLocaleTimeString('es-AR', {
                  hour: '2-digit', minute: '2-digit'
                })} hs
              </strong>.
            </p>
            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p><strong>Motivo:</strong> {confirmedData.reason}</p>
              <p><strong>DNI Paciente:</strong> {user?.dni}</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button className="w-full text-xs py-2.5" onClick={() => navigate('/appointments')}>
                Ver Mis Turnos
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={() => {
                  setConfirmedModal(false);
                  setSelectedSlotId('');
                  setReason('');
                  setConfirmedData(null);
                }}
              >
                Reservar Otro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHome;
