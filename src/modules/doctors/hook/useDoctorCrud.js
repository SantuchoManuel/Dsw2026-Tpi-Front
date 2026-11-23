import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createDoctor, updateDoctor, deleteDoctor } from '../services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';

const EMPTY_FORM = { name: '', licenseNumber: '', specialityId: '' };

// onSaved: función que se ejecuta después de guardar o borrar (recargar la tabla)
const useDoctorCrud = (onSaved) => {
  const [specialties, setSpecialties] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_FORM });

  // especialidades para el select del formulario
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

  const openCreate = () => {
    setEditingDoctor(null);
    setFormError('');
    reset(EMPTY_FORM);
    setIsOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormError('');
    reset({
      name: doctor.name,
      licenseNumber: doctor.licenseNumber,
      specialityId: doctor.speciality?.specialityId || '',
    });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  // handleSubmit valida y, si está todo bien, ejecuta la función
  const onSubmit = handleSubmit(async (formData) => {
    try {
      setFormError('');

      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, formData);
      } else {
        await createDoctor(formData);
      }

      setIsOpen(false);
      reset(EMPTY_FORM);
      onSaved();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Error al guardar los datos del medico.');
    }
  });

  const remove = async (doctor) => {
    const confirmDelete = window.confirm(`¿Esta seguro de dar de baja al Dr/a. "${doctor.name}"?`);

    if (!confirmDelete) return;

    try {
      await deleteDoctor(doctor.id);
      onSaved();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error al eliminar el doctor.');
    }
  };

  return {
    specialties,
    isOpen,
    isEditing: Boolean(editingDoctor),
    formError,
    register,
    errors,
    isSubmitting,
    onSubmit,
    openCreate,
    openEdit,
    close,
    remove,
  };
};

export default useDoctorCrud;