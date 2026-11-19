import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createAvailability,
} from '../services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';

function DoctorsPage() {
  //estos serian los estados para datos y carga
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  //estados de paginacion
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  //estados del modal crear y editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formError, setFormError] = useState('');

  //estados para el modal de la disponibilidad horaria
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilitySuccess, setAvailabilitySuccess] = useState('');

  const {
    register: registerAvail,
    handleSubmit: handleSubmitAvail,
    reset: resetAvail,
    formState: { errors: errorsAvail },
  } = useForm({
    defaultValues: {
      doctorId: '',
      day: 'Lunes',
      startTime: '08:00',
      endTime: '12:00',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', licenseNumber: '', specialityId: '' },
  });

  //para cargar especialidades para el selector del formulario
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await getSpecialties({ pageSize: 100, pageIndex: 1 });

        setSpecialties(data.data || []);
      } catch (err) {
        console.error('Error al cargar especialidades:', err);
      }
    };

    fetchSpecialties();
  }, []);

  //funcion pa que traigamos a los doctores paginados
  const fetchDoctors = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const data = await getDoctors({
        pageSize,
        pageIndex: page,
        name: search,
      });

      setDoctors(data.data || []);
      setTotalCount(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize) || 1);
      setPageIndex(data.pageIndex + 1);
    } catch (err) {
      console.error('Error al cargar doctores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(pageIndex, searchTerm);
  }, [pageIndex]);

  //modal para crear
  const handleOpenCreateModal = () => {
    setEditingDoctor(null);
    setFormError('');
    reset({ name: '', licenseNumber: '', specialityId: '' });
    setIsModalOpen(true);
  };

  //modal para editar
  const handleOpenEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setFormError('');
    reset({
      name: doctor.name,
      licenseNumber: doctor.licenseNumber,
      specialityId: doctor.speciality?.specialityId || '',
    });
    setIsModalOpen(true);
  };

  //para guardar crear o modificar
  const onSubmitForm = async (formData) => {
    try {
      setFormError('');

      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, formData);
      } else {
        await createDoctor(formData);
      }

      setIsModalOpen(false);
      reset();
      fetchDoctors(pageIndex, searchTerm);
    } catch (err) {
      setFormError(
        err?.response?.data?.message || 'Error al guardar los datos del medico.'
      );
    }
  };

  //para eliminar
  const handleDelete = async (doctor) => {
    const confirmDelete = window.confirm(
      `¿Esta seguro de dar de baja al Dr/a. "${doctor.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteDoctor(doctor.id);
      fetchDoctors(pageIndex, searchTerm);
    } catch (err) {
      alert(err?.response?.data?.message || 'Error al eliminar el doctor.');
    }
  };

  //busqueda al presionar enter o cambiar una palabra
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageIndex(1);
    fetchDoctors(1, searchTerm);
  };

  //abrir el modal de disponibilidad
  const handleOpenAvailabilityModal = () => {
    setAvailabilityError('');
    setAvailabilitySuccess('');
    resetAvail({
      doctorId: '',
      day: 'Lunes',
      startTime: '08:00',
      endTime: '12:00',
    });
    setIsAvailabilityModalOpen(true);
  };

  //para enviar la disponibilidad a la API
  const onSubmitAvailability = async (formData) => {
    try {
      setAvailabilityError('');
      setAvailabilitySuccess('');
      const payload = {
        doctorId: formData.doctorId,
        days: [
          {
            day: formData.day,
            startTime: formData.startTime,
            endTime: formData.endTime,
          },
        ],
      };
      await createAvailability(payload);
      setAvailabilitySuccess('¡Disponibilidad asignada con correctamente!');
      setTimeout(() => {
        setIsAvailabilityModalOpen(false);
        setAvailabilitySuccess('');
      }, 1500);
    } catch (err) {
        const backendDetail = err?.response?.data?.details?.[0]?.issue;
        setAvailabilityError(
          backendDetail ||
            err?.response?.data?.message ||
            'Error al guardar la disponibilidad horaria'
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título y Acciones de Cabecera */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Barra de Búsqueda */}
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
              placeholder="Buscar doctor por nombre... (Enter)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </form>

          <Button
            onClick={handleOpenAvailabilityModal}
            className="flex items-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Agregar Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 bg-med-primary-700 hover:bg-med-primary-800 text-white"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
          </Button>
        </div>
      </div>

      {/* Tabla Principal */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Matrícula</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-med-text-muted text-xs"
                  >
                    Cargando doctores...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-med-text-muted text-xs"
                  >
                    No se encontraron doctores registrados.
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Doctor Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-med-primary-100 flex items-center justify-center text-xl">
                          👨‍⚕️
                        </div>
                        <div>
                          <p className="font-semibold text-med-primary-900 leading-tight">
                            {doc.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Matrícula */}
                    <td className="px-6 py-4 text-xs text-med-text-main font-mono">
                      {doc.licenseNumber || 'S/D'}
                    </td>

                    {/* Especialidad Badge en Píldora */}
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                        {doc.speciality?.name || 'Sin especialidad'}
                      </span>
                    </td>

                    {/* Botones de Acciones (Ojo, Lápiz, Basurero) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-med-primary-600">
                        <button
                          title="Ver detalle"
                          className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                          onClick={() =>
                            alert(
                              `Doctor: ${doc.name}\nMatrícula: ${doc.licenseNumber || 'S/D'}\nEspecialidad: ${doc.speciality?.name || 'Sin especialidad'}`
                            )
                          }
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        <button
                          title="Editar profesional"
                          className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                          onClick={() => handleOpenEditModal(doc)}
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
                          title="Eliminar profesional"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                          onClick={() => handleDelete(doc)}
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

        {/* Paginador normalizado idéntico a Búsqueda y Filtrado de Citas */}
        <div className="p-4 bg-med-primary-50/50 border-t border-med-border">
          <TablePagination
            page={pageIndex}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={(newPage) => setPageIndex(newPage)}
          />
        </div>
      </Card>

      {/* Modal para Crear y Editar Doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-med-border">
            <div className="p-5 border-b border-med-border flex justify-between items-center">
              <h3 className="font-bold text-med-primary-900 text-lg">
                {editingDoctor ? 'Editar Doctor' : 'Nuevo Doctor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-med-text-muted hover:text-med-text-main text-xl font-semibold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className="p-5 flex flex-col gap-4"
            >
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                  {formError}
                </div>
              )}

              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-med-text-main mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Dr. Juan Pérez"
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
                  className="w-full px-3 py-2 text-xs border border-med-border rounded-lg focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                />
                {errors.name && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Matrícula */}
              <div>
                <label className="block text-xs font-semibold text-med-text-main mb-1">
                  Matrícula Profesional
                </label>
                <input
                  type="text"
                  placeholder="Ej: MP-12345"
                  {...register('licenseNumber', {
                    required: 'La matrícula es obligatoria',
                  })}
                  className="w-full px-3 py-2 text-xs border border-med-border rounded-lg focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                />
                {errors.licenseNumber && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-xs font-semibold text-med-text-main mb-1">
                  Especialidad
                </label>
                <select
                  {...register('specialityId', {
                    required: 'Debe seleccionar una especialidad',
                  })}
                  className="w-full px-3 py-2 text-xs border border-med-border rounded-lg focus:outline-none focus:ring-1 focus:ring-med-primary-600 bg-white"
                >
                  <option value="">Seleccione una especialidad...</option>
                  {specialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {errors.specialityId && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {errors.specialityId.message}
                  </p>
                )}
              </div>

              {/* Botones del Modal */}
              <div className="flex justify-end gap-2 pt-3 border-t border-med-border mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-med-primary-900 hover:bg-med-primary-800 text-white"
                >
                  {editingDoctor ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal para Disponibilidad Horaria */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-med-border">
            <div className="p-5 border-b border-med-border flex justify-between items-center">
              <h3 className="font-bold text-med-primary-900 text-lg">
                Asignar Disponibilidad Horaria
              </h3>
              <button
                onClick={() => setIsAvailabilityModalOpen(false)}
                className="text-med-text-muted hover:text-med-text-main text-xl font-semibold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitAvail(onSubmitAvailability)}
              className="p-5 flex flex-col gap-4"
            >
              {availabilityError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                  {availabilityError}
                </div>
              )}

              {availabilitySuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
                  {availabilitySuccess}
                </div>
              )}

              {/* Selector de Doctor */}
              <div>
                <label className="block text-xs font-semibold text-med-text-main mb-1">
                  Doctor / Profesional
                </label>
                <select
                  {...registerAvail('doctorId', {
                    required: 'Debe seleccionar un médico',
                  })}
                  className="w-full px-3 py-2 text-xs border border-med-border rounded-lg focus:outline-none focus:ring-1 focus:ring-med-primary-600 bg-white"
                >
                  <option value="">Seleccione un doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.speciality?.name || 'S/E'}
                    </option>
                  ))}
                </select>
                {errorsAvail.doctorId && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {errorsAvail.doctorId.message}
                  </p>
                )}
              </div>

              {/* Selector de Día */}
              <div>
                <label className="block text-xs font-semibold text-med-text-main mb-1">
                  Día de la semana
                </label>
                <select
                  {...registerAvail('day', {
                    required: 'El día es obligatorio',
                  })}
                  className="w-full px-3 py-2 text-xs border border-med-border rounded-lg focus:outline-none focus:ring-1 focus:ring-med-primary-600 bg-white"
                >
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miercoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sabado">Sábado</option>
                </select>
              </div>

              {/* Rango de Horarios */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-med-text-main mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    {...registerAvail('startTime', {
                      required: 'Requerido',
                    })}
                    className="w-full px-3 py-2 text-xs border border-med-border rounded-lg focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                  />
                  {errorsAvail.startTime && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errorsAvail.startTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-med-text-main mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    {...registerAvail('endTime', {
                      required: 'Requerido',
                    })}
                    className="w-full px-3 py-2 text-xs border border-med-border rounded-lg focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                  />
                  {errorsAvail.endTime && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errorsAvail.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-2 pt-3 border-t border-med-border mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAvailabilityModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-med-primary-900 hover:bg-med-primary-800 text-white"
                >
                  Guardar Horario
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsPage;
