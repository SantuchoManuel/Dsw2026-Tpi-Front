import { Search, FileText } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import StatusBadge from '../../shared/components/StatusBadge';
import { formatAppointmentDate } from '../helpers/appointmentHelpers';

function AppointmentsResultsTable({
  appointments,
  totalItems,
  pageIndex,
  totalPages,
  pageSize,
  loading,
  hasSearched,
  onPageChange,
  onViewDetail,
}) {
  return (
    <Card className="p-0 overflow-hidden">
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
                    <Search className="w-9 h-9 text-med-border" />
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
                const { date: dateStr, time: timeStr } = formatAppointmentDate(
                  item.date || item.Date || item.fecha || item.availableTime
                );

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
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-med-primary-900 text-sm">
                            {item.doctor?.specialty?.name || 'Sin especialidad'}
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
                      <StatusBadge status={item.appointmentsStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => onViewDetail(item)}
                      >
                        Ver Detalle
                      </Button>
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
        onPageChange={onPageChange}
      />
    </Card>
  );
}

export default AppointmentsResultsTable;
