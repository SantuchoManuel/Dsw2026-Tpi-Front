import { DAY_LABELS, toDateKey } from '../../shared/utils/dateUtils';

function DayChips({ days }) {
  return (
    <div className="grid grid-cols-5 gap-3 mb-2">
      {days.map((day) => (
        <div key={toDateKey(day)} className="text-center">
          <p className="text-[11px] font-semibold text-med-text-sub uppercase tracking-wide">
            {DAY_LABELS[day.getDay()]}
          </p>
          <p className="text-xl font-bold text-med-primary-900">
            {day.getDate()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DayChips;
