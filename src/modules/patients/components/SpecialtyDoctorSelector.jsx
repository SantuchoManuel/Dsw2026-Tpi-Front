import { Search } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function SpecialtyDoctorSelector({
  specialties,
  doctors,
  loadingSpecialties,
  loadingDoctors,
  selectedSpecialtyId,
  onSelectSpecialty,
  selectedDoctorId,
  onSelectDoctor,
}) {
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
        {/* Especialidad */}
        <div className="md:col-span-5 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Seleccionar Especialidad
          </label>
          <div className="relative">
            <select
              value={selectedSpecialtyId}
              onChange={(e) => onSelectSpecialty(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer"
              disabled={loadingSpecialties}
            >
              <option value="">
                {loadingSpecialties
                  ? 'Cargando...'
                  : 'Seleccione una especialidad'}
              </option>
              {specialties.map((sp) => (
                <option key={sp.specialityId} value={sp.specialityId}>
                  {sp.name}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
              ▼
            </span>
          </div>
        </div>

        {/* Doctor */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Seleccionar Doctor
          </label>
          <div className="relative">
            <select
              value={selectedDoctorId}
              onChange={(e) => onSelectDoctor(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer"
              disabled={!selectedSpecialtyId || loadingDoctors}
            >
              <option value="">
                {loadingDoctors
                  ? 'Cargando...'
                  : !selectedSpecialtyId
                    ? 'Primero seleccione una especialidad'
                    : doctors.length === 0
                      ? 'Sin doctores disponibles'
                      : 'Seleccione un doctor'}
              </option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
              ▼
            </span>
          </div>
        </div>

        {/* Botón Buscar Disponibilidad */}
        <div className="md:col-span-3">
          <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2.5 rounded-lg shadow-sm"
            onClick={() => {}}
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