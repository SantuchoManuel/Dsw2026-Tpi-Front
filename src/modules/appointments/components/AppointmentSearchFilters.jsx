import { Search, RefreshCw, Filter } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

function AppointmentSearchFilters({
  dniQuery,
  onDniChange,
  specialtyId,
  onSpecialtyChange,
  doctorId,
  onDoctorChange,
  dateFilter,
  onDateChange,
  specialties,
  doctors,
  loading,
  errorMsg,
  activeChips,
  onApplyFilters,
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
        <h2 className="text-base font-bold text-med-primary-900">
          Criterios de Búsqueda
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-med-text-muted">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Última actualización: hace un momento</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Nombre o DNI del Paciente
          </label>
          <Input
            type="number"
            value={dniQuery}
            onChange={(e) => onDniChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
            placeholder="Ej: 12345678"
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Especialidad
          </label>
          <select
            value={specialtyId}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
          >
            <option value="">Todas las Especialidades</option>
            {specialties.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Doctor
          </label>
          <select
            value={doctorId}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
          >
            <option value="">Todos los Doctores</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Fecha
          </label>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <Button
          type="button"
          onClick={onApplyFilters}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm disabled:opacity-60"
        >
          <Filter className="w-4 h-4" />
          <span>{loading ? 'Buscando...' : 'Aplicar Filtros'}</span>
        </Button>
      </div>

      {errorMsg && (
        <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMsg}
        </p>
      )}

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
          {activeChips.map((chip, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/80 text-sky-800"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

export default AppointmentSearchFilters;
