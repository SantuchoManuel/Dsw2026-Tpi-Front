import { useNavigate } from 'react-router-dom';
import { BriefcaseMedical, LayoutGrid, Calendar } from 'lucide-react';
import Button from '../../shared/components/Button';
import useDoctors from '../../doctors/hook/useDoctors';
import useDashboardStats from '../hook/useDashboardStats';
import StatCard from '../components/StatCard';
import DoctorsOverviewTable from '../components/DoctorsOverviewTable';

function OverviewPage() {
  const navigate = useNavigate();

  const {
    doctors,
    loading,
    pageIndex,
    setPageIndex,
    totalPages,
    totalCount,
    pageSize,
    buscar,
  } = useDoctors(5);

  const { totalSpecialties, todayAppointments } = useDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Vista General de Gestión
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Configure el personal médico y las especialidades del departamento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => navigate('/admin/doctors')}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Agregar Nuevo Doctor</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/admin/specialties')}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Agregar Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          icon={<BriefcaseMedical className="w-6 h-6" />}
          badgeText="+4 este mes"
          badgeClassName="bg-med-active-bg text-med-active-text"
          label="Doctores Activos"
          value={totalCount}
        />

        <StatCard
          icon={<LayoutGrid className="w-6 h-6" />}
          badgeText="Estable"
          badgeClassName="bg-gray-100 text-gray-600"
          label="Especialidades Activas"
          value={totalSpecialties}
        />

        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          badgeText="Hoy"
          badgeClassName="bg-med-primary-100 text-med-primary-700"
          label="Turnos Confirmados Para Hoy"
          value={todayAppointments}
        />
      </div>

      <DoctorsOverviewTable
        doctors={doctors}
        loading={loading}
        pageIndex={pageIndex}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onSearch={buscar}
        onViewDetail={() => navigate('/admin/doctors')}
      />
    </div>
  );
}

export default OverviewPage;