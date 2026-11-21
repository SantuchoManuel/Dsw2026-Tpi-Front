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

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeChips, setActiveChips] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

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

  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const params = { pageSize, pageIndex: page };

      if (dniQuery.trim()) params.dni = Number(dniQuery.trim());

      if (specialtyId) params.specialtyId = specialtyId;

      if (doctorId) params.doctorId = doctorId;

      if (dateFilter) params.date = dateFilter;

      const response = await instance.get('api/appointments/search', {
        params,
      });
      const data = response.data;

      setAppointments(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize) || 1);
      setPageIndex(page);
      setHasSearched(true);

      const chips = [];

      if (dniQuery.trim()) chips.push(`Paciente: ${dniQuery.trim()}`);

      if (specialtyId) {
        const sp = specialties.find((s) => s.id === specialtyId);

        if (sp) chips.push(`Especialidad: ${sp.name}`);
      }

      if (doctorId) {
        const doc = doctors.find((d) => d.id === doctorId);

        if (doc) chips.push(`Doctor: ${doc.name}`);
      }

      if (dateFilter)
        chips.push(
          `Filtro Activo: ${new Date(dateFilter + 'T00:00:00').toLocaleDateString('es-AR')}`
        );

      setActiveChips(chips);
    } catch (err) {
      console.error('Error buscando citas:', err);
      setErrorMsg(
        err?.response?.data?.message || 'Error al buscar. Verificá los filtros.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => fetchAppointments(1);
  const handlePageChange = (p) => fetchAppointments(p);

  const handleVerDetalle = (item) => {
    const fechaObj = item.fecha ? new Date(item.fecha) : null;
    const fechaStr = fechaObj
      ? `${fechaObj.toLocaleDateString('es-AR')} ${fechaObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`
      : 'Sin fecha';

    window.alert(
      `Paciente: ${item.patient?.fullName || 'Sin nombre'}\n` +
        `DNI: ${item.patient?.dni}\n` +
        `Doctor: ${item.doctor?.name}\n` +
        `Especialidad: ${item.doctor?.specialty?.name}\n` +
        `Fecha: ${fechaStr}\n` +
        `Estado: ${item.appointmentsStatus}`
    );
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();

    if (s === 'confirmada')
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          CONFIRMADO
        </span>
      );

    if (s === 'cancelada')
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          CANCELADO
        </span>
      );

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        {status?.toUpperCase() || 'S/D'}
      </span>
    );
  };

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

      {/* Criterios */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-med-text-muted">
            <svg
              className="w-3.5 h-3.5"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Nombre o DNI del Paciente
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="number"
                value={dniQuery}
                onChange={(e) => setDniQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                placeholder="Ej: 12345678"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Especialidad
            </label>
            <select
              value={specialtyId}
              onChange={(e) => setSpecialtyId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Todas las Especialidades</option>
              {specialties.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Doctor
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Todos los Doctores</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Fecha
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            type="button"
            onClick={handleApplyFilters}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm disabled:opacity-60"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            {loading ? 'Buscando...' : 'Aplicar Filtros'}
          </Button>
        </div>

        {errorMsg && (
          <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errorMsg}
          </p>
        )}

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
            {activeChips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/80 text-sky-800"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Tabla */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border flex items-center justify-between">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
          {hasSearched && !loading && (
            <p className="text-xs text-med-text-muted">
              Mostrando {appointments.length} de {totalItems} registros
            </p>
          )}
        </div>

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
                  <td colSpan="5" className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-med-text-muted">
                      <svg
                        className="w-9 h-9 text-med-border"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="text-xs">
                        Aplicá filtros para buscar citas.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-xs text-med-text-muted"
                  >
                    Buscando...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-xs text-med-text-muted"
                  >
                    No se encontraron citas con esos filtros.
                  </td>
                </tr>
              ) : (
                appointments.map((item) => {
                  const fechaObj = item.fecha ? new Date(item.fecha) : null;
                  const dateStr = fechaObj
                    ? fechaObj.toLocaleDateString('es-AR')
                    : '—';
                  const timeStr = fechaObj
                    ? fechaObj.toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    : '—';

                  return (
                    <tr
                      key={item.appointmentsId}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-med-text-main">
                          {dateStr}
                        </p>
                        <p className="text-xs text-med-text-muted mt-0.5">
                          {timeStr}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-med-primary-900 text-sm">
                              {item.doctor?.specialty?.name ||
                                'Sin especialidad'}
                            </p>
                            <p className="text-xs text-med-text-muted">
                              Dr. {item.doctor?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-med-text-main text-sm">
                          {item.patient?.fullName}
                        </p>
                        <p className="text-xs text-med-text-muted mt-0.5">
                          DNI: {item.patient?.dni}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(item.appointmentsStatus)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleVerDetalle(item)}
                          className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900 hover:underline transition-colors"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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
