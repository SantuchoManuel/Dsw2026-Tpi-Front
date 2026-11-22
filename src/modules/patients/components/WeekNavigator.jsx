import { ChevronLeft, ChevronRight } from 'lucide-react';

const navBtn =
  'flex h-7 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 cursor-pointer';

function WeekNavigator({ label, canGoPrev, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        className={navBtn}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-base text-med-primary-900">{label}</span>
      <button type="button" onClick={onNext} className={navBtn}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default WeekNavigator;
