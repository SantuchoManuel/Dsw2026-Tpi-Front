import { Search } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import SelectField from '../../shared/components/molecules/SelectField';

function SpecialtyDoctorSelector({
  specialties,
  doctors,
  loading,
  specialtyId,
  doctorId,
  onSpecialtyChange,
  onDoctorChange,
}) {
  const doctorPlaceholder = loading
    ? 'Cargando...'
    : !specialtyId
      ? 'Primero seleccione una especialidad'
      : doctors.length === 0
        ? 'Sin doctores disponibles'
        : 'Seleccione un doctor';

  return (
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
        <SelectField
          className="md:col-span-5"
          label="Seleccionar Especialidad"
          value={specialtyId}
          onChange={onSpecialtyChange}
          disabled={loading}
          placeholder={loading ? 'Cargando...' : 'Seleccione una especialidad'}
          options={specialties.map((sp) => ({
            value: sp.specialityId,
            label: sp.name,
          }))}
        />
        <SelectField
          className="md:col-span-4"
          label="Seleccionar Doctor"
          value={doctorId}
          onChange={onDoctorChange}
          disabled={!specialtyId || loading}
          placeholder={doctorPlaceholder}
          options={doctors.map((doc) => ({ value: doc.id, label: doc.name }))}
        />
        <div className="md:col-span-3">
          <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2.5 rounded-lg shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Buscar Disponibilidad</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default SpecialtyDoctorSelector;
