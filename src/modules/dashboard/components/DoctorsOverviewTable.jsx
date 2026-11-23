import { useState } from 'react';
import { Search } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import TablePagination from '../../shared/components/TablePagination';

function DoctorsOverviewTable({
  doctors,
  loading,
  pageIndex,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onSearch,
  onViewDetail,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-med-border">
        <h2 className="text-base font-bold text-med-primary-900">
          Directorio de Profesionales Médicos
        </h2>
        <form onSubmit={handleSubmit} className="relative w-full sm:w-72">
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </form>
      </div>

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
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-8 text-center text-med-text-muted text-xs"
                >
                  Cargando doctores...
                </td>
              </tr>
            ) : doctors.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-8 text-center text-med-text-muted text-xs"
                >
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
                    <img
                      src="/doctor-avatar.jpg"
                      alt={doc.name}
                      className="w-9 h-9 rounded-full object-cover border border-med-primary-200"
                    />
                    <span className="font-semibold text-med-primary-900">
                      {doc.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-med-text-sub">
                    {doc.speciality?.name || 'Sin especialidad'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="link" onClick={onViewDetail}>
                      Ver Detalle
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={pageIndex}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </Card>
  );
}

export default DoctorsOverviewTable;
