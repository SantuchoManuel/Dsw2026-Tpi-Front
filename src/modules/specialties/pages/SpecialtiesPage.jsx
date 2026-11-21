import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  const fetchSpecialties = async (page = pageIndex, search = searchTerm) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const response = await getSpecialties({
        pageSize,
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
  };

  // esto se ejecuta al montar o cambiar de pagina
  useEffect(() => {
    fetchSpecialties(pageIndex, searchTerm);
  }, [pageIndex]);

  // manejo de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageIndex(1);
    fetchSpecialties(1, searchTerm);
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
              placeholder="Buscar y presionar enter..."
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
        <div className="p-5 border-b border-med-border flex items-center justify-between">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
          <span className="text-xs text-med-text-muted">
            Total: {totalItems}
          </span>
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
                    {/* Nombre con icono */}
                    <td className="px-6 py-4 font-semibold text-med-primary-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-med-primary-50 flex items-center justify-center text-med-primary-900 shrink-0">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.75"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                        <span>{spec.name}</span>
                      </div>
                    </td>

                    {/* Descripción */}
                    <td className="px-6 py-4 text-med-text-sub max-w-md">
                      {spec.description}
                    </td>
                    
                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-med-text-muted">
                        <button
                          title="Editar especialidad"
                          className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-text-muted hover:text-med-primary-900 transition"
                          onClick={() => handleOpenEditModal(spec)}
                        >
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        <button
                          title="Eliminar especialidad"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-med-text-muted hover:text-med-danger-text transition"
                          onClick={() => handleDelete(spec.id, spec.name)}
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
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

      {/* Modal para Crear / Editar Especialidad */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-med-border">
            <div className="p-6 border-b border-med-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-med-primary-900">
                {editingSpecialty
                  ? 'Editar Especialidad'
                  : 'Registrar Nueva Especialidad'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-med-text-muted hover:text-med-text-main text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSaveSpecialty)}
              className="p-6 flex flex-col gap-4"
            >
              {modalError && (
                <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {modalError}
                </div>
              )}

              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-med-text-main">
                  Nombre de la Especialidad
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cardiología"
                  className={`w-full border rounded-lg px-3.5 py-2 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
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

              {/* Descripción */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-med-text-main">
                  Descripción
                </label>
                <textarea
                  rows="3"
                  placeholder="Detalle o descripción de la especialidad..."
                  className={`w-full border rounded-lg px-3.5 py-2 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
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
                      value: 100,
                      message: 'No debe superar los 100 caracteres',
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-med-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-med-text-sub hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <Button type="submit">
                  {editingSpecialty ? 'Guardar Cambios' : 'Crear Especialidad'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecialtiesPage;
