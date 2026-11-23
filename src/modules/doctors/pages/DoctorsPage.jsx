import { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import TablePagination from '../../shared/components/TablePagination';
import useDoctors from '../hook/useDoctors';
import useDoctorCrud from '../hook/useDoctorCrud';
import useAvailability from '../hook/useAvailability';
import DoctorForm from '../components/DoctorForm';
import AvailabilityForm from '../components/AvailabilityForm';
import DoctorsTable from '../components/DoctorsTable';

function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
  const crud = useDoctorCrud(recargar);
  const availability = useAvailability();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    buscar(searchTerm);
  };

  if (crud.isOpen) {
    return (
      <DoctorForm
        isEditing={crud.isEditing}
        specialties={crud.specialties}
        register={crud.register}
        errors={crud.errors}
        formError={crud.formError}
        isSubmitting={crud.isSubmitting}
        onSubmit={crud.onSubmit}
        onCancel={crud.close}
      />
    );
  }

  if (availability.isOpen) {
    return (
      <AvailabilityForm
        doctors={availability.doctors}
        selectedDoctorId={availability.selectedDoctorId}
        onSelectDoctor={availability.setSelectedDoctorId}
        selectedDoctor={availability.selectedDoctor}
        weeklySchedule={availability.weeklySchedule}
        onToggleDay={availability.toggleDay}
        onTimeChange={availability.changeTime}
        error={availability.error}
        success={availability.success}
        onSave={availability.save}
        onCancel={availability.close}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
          <form
            onSubmit={handleSearchSubmit}
            className="relative min-w-[240px] flex-1 sm:flex-initial"
          >
            <Input
              type="text"
              placeholder="Buscar doctor por nombre... (Enter)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </form>

          <Button
            onClick={availability.open}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Agregar Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={crud.openCreate}
            className="flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </div>

        <DoctorsTable
          doctors={doctors}
          loading={loading}
          onEdit={crud.openEdit}
          onDelete={crud.remove}
        />

        <TablePagination
          currentPage={pageIndex}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={(newPage) => setPageIndex(newPage)}
        />
      </Card>
    </div>
  );
}

export default DoctorsPage;
