import { Pencil, Trash2 } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import SpecialtyIcon from './SpecialtyIcon';

function StatusRow({ children }) {
  return (
    <tr>
      <td colSpan="3" className="text-center py-8 text-med-text-muted">
        {children}
      </td>
    </tr>
  );
}

function SpecialtiesTable({
  specialties,
  isLoading,
  pageIndex,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 border-b border-med-border">
        <h2 className="text-base font-bold text-med-primary-900">
          Registros de Especialidades
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-med-primary-50/50 text-med-text-muted border-b border-med-border font-medium">
              <th className="px-6 py-3.5">Nombre de la Especialidad</th>
              <th className="px-6 py-3.5">Descripción</th>
              <th className="px-6 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-med-border">
            {isLoading ? (
              <StatusRow>Cargando especialidades...</StatusRow>
            ) : specialties.length === 0 ? (
              <StatusRow>No se encontraron especialidades cargadas.</StatusRow>
            ) : (
              specialties.map((spec) => (
                <tr
                  key={spec.id}
                  className="hover:bg-med-hover-row transition duration-150"
                >
                  <td className="px-6 py-4 font-semibold text-med-primary-900">
                    <div className="flex items-center gap-3">
                      <SpecialtyIcon name={spec.name} />
                      <span>{spec.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-med-text-sub max-w-md">
                    {spec.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="icon"
                        title="Editar especialidad"
                        onClick={() => onEdit(spec)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="iconDanger"
                        title="Eliminar especialidad"
                        onClick={() => onDelete(spec)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </Card>
  );
}

export default SpecialtiesTable;