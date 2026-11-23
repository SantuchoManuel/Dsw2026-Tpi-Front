import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import {
  DAY_LABELS,
  MONTH_LABELS,
  MONTH_SHORT,
  parseSlotDate,
  getWeekDays,
  groupSlotsByDay,
  formatTime12h,
} from '../helpers/calendarHelpers';
import useBookingDoctors from '../hooks/useBookingDoctors';
import useDoctorSlots from '../hooks/useDoctorSlots';
import useConfirmAppointment from '../hooks/useConfirmAppointment';

function PatientHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. especialidades y doctores
  const {
    specialties,
    doctors,
    currentDoctor,
    selectedSpecialtyId,
    selectSpecialty: setSelectedSpecialtyId, // la renombramos para no tocar el JSX
    selectedDoctorId,
    setSelectedDoctorId,
    loading: loadingDoctors,
  } = useBookingDoctors();
  const loadingSpecialties = loadingDoctors;

  // 2. turnos del doctor elegido
  const {
    slots,
    loading: loadingSlots,
    selectedSlotId,
    setSelectedSlotId,
    currentSlot,
    removeSlot,
  } = useDoctorSlots(selectedDoctorId);

  // 3. motivo y confirmación del turno
  const {
    reason,
    setReason,
    submitting,
    errorMessage,
    confirmedData,
    confirm,
    reset,
  } = useConfirmAppointment();

  const handleConfirmAppointment = async () => {
    const ok = await confirm(selectedDoctorId, selectedSlotId);
    if (ok) removeSlot(selectedSlotId);
  };

  const handleBookAnother = () => {
    reset();
    setSelectedSlotId('');
  };

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayKey, setSelectedDayKey] = useState('');
  const slotsByDay = groupSlotsByDay(slots);

  useEffect(() => {
    setWeekOffset(0);
    setSelectedDayKey('');
  }, [selectedDoctorId]);

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
                  {loadingSpecialties
                    ? 'Cargando...'
                    : 'Seleccione una especialidad'}
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
                  {loadingDoctors
                    ? 'Cargando...'
                    : !selectedSpecialtyId
                      ? 'Primero seleccione una especialidad'
                      : doctors.length === 0
                        ? 'Sin doctores disponibles'
                        : 'Seleccione un doctor'}
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
      <Card className="p-5 sm:p-6">
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
      <Card className="p-4 sm:p-6">
        {/* Fila 1: Título + Leyenda (solo desktop) */}
        <div className="hidden md:flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm sm:text-base text-med-primary-900">
            Horarios Disponibles
          </h3>
          <div className="flex items-center gap-4 text-[11px] text-med-text-sub">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-med-primary-900 inline-block" />
              Disponible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Seleccionado
            </span>
          </div>
        </div>

        {!selectedDoctorId ? (
          <p className="text-xs text-med-text-muted text-center py-6">
            Seleccioná un doctor para ver sus horarios.
          </p>
        ) : loadingSlots ? (
          <p className="text-xs text-med-text-muted text-center py-6">
            Cargando horarios...
          </p>
        ) : (
          (() => {
            const weekDays = getWeekDays(weekOffset);
            const monday = weekDays[0];
            const friday = weekDays[4];
            const DAY_FULL = [
              'Domingo',
              'Lunes',
              'Martes',
              'Miércoles',
              'Jueves',
              'Viernes',
              'Sábado',
            ];
            const navLabel = `${DAY_FULL[monday.getDay()]} ${monday.getDate()} - ${DAY_FULL[friday.getDay()]} ${friday.getDate()}, ${MONTH_LABELS[friday.getMonth()]}`;
            const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
            const getDayKey = (day) => day.toISOString().slice(0, 10);
            const getDaySlots = (dayKey) =>
              (slotsByDay[dayKey] || []).sort((a, b) =>
                (a.startTime || '').localeCompare(b.startTime || '')
              );
            const getTimeDisplay = (slot) =>
              slot.startTime ||
              (parseSlotDate(slot)
                ? parseSlotDate(slot).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : '');

            const firstOpenDay =
              weekDays.find((day) => day >= todayStart) || monday;
            const activeDayKey = weekDays.some(
              (day) => getDayKey(day) === selectedDayKey
            )
              ? selectedDayKey
              : getDayKey(firstOpenDay);
            const activeDaySlots = getDaySlots(activeDayKey);


            const renderSlotButton = (slot, label) => {
              const slotId = slot.availabilitySlotId || slot.id;
              const isSelected = selectedSlotId === slotId;

              return (
                <button
                  key={slotId}
                  type="button"
                  onClick={() => setSelectedSlotId(isSelected ? '' : slotId)}
                  className={`w-full py-2.5 md:py-2 text-xs font-semibold rounded-lg border transition-all text-center ${isSelected
                    ? 'bg-white text-med-primary-900 border-med-primary-900 ring-1 ring-med-primary-900 md:ring-0 md:bg-emerald-400 md:text-white md:border-emerald-400 md:shadow-sm'
                    : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                    }`}
                >
                  {label}
                </button>
              );
            };

            return (
              <>
                {/* Navegación semanal */}
                <div className="flex items-center gap-2 mb-3 md:mb-5">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w - 1)}
                    disabled={weekOffset === 0}
                    className="flex h-7 w-5 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30"
                  >
                    ‹
                  </button>
                  <span className="text-sm font-bold md:text-base md:font-normal text-med-primary-900">
                    {navLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w + 1)}
                    className="flex h-7 w-5 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>


                <div className="md:hidden">
                  {/* Leyenda */}
                  <div className="flex items-center gap-4 text-[11px] text-med-text-sub">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-med-primary-900 inline-block" />
                      Disponible
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      Seleccionado
                    </span>
                  </div>

                  <hr className="my-4 border-med-border-subtle" />

                  {/* Próximos Turnos + Ver más */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-med-text-main">
                      Próximos Turnos
                    </h3>
                    <button
                      type="button"
                      onClick={() => setWeekOffset((w) => w + 1)}
                      className="text-xs font-semibold text-med-primary-700"
                    >
                      Ver más ›
                    </button>
                  </div>

                  {/* Chips de días con scroll horizontal */}
                  <div className="flex gap-2 overflow-x-auto pb-1 snap-x [scrollbar-width:none]">
                    {weekDays.map((day) => {
                      const dayKey = getDayKey(day);
                      const isActive = dayKey === activeDayKey;

                      return (
                        <button
                          key={dayKey}
                          type="button"
                          onClick={() => setSelectedDayKey(dayKey)}
                          disabled={day < todayStart}
                          className={`snap-start shrink-0 w-16 py-2.5 rounded-xl border flex flex-col items-center transition disabled:opacity-40 disabled:cursor-not-allowed ${isActive
                            ? 'bg-med-primary-900 border-med-primary-900 text-white shadow-sm'
                            : 'bg-white border-med-border text-med-primary-900'
                            }`}
                        >
                          <span
                            className={`text-[10px] font-semibold ${isActive ? 'text-white/80' : 'text-med-text-sub'}`}
                          >
                            {DAY_LABELS[day.getDay()]}
                          </span>
                          <span className="text-lg font-bold leading-tight">
                            {day.getDate()}
                          </span>
                          <span
                            className={`text-[10px] ${isActive ? 'text-white/70' : 'text-med-text-muted'}`}
                          >
                            {MONTH_SHORT[day.getMonth()]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Horarios del día elegido */}
                  <h4 className="mt-5 mb-3 text-xs font-semibold text-med-text-sub">
                    Horarios disponibles (Bloques de 30 min)
                  </h4>
                  {activeDaySlots.length === 0 ? (
                    <p className="text-xs text-med-text-muted text-center italic py-4">
                      No hay turnos disponibles para este día.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {activeDaySlots.map((slot) =>
                        renderSlotButton(
                          slot,
                          formatTime12h(getTimeDisplay(slot))
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* ---------- DESKTOP (md en adelante): igual que antes ---------- */}
                <div className="hidden md:grid grid-cols-5 gap-3">
                  {weekDays.map((day) => {
                    const dayKey = getDayKey(day);
                    const daySlots = getDaySlots(dayKey);
                    const isPast = day < todayStart;

                    return (
                      <div
                        key={dayKey}
                        className="flex flex-col items-stretch gap-1.5"
                      >
                        {/* Cabecera del día */}
                        <div className="text-center mb-2">
                          <p className="text-[11px] font-semibold text-med-text-sub uppercase tracking-wide">
                            {DAY_LABELS[day.getDay()]}
                          </p>
                          <p className="text-xl font-bold text-med-primary-900">
                            {day.getDate()}
                          </p>
                        </div>

                        {/* Slots o mensaje */}
                        {isPast ? (
                          <p className="text-[10px] text-med-text-muted text-center italic leading-snug">
                            Día pasado
                          </p>
                        ) : daySlots.length === 0 ? (
                          <p className="text-[10px] text-med-text-muted text-center italic leading-snug px-1">
                            No hay turnos disponibles para este día.
                          </p>
                        ) : (
                          daySlots.map((slot) =>
                            renderSlotButton(slot, getTimeDisplay(slot))
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()
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
                      d.toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

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
            <p className="text-xs text-red-600 sm:text-right">{errorMessage}</p>
          )}
          <Button
            type="button"
            onClick={handleConfirmAppointment}
            disabled={!selectedSlotId || !reason.trim() || submitting}
            className="flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{submitting ? 'Confirmando...' : 'Confirmar Turno'}</span>
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Modal de Confirmación Exitosa */}
      {confirmedData && (
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
                <strong>DNI Paciente:</strong> {user?.dni}
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full text-xs py-2.5"
                onClick={() => navigate('/appointments')}
              >
                Ver Mis Turnos
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={handleBookAnother}
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
