import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  Heart,
  Lightbulb,
  FlaskConical,
  Smile,
  Stethoscope,
  Pencil,
  Trash2,
  Save,
} from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import {
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} from '../services/specialtiesService';

function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // estado para el modal de crear y editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [modalError, setModalError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // cargar las especialidades desde la API
  const fetchSpecialties = useCallback(async (page, search) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const response = await getSpecialties({
        pageSize: 5,
        pageIndex: page,
        name: search,
      });

      setSpecialties(response.data || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || 'Error al cargar las especialidades'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // esto se ejecuta al montar o cambiar de pagina
  useEffect(() => {
    fetchSpecialties(pageIndex, appliedSearch);
  }, [pageIndex, appliedSearch, fetchSpecialties]);

  // manejo de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageIndex(1);
    setAppliedSearch(searchTerm);
  };

  //modal para Crear
  const handleOpenCreateModal = () => {
    setEditingSpecialty(null);
    setModalError('');
    reset({ name: '', description: '' });
    setIsModalOpen(true);
  };

  //modal para Editar
  const handleOpenEditModal = (spec) => {
    setEditingSpecialty(spec);
    setModalError('');
    reset({
      name: spec.name,
      description: spec.description,
    });
    setIsModalOpen(true);
  };

  //para guardar (crear o editar)
  const onSaveSpecialty = async (formData) => {
    try {
      setModalError('');

      if (editingSpecialty) {
        await updateSpecialty(editingSpecialty.id, formData);
      } else {
        await createSpecialty(formData);
      }

      setIsModalOpen(false);
      fetchSpecialties(pageIndex, searchTerm);
    } catch (error) {
      setModalError(
        error?.response?.data?.message || 'Error al guardar la especialidad'
      );
    }
  };

  //para eliminar
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `¿Está seguro que desea eliminar la especialidad "${name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteSpecialty(id);
      fetchSpecialties(pageIndex, searchTerm);
    } catch (error) {
      alert(
        error?.response?.data?.message || 'Error al eliminar la especialidad'
      );
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  //este es para asignarle a un icono a cada especialidad distinta
  const getSpecialtyIcon = (name = '') => {
    const lower = name.toLowerCase();

    if (lower.includes('cardio') || lower.includes('coraz')) {
      return <Heart className="w-4 h-4" />;
    }

    if (lower.includes('neuro') || lower.includes('cerebr')) {
      return <Lightbulb className="w-4 h-4" />;
    }

    if (lower.includes('derma') || lower.includes('piel')) {
      return <FlaskConical className="w-4 h-4" />;
    }

    if (lower.includes('pedia') || lower.includes('niñ')) {
      return <Smile className="w-4 h-4" />;
    }

    return <Stethoscope className="w-4 h-4" />;
  };

  /* Modal para Crear / Editar Especialidad */
  if (isModalOpen) {
    return (
      <div className="flex flex-col gap-6">
        {/* Breadcrumb de navegación */}
        <div className="flex items-center gap-2 text-sm text-med-text-muted">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="hover:text-med-primary-900 transition cursor-pointer"
          >
            Especialidades
          </button>
          <span>›</span>
          <span className="font-semibold text-med-primary-900">
            {editingSpecialty
              ? 'Modificar Especialidad'
              : 'Agregar Nueva Especialidad'}
          </span>
        </div>

        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main">
            {editingSpecialty
              ? 'Modificar Especialidad'
              : 'Registrar Nueva Especialidad'}
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Complete la información técnica y administrativa para dar de alta
            una especialidad médica en el sistema hospitalario.
          </p>
        </div>

        {/* Tarjeta del Formulario */}
        <Card className="p-6 sm:p-8 bg-white border border-med-border rounded-xl shadow-xs">
          <form
            onSubmit={handleSubmit(onSaveSpecialty)}
            className="flex flex-col gap-6"
          >
            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {modalError}
              </div>
            )}

            {/* Nombre de la Especialidad */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-med-text-main">
                Nombre de la Especialidad
              </label>
              <input
                type="text"
                placeholder="Ej. Cardiología Intervencionista"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-xs bg-white text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600 ${
                  errors.name
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-med-border'
                }`}
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
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Descripcion */}
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

            {/* Estado Inicial */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-med-text-main">
                Estado inicial
              </label>
              <div className="relative">
                <select
                  disabled
                  defaultValue="activo"
                  className="w-full border border-med-border rounded-lg px-3.5 py-2.5 text-xs bg-gray-50 text-med-text-main appearance-none cursor-not-allowed"
                >
                  <option value="activo">
                    Activo - Disponible para programación
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-med-text-muted">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Botones de Accion */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-med-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-5 py-2 text-xs bg-med-primary-900 hover:bg-med-primary-800 text-white flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>
                  {editingSpecialty
                    ? 'Guardar Cambios'
                    : 'Guardar Especialidad'}
                </span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera con Título, Buscador y Botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative min-w-[240px] flex-1 sm:flex-initial"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </form>

          {/* Botón Nueva Especialidad */}
          <Button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium"
          >
            <span>+</span>
            <span>Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Tabla Principal de Especialidades */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-med-primary-50/50 text-med-text-muted border-b border-med-border font-medium">
                <th className="px-6 py-3.5">Nombre de la Especialidad</th>
                <th className="px-6 py-3.5">Descripción</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-med-text-muted"
                  >
                    Cargando especialidades...
                  </td>
                </tr>
              ) : specialties.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-med-text-muted"
                  >
                    No se encontraron especialidades cargadas.
                  </td>
                </tr>
              ) : (
                specialties.map((spec) => (
                  <tr
                    key={spec.id}
                    className="hover:bg-med-hover-row transition duration-150"
                  >
                    {/* Nombre con icono según especialidad */}
                    <td className="px-6 py-4 font-semibold text-med-primary-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-med-primary-50 flex items-center justify-center text-med-primary-900 shrink-0">
                          {getSpecialtyIcon(spec.name)}
                        </div>
                        <span>{spec.name}</span>
                      </div>
                    </td>

                    {/* Descripción */}
                    <td className="px-6 py-4 text-med-text-sub max-w-md">
                      {spec.description}
                    </td>

                    {/* Acciones con Pencil y Trash2 de Lucide */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-med-text-muted">
                        <button
                          type="button"
                          title="Editar especialidad"
                          className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-text-muted hover:text-med-primary-900 transition cursor-pointer"
                          onClick={() => handleOpenEditModal(spec)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          title="Eliminar especialidad"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-med-text-muted hover:text-red-500 transition cursor-pointer"
                          onClick={() => handleDelete(spec.id, spec.name)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador reutilizable */}
        <TablePagination
          currentPage={pageIndex}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(newPage) => setPageIndex(newPage)}
        />
      </Card>
    </div>
  );
}

export default SpecialtiesPage;
