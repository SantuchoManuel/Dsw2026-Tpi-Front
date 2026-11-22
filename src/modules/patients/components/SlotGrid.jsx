import { isPastDay, toDateKey } from '../../shared/utils/dateUtils';
import { getSlotId, getSlotTime } from '../utils/slotUtils';

const byStartTime = (a, b) =>
  (a.startTime || '').localeCompare(b.startTime || '');
const hint =
  'text-[10px] text-med-text-muted text-center italic leading-snug px-1';

function SlotGrid({ days, slotsByDay, selectedSlotId, onSelect }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {days.map((day) => {
        const key = toDateKey(day);
        const daySlots = [...(slotsByDay[key] || [])].sort(byStartTime);

        return (
          <div key={key} className="flex flex-col items-stretch gap-1.5">
            {isPastDay(day) ? (
              <p className={hint}>Día pasado</p>
            ) : daySlots.length === 0 ? (
              <p className={hint}>No hay turnos disponibles para este día.</p>
            ) : (
              daySlots.map((slot) => {
                const slotId = getSlotId(slot);
                const selected = selectedSlotId === slotId;

                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => onSelect(slotId)}
                    className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all text-center cursor-pointer ${
                      selected
                        ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
                        : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                    }`}
                  >
                    {getSlotTime(slot)}
                  </button>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SlotGrid;
