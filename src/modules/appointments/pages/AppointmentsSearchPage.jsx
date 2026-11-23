import useAppointmentSearch from '../hooks/useAppointmentSearch';
import AppointmentSearchFilters from '../components/AppointmentSearchFilters';
import AppointmentsResultsTable from '../components/AppointmentsResultsTable';

function AppointmentsSearchPage() {
  const {
    dniQuery,
    setDniQuery,
    specialtyId,
    setSpecialtyId,
    doctorId,
    setDoctorId,
    dateFilter,
    setDateFilter,
    specialties,
    doctors,
    appointments,
    totalItems,
    pageIndex,
    totalPages,
    pageSize,
    loading,
    hasSearched,
    activeChips,
    errorMsg,
    handleApplyFilters,
    handlePageChange,
    handleVerDetalle,
  } = useAppointmentSearch();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      <AppointmentSearchFilters
        dniQuery={dniQuery}
        onDniChange={setDniQuery}
        specialtyId={specialtyId}
        onSpecialtyChange={setSpecialtyId}
        doctorId={doctorId}
        onDoctorChange={setDoctorId}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        specialties={specialties}
        doctors={doctors}
        loading={loading}
        errorMsg={errorMsg}
        activeChips={activeChips}
        onApplyFilters={handleApplyFilters}
      />

      <AppointmentsResultsTable
        appointments={appointments}
        totalItems={totalItems}
        pageIndex={pageIndex}
        totalPages={totalPages}
        pageSize={pageSize}
        loading={loading}
        hasSearched={hasSearched}
        onPageChange={handlePageChange}
        onViewDetail={handleVerDetalle}
      />
    </div>
  );
}

export default AppointmentsSearchPage;
