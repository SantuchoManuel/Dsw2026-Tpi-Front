import { CalendarDays, CheckCircle2 } from 'lucide-react';
import Button from '../../shared/components/Button';
import { formatSlotSummary } from '../utils/slotUtils';

function BookingSummary({
  doctor,
  slot,
  canConfirm,
  submitting,
  errorMessage,
  onConfirm,
}) {
  return (
    <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="border-l-4 border-med-primary-900 pl-3.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
          Resumen de Selección
        </span>
        {slot && doctor ? (
          <>
            <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <span>{formatSlotSummary(slot)}</span>
            </p>
            <p className="text-xs text-med-text-sub mt-0.5">
              {doctor.name} • {doctor.speciality?.name}
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
          onClick={onConfirm}
          disabled={!canConfirm || submitting}
          className="flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{submitting ? 'Confirmando...' : 'Confirmar Turno'}</span>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </Button>
      </div>
    </div>
  );
}

export default BookingSummary;
