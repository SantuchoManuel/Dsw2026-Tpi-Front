import Card from '../../shared/components/Card';
import { formatWeekRange, getWeekDays } from '../../shared/utils/dateUtils';
import WeekNavigator from './WeekNavigator';
import DayChips from './DayChips';
import SlotGrid from './SlotGrid';

function AvailableSlotsCard({
  hasDoctor,
  loading,
  weekOffset,
  onPrevWeek,
  onNextWeek,
  slotsByDay,
  selectedSlotId,
  onSelectSlot,
  children,
}) {
  const days = getWeekDays(weekOffset);

  return (
    <Card className="p-5 sm:p-6 border-med-border">
      <div className="flex items-center justify-between mb-3">
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

      {!hasDoctor ? (
        <p className="text-xs text-med-text-muted text-center py-6">
          Seleccioná un doctor para ver sus horarios.
        </p>
      ) : loading ? (
        <p className="text-xs text-med-text-muted text-center py-6">
          Cargando horarios...
        </p>
      ) : (
        <>
          <WeekNavigator
            label={formatWeekRange(days)}
            canGoPrev={weekOffset > 0}
            onPrev={onPrevWeek}
            onNext={onNextWeek}
          />
          <DayChips days={days} />
          <SlotGrid
            days={days}
            slotsByDay={slotsByDay}
            selectedSlotId={selectedSlotId}
            onSelect={onSelectSlot}
          />
        </>
      )}

      {children}
    </Card>
  );
}

export default AvailableSlotsCard;
