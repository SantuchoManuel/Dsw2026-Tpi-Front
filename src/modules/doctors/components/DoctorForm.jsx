import { User, Stethoscope, IdCard, Save } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

function DoctorForm({
  isEditing,
  specialties,
  register,
  errors,
  formError,
  isSubmitting,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-med-text-muted">
        <button
          onClick={onCancel}
          className="hover:text-med-primary-900 transition"
        >
          Doctors
        </button>
        <span>›</span>
        <span className="font-semibold text-med-primary-900">
          {isEditing ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
        </span>
      </div>
      {/* Tarjeta Principal de Registro */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-start gap-3 pb-6 border-b border-med-border">
          <div className="p-2.5 rounded-lg bg-med-primary-50 text-med-primary-900">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-med-primary-900">
              {isEditing ? 'Modificar Doctor' : 'Registrar Nuevo Doctor'}
            </h2>
            <p className="text-xs sm:text-sm text-med-text-sub mt-0.5">
              Complete todos los campos obligatorios para integrar al nuevo
              facultativo al sistema del centro médico.
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {formError}
            </div>
          )}

          <Input
            label="Nombre Completo del Doctor"
            placeholder="Ej: Dr. Alejandro Martínez"
            icon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'No puede exceder 100 caracteres',
              },
            })}
          />
          {/* Dos Columnas: Especialidad y Número de Licencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Especialidad */}
            <div>
              <label className="block text-xs font-bold text-med-text-main mb-2">
                Especialidad
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted pointer-events-none">
                  <Stethoscope className="w-4 h-4 text-med-text-muted" />
                </span>
                <select
                  {...register('specialityId', {
                    required: 'Debe seleccionar una especialidad',
                  })}
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600 appearance-none"
                >
                  <option value="">Seleccione especialidad</option>
                  {specialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted text-xs">
                  ▼
                </span>
              </div>
              {errors.specialityId && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.specialityId.message}
                </p>
              )}
            </div>
            {/* Número de Licencia Médica */}
            <Input
              label="Número de Licencia Médica"
              placeholder="ID-45920-X"
              icon={<IdCard className="w-4 h-4" />}
              error={errors.licenseNumber?.message}
              {...register('licenseNumber', {
                required: 'El número de licencia es obligatorio',
              })}
            />
          </div>
          {/* Botones Cancelar y Guardar Doctor */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-med-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-5 py-2 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs bg-med-primary-900 hover:bg-med-primary-800 text-white flex items-center gap-2"
            >
              <span>
                <Save className="w-3.5 h-3.5" />
              </span>
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Doctor'}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default DoctorForm;
