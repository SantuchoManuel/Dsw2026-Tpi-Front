function StatusBadge({ status }) {
  const s = status?.toLowerCase() || '';

  if (s === 'confirmed' || s === 'confirmada' || s === 'confirmado') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        CONFIRMADO
      </span>
    );
  }

  if (s === 'completed' || s === 'completada' || s === 'completado') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        COMPLETADO
      </span>
    );
  }

  if (s === 'cancelled' || s === 'canceled' || s === 'cancelada' || s === 'cancelado') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        CANCELADO
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      {status?.toUpperCase() || 'S/D'}
    </span>
  );
}

export default StatusBadge;