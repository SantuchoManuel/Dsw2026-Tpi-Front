import { useState, useEffect } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { getDoctors } from '../../doctors/services/doctorsService';
import { instance } from '../../shared/api/axiosInstance';

function AppointmentsSearchPage() {
  const [dniQuery, setDniQuery] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  // --- Datos del back ---
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  // --- UI ---
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeChips, setActiveChips] = useState([]);
  // --- Cargar especialidades y doctores para los selects ---
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [specData, docData] = await Promise.all([
          getSpecialties({ pageSize: 100, pageIndex: 1 }),
          getDoctors({ pageSize: 100, pageIndex: 1 }),
        ]);
        setSpecialties(specData.data || []);
        setDoctors(docData.data || []);
      } catch (err) {
        console.error('Error cargando filtros:', err);
      }
    };
    fetchFilters();
  }, []);
  // --- Buscar citas ---
  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      const params = { pageSize, pageIndex: page };
      if (dniQuery.trim()) params.dni = Number(dniQuery.trim());
      if (specialtyId) params.specialtyId = specialtyId;
      if (doctorId) params.doctorId = doctorId;
      if (dateFilter) params.date = dateFilter;
      const response = await instance.get('api/appointments/search', { params });
      const data = response.data;
      setAppointments(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize) || 1);
      setPageIndex(page);
      setHasSearched(true);
      // Chips activos
      const chips = [];
      if (dniQuery.trim()) chips.push(`DNI: ${dniQuery.trim()}`);
      if (specialtyId) {
        const sp = specialties.find((s) => s.id === specialtyId);
        if (sp) chips.push(`Especialidad: ${sp.name}`);
      }
      if (doctorId) {
        const doc = doctors.find((d) => d.id === doctorId);
        if (doc) chips.push(`Doctor: ${doc.name}`);
      }
      if (dateFilter) chips.push(`Fecha: ${new Date(dateFilter + 'T00:00:00').toLocaleDateString('es-AR')}`);
      setActiveChips(chips);
    } catch (err) {
      console.error('Error buscando citas:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleApplyFilters = () => {
    fetchAppointments(1);
  };
  const handlePageChange = (newPage) => {
    fetchAppointments(newPage);
  };
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'confirmada')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
          <span className="w-1.5 h-1.5 rounded-full bg-med-active-text" />
          CONFIRMADO
        </span>
      );
    if (s === 'cancelada')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-danger-bg text-med-danger-text">
          <span className="w-1.5 h-1.5 rounded-full bg-med-danger-text" />
          CANCELADO
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        {status?.toUpperCase() || 'S/D'}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título de la página */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      {/* Card Superior: Criterios de Búsqueda */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-med-text-muted">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Última actualización: hace un momento</span>
          </div>
        </div>

        {/* Inputs de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end">
          {/* DNI del Paciente */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Nombre o DNI del Paciente
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="number"
                value={dniQuery}
                onChange={(e) => setDniQuery(e.target.value)}
                placeholder="Ej: 12345678"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
              />
            </div>
          </div>
          {/* Especialidad */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">Especialidad</label>
            <select
              value={specialtyId}
              onChange={(e) => setSpecialtyId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Todas las Especialidades</option>
              {specialties.map((sp) => (
                <option key={sp.id} value={sp.id}>{sp.name}</option>
              ))}
            </select>
          </div>
          {/* Doctor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">Doctor</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Todos los Doctores</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>
          {/* Fecha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">Fecha</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>
          {/* Botón */}
          <div>
            <Button
              onClick={handleApplyFilters}
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Aplicar Filtros</span>
            </Button>
          </div>
        </div>

        {/* Chips de Filtros Activos */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
            {activeChips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Card Inferior: Registros de Citas */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        {/* Tabla de Citas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Departamento</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {!hasSearched ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-xs text-med-text-muted">
                    Aplicá filtros para buscar citas.
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-xs text-med-text-muted">
                    Buscando...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-xs text-med-text-muted">
                    No se encontraron citas con esos filtros.
                  </td>
                </tr>
                ) : (
                appointments.map((item) => (
                  <tr key={item.appointmentsId} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs text-med-text-muted">
                        #{item.appointmentsId?.slice(0, 8)}...
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-med-primary-900">
                            {item.doctor?.specialty?.name}
                          </p>
                          <p className="text-xs text-med-text-muted">
                            {item.doctor?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-med-text-main">
                        {item.patient?.fullName || 'Sin nombre'}
                      </p>
                      <p className="text-xs text-med-text-muted mt-0.5">DNI: {item.patient?.dni}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.appointmentsStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs text-med-text-muted">—</span>
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
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Card>
    </div>
  );
}

export default AppointmentsSearchPage;
