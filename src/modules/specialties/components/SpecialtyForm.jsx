import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

function SpecialtyForm({ specialty = null, error = '', onSubmit, onCancel }) {
  const isEditing = Boolean(specialty);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: specialty?.name ?? '',
      description: specialty?.description ?? '',
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-med-text-muted">
        <button
          type="button"
          onClick={onCancel}
          className="hover:text-med-primary-900 transition cursor-pointer"
        >
          Especialidades
        </button>
        <span>›</span>
        <span className="font-semibold text-med-primary-900">
          {isEditing ? 'Modificar Especialidad' : 'Agregar Nueva Especialidad'}
        </span>
      </div>

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-med-text-main">
          {isEditing ? 'Modificar Especialidad' : 'Registrar Nueva Especialidad'}
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Complete la información técnica y administrativa para dar de alta una
          especialidad médica en el sistema hospitalario.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {error}
            </div>
          )}

          <Input
            label="Nombre de la Especialidad"
            placeholder="Ej. Cardiología Intervencionista"
            error={errors.name?.message}
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'No debe superar los 100 caracteres',
              },
            })}
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-med-text-main">
              Descripción
            </label>
            <textarea
              rows="4"
              placeholder="Detalle el alcance de la especialidad, procedimientos principales y requisitos de derivación..."
              className={`w-full border rounded-lg px-3.5 py-2.5 text-xs bg-white text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600 ${
                errors.description
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-med-border'
              }`}
              {...register('description', {
                required: 'La descripción es obligatoria',
                minLength: {
                  value: 10,
                  message: 'Debe tener al menos 10 caracteres',
                },
                maxLength: {
                  value: 250,
                  message: 'No debe superar los 250 caracteres',
                },
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-med-border">
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
              className="px-5 py-2 text-xs flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {isEditing ? 'Guardar Cambios' : 'Guardar Especialidad'}
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SpecialtyForm;