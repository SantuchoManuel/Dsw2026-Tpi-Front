import { useEffect, useState } from 'react';
import { Stethoscope, Save, IdCard, Info, Timer } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createAvailability,
} from '../services/doctorsService';
import useDoctors from '../hook/useDoctors';
import { getSpecialties } from '../../specialties/services/specialtiesService';

function DoctorsPage() {
  //estos serian los estados para datos y carga
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  //la lista de doctores ahora viene del hook
  const {
    doctors,
    loading,
    pageIndex,
    setPageIndex,
    totalPages,
    totalCount,
    pageSize,
    buscar,
    recargar,
  } = useDoctors();



  //estados del modal crear y editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formError, setFormError] = useState('');

  //estados para el modal de la disponibilidad horaria
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilitySuccess, setAvailabilitySuccess] = useState('');

  //estados para la nueva vista de disponibilidad que se pide en el pdf
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Lunes', active: true, startTime: '08:00', endTime: '16:00' },
    { day: 'Martes', active: true, startTime: '08:00', endTime: '16:00' },
    { day: 'Miércoles', active: true, startTime: '08:00', endTime: '12:00' },
    { day: 'Jueves', active: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Viernes', active: true, startTime: '08:00', endTime: '14:00' },
    { day: 'Sábado', active: false, startTime: '', endTime: '' },
  ]);

  //esto es para obtener el objeto del doctor seleccionado para mostrar su tarjeta informativa
  const selectedDoctorObj = doctors.find(
    (d) => String(d.id) === String(selectedDoctorId)
  );

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
      recargar();
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
      recargar();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error al eliminar el doctor.');
    }
  };

  //busqueda al presionar enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    buscar(searchTerm);
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

  //para cambiar estado activo/inactivo de un día
  const handleToggleDay = (index) => {
    setWeeklySchedule((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            active: !item.active,
            startTime: !item.active ? '08:00' : '',
            endTime: !item.active ? '16:00' : '',
          }
          : item
      )
    );
  };

  //para modificar hora de entrada o salida
  const handleTimeChange = (index, field, value) => {
    setWeeklySchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  //para guardar la disponibilidad
  const handleSaveAvailability = async () => {
    if (!selectedDoctorId) {
      setAvailabilityError('Por favor seleccione un profesional.');

      return;
    }

    const activeDays = weeklySchedule
      .filter((d) => d.active)
      .map((d) => ({
        day: d.day,
        startTime: d.startTime,
        endTime: d.endTime,
      }));

    if (activeDays.length === 0) {
      setAvailabilityError('Debe activar al menos un día con horario.');

      return;
    }

    try {
      setAvailabilityError('');
      setAvailabilitySuccess('');
      await createAvailability({
        doctorId: selectedDoctorId,
        days: activeDays,
      });
      setAvailabilitySuccess('¡Disponibilidad guardada con exito!');
      setTimeout(() => {
        setIsAvailabilityModalOpen(false);
        setAvailabilitySuccess('');
      }, 1500);
    } catch (err) {
      const backendDetail = err?.response?.data?.details?.[0]?.issue;

      setAvailabilityError(
        backendDetail ||
        err?.response?.data?.message ||
        'Error al guardar la disponibilidad horaria.'
      );
    }
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

  /* Modal para Crear y Editar Doctor */
  if (isModalOpen) {
    return (
      <div className="flex flex-col gap-6">
        {/* Breadcrumb de navegación */}
        <div className="flex items-center gap-2 text-sm text-med-text-muted">
          <button
            onClick={() => setIsModalOpen(false)}
            className="hover:text-med-primary-900 transition"
          >
            Doctors
          </button>
          <span>›</span>
          <span className="font-semibold text-med-primary-900">
            {editingDoctor ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
          </span>
        </div>
        {/* Tarjeta Principal de Registro */}
        <Card className="p-6 sm:p-8 bg-white border border-med-border rounded-xl shadow-xs">
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
                {editingDoctor ? 'Modificar Doctor' : 'Registrar Nuevo Doctor'}
              </h2>
              <p className="text-xs sm:text-sm text-med-text-sub mt-0.5">
                Complete todos los campos obligatorios para integrar al nuevo
                facultativo al sistema del centro médico.
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="mt-6 flex flex-col gap-6"
          >
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {formError}
              </div>
            )}
            {/* Nombre Completo del Doctor */}
            <div>
              <label className="block text-xs font-bold text-med-text-main mb-2">
                Nombre Completo del Doctor
              </label>
              <div className="relative">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Ej: Dr. Alejandro Martínez"
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
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
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
              <div>
                <label className="block text-xs font-bold text-med-text-main mb-2">
                  Número de Licencia Médica
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
                    <IdCard className="w-4 h-4 text-med-text-muted" />
                  </span>
                  <input
                    type="text"
                    placeholder="ID-45920-X"
                    {...register('licenseNumber', {
                      required: 'El número de licencia es obligatorio',
                    })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>
            </div>
            {/* Botones Cancelar y Guardar Doctor */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-med-border">
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
                <span>
                  <Save className="w-3.5 h-3.5" />
                </span>
                <span>Guardar Doctor</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  /* Modal para Disponibilidad Horaria */
  if (isAvailabilityModalOpen) {
    return (
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-med-text-muted">
          <button
            type="button"
            onClick={() => setIsAvailabilityModalOpen(false)}
            className="hover:text-med-primary-900 transition cursor-pointer"
          >
            Doctores
          </button>
          <span>›</span>
          <span className="font-semibold text-med-primary-900">
            Disponibilidad Horaria
          </span>
        </div>
        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main">
            Gestionar Disponibilidad Horaria
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Defina los días y rangos horarios de atención para el profesional
            seleccionado.
          </p>
        </div>
        {/* Mensajes de Alerta */}
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
        {/* Contenido en dos columnas*/}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Seleccion de Profesional y Previsualización */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="p-6 bg-white border border-med-border rounded-xl shadow-xs flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-med-text-main mb-2">
                  Seleccionar Profesional
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                >
                  <option value="">Seleccione un doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.speciality?.name || 'S/E'}
                    </option>
                  ))}
                </select>
              </div>
              {/* Tarjeta de previsualización del doctor */}
              {selectedDoctorObj && (
                <div className="p-4 bg-med-primary-50/70 border border-med-primary-100 rounded-xl flex items-center gap-4">
                  <img
                    src="/doctor-avatar.jpg"
                    alt={selectedDoctorObj.name}
                    className="w-12 h-12 rounded-xl object-cover border border-med-primary-200 shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-med-primary-900 text-sm">
                      {selectedDoctorObj.name}
                    </h4>
                    <p className="text-[11px] text-med-text-muted mt-0.5">
                      ID: {selectedDoctorObj.licenseNumber || 'S/D'}
                    </p>
                    <p className="text-[11px] font-semibold text-med-primary-700">
                      {selectedDoctorObj.speciality?.name || 'General'}
                    </p>
                  </div>
                </div>
              )}
            </Card>
            {/* Aviso informativo inferior */}
            <div className="p-4 bg-white border border-med-border rounded-xl shadow-xs flex items-start gap-3">
              <span className="text-med-primary-700 text-base mt-0.5">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              </span>
              <p className="text-xs text-med-text-sub leading-relaxed">
                Los cambios realizados se aplicarán a partir de la próxima
                semana calendario. Las citas ya programadas no se verán
                afectadas automáticamente.
              </p>
            </div>
          </div>
          {/* Columna Derecha: Configuración de Horarios por Día */}
          <div className="lg:col-span-8">
            <Card className="p-0 overflow-hidden bg-white border border-med-border rounded-xl shadow-xs">
              <div className="p-5 border-b border-med-border flex items-center justify-between">
                <h3 className="font-bold text-med-primary-900 text-sm">
                  Configuración de Horarios
                </h3>
                <span className="text-[11px] text-med-text-muted flex items-center gap-1">
                  <Timer className="w-4 h-4 text-med-text-muted" /> Intervalos
                  automáticos de 30 minutos
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
                    <tr>
                      <th className="px-6 py-3.5">Día</th>
                      <th className="px-6 py-3.5 text-center">Estado</th>
                      <th className="px-6 py-3.5">Entrada</th>
                      <th className="px-6 py-3.5">Salida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-med-border-subtle">
                    {weeklySchedule.map((item, index) => (
                      <tr
                        key={item.day}
                        className={
                          item.active
                            ? 'hover:bg-gray-50/70'
                            : 'bg-gray-50/40 text-med-text-muted'
                        }
                      >
                        {/* Nombre del Día */}
                        <td className="px-6 py-4 font-semibold text-med-primary-900">
                          {item.day}
                        </td>
                        {/* Switch Activo / Inactivo */}
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleDay(index)}
                            className="inline-flex items-center gap-2 cursor-pointer"
                          >
                            <span
                              className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${item.active
                                ? 'bg-med-primary-900'
                                : 'bg-gray-300'
                                }`}
                            >
                              <span
                                className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${item.active
                                  ? 'translate-x-4'
                                  : 'translate-x-0'
                                  }`}
                              />
                            </span>
                            <span className="text-xs font-medium">
                              {item.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </button>
                        </td>
                        {/* Hora Entrada */}
                        <td className="px-6 py-4">
                          {item.active ? (
                            <input
                              type="time"
                              value={item.startTime}
                              onChange={(e) =>
                                handleTimeChange(
                                  index,
                                  'startTime',
                                  e.target.value
                                )
                              }
                              className="px-2.5 py-1.5 border border-med-border rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                            />
                          ) : (
                            <span className="text-med-text-muted font-mono">
                              --:--
                            </span>
                          )}
                        </td>
                        {/* Hora Salida */}
                        <td className="px-6 py-4">
                          {item.active ? (
                            <input
                              type="time"
                              value={item.endTime}
                              onChange={(e) =>
                                handleTimeChange(
                                  index,
                                  'endTime',
                                  e.target.value
                                )
                              }
                              className="px-2.5 py-1.5 border border-med-border rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                            />
                          ) : (
                            <span className="text-med-text-muted font-mono">
                              --:--
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Botones Cancelar y Guardar */}
              <div className="p-5 border-t border-med-border flex items-center justify-end gap-3 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAvailabilityModalOpen(false)}
                  className="px-5 py-2 text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveAvailability}
                  className="px-5 py-2 text-xs bg-med-primary-900 hover:bg-med-primary-800 text-white flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Disponibilidad</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
            currentPage={pageIndex}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={(newPage) => setPageIndex(newPage)}
          />
        </div>
      </Card>
    </div>
  );
}

export default DoctorsPage;
