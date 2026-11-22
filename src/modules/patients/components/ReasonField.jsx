function ReasonField({ value, onChange }) {
  return (
    <div className="mt-5 flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-med-text-sub">
        Motivo de la consulta <span className="text-red-500">*</span>
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: Control de presión arterial, dolor de cabeza frecuente..."
        className="w-full border border-med-border rounded-lg px-3.5 py-2 text-sm text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-2 focus:ring-med-primary-600 resize-none"
      />
    </div>
  );
}

export default ReasonField;
