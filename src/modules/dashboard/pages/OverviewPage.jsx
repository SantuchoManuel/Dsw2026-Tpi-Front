import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { getDoctors } from '../../doctors/services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import TablePagination from '../../shared/components/TablePagination';

function OverviewPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSpecilities, setTotalSpecialities] = useState(0);

  const fetchDoctors = async (page = pageIndex, name = searchTerm) => {
    try {
      setLoadingDoctors(true);
      const data = await getDoctors({ pageSize: 5, pageIndex: page, name });
      setDoctors(data.data || []);
      setTotalDoctors(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / 5) || 1);
    } catch (err) {
      console.error('Error al cargar doctores en overview:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };


  const fetchSpecialities = async () => {
    try {
      const data = await getSpecialties({ pageSize: 1, pageIndex: 1 });
      setTotalSpecialities(data.total || 0);
    } catch (err) {
      console.error('Error al cargar especialidades:', err);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  useEffect(() => {
    fetchDoctors(pageIndex, searchTerm);
  }, [pageIndex]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageIndex(1);
    fetchDoctors(1, searchTerm);
  };

  /*const previewDoctors = [
    {
      id: 1,
      name: 'Dr. James Wilson',
      specialty: 'Cardiología',
      status: 'Activo',
      statusType: 'active',
      avatar: '👨‍⚕️',
    },
    {
      id: 2,
      name: 'Dr. Elena Rodriguez',
      specialty: 'Neurología',
      status: 'Activo',
      statusType: 'active',
      avatar: '👩‍⚕️',
    },
    {
      id: 3,
      name: 'Dr. Robert Chen',
      specialty: 'Pediatría',
      status: 'De Licencia',
      statusType: 'leave',
      avatar: '👨‍⚕️',
    },
  ];*/

  return (
    <div className="flex flex-col gap-8">
      {/* Header con Título y Acciones Principales */}
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

      {/* Tarjetas de Métricas de la Imagen 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Doctores Activos */}
        <Card className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-med-active-bg text-med-active-text">
              +4 este mes
            </span>
          </div>

          <div className="mt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
              Doctores Activos
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1">
              {totalDoctors}
            </p>
          </div>
        </Card>

        {/* Especialidades Activas */}
        <Card className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              Estable
            </span>
          </div>

          <div className="mt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
              Especialidades Activas
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1">
              {totalSpecilities}
            </p>
          </div>
        </Card>

        {/* Turnos Confirmados para Hoy */}
        <Card className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-med-primary-100 text-med-primary-700">
              Hoy
            </span>
          </div>

          <div className="mt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
              Turnos Confirmados Para Hoy
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1">
              48
            </p>
          </div>
        </Card>
      </div>

      {/* Directorio de Profesionales Médicos (Tabla Resumen) */}
      <Card className="p-0 overflow-hidden border-med-border">
        {/* Cabecera de la tabla con Buscador */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Directorio de Profesionales Médicos
          </h2>
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
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
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-med-primary-50/70 border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </form>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle text-sm">
              {loadingDoctors ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-med-text-muted text-xs">
                    Cargando doctores...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-med-text-muted text-xs">
                    No hay doctores registrados.
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-med-primary-100 flex items-center justify-center text-lg">
                        👨‍⚕️
                      </span>
                      <span className="font-semibold text-med-primary-900">
                        {doc.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-med-text-sub">
                      {doc.speciality.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate('/admin/doctors')}
                        className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador inferior normalizado */}
        <TablePagination
          currentPage={pageIndex}
          totalPages={totalPages}
          totalItems={totalDoctors}
          pageSize={5}
          onPageChange={(newPage) => setPageIndex(newPage)}
        />
      </Card>
    </div>
  );
}

export default OverviewPage;
