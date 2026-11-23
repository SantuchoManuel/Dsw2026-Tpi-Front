import Card from '../../shared/components/Card';
import {
  DAY_LABELS,
  MONTH_LABELS,
  MONTH_SHORT,
  parseSlotDate,
  getWeekDays,
  formatTime12h,
} from '../helpers/calendarHelpers';

const DAY_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

function WeeklySlotsCard({
  selectedDoctorId,
  loadingSlots,
  slotsByDay,
  weekOffset,
  setWeekOffset,
  selectedDayKey,
  setSelectedDayKey,
  selectedSlotId,
  setSelectedSlotId,
  reason,
  setReason,
}) {
  const weekDays = getWeekDays(weekOffset);
  const monday = weekDays[0];
  const friday = weekDays[4];
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

  const firstOpenDay = weekDays.find((day) => day >= todayStart) || monday;
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
        className={`w-full py-2.5 md:py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
          isSelected
            ? 'bg-white text-med-primary-900 border-med-primary-900 ring-1 ring-med-primary-900 md:ring-0 md:bg-emerald-400 md:text-white md:border-emerald-400 md:shadow-sm'
            : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <Card className="p-4 sm:p-6">
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
        <>
          {/* Navegacion semanal */}
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
                    className={`snap-start shrink-0 w-16 py-2.5 rounded-xl border flex flex-col items-center transition disabled:opacity-40 disabled:cursor-not-allowed ${
                      isActive
                        ? 'bg-med-primary-900 border-med-primary-900 text-white shadow-sm'
                        : 'bg-white border-med-border text-med-primary-900'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-semibold ${
                        isActive ? 'text-white/80' : 'text-med-text-sub'
                      }`}
                    >
                      {DAY_LABELS[day.getDay()]}
                    </span>
                    <span className="text-lg font-bold leading-tight">
                      {day.getDate()}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isActive ? 'text-white/70' : 'text-med-text-muted'
                      }`}
                    >
                      {MONTH_SHORT[day.getMonth()]}
                    </span>
                  </button>
                );
              })}
            </div>

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
                  renderSlotButton(slot, formatTime12h(getTimeDisplay(slot)))
                )}
              </div>
            )}
          </div>

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
                  <div className="text-center mb-2">
                    <p className="text-[11px] font-semibold text-med-text-sub uppercase tracking-wide">
                      {DAY_LABELS[day.getDay()]}
                    </p>
                    <p className="text-xl font-bold text-med-primary-900">
                      {day.getDate()}
                    </p>
                  </div>

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
  );
}

export default WeeklySlotsCard;