import { useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import useSpecialties from '../hook/useSpecialties';
import SpecialtiesTable from '../components/SpecialtiesTable';
import SpecialtyForm from '../components/SpecialtyForm';
function SpecialtiesPage() {
  const {
    specialties,
    totalItems,
    totalPages,
    pageIndex,
    pageSize,
    isLoading,
    errorMessage,
    setPageIndex,
    search,
    saveSpecialty,
    removeSpecialty,
  } = useSpecialties();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [formError, setFormError] = useState('');
  const openForm = (specialty = null) => {
    setEditingSpecialty(specialty);
    setFormError('');
    setIsFormOpen(true);
  };
  const closeForm = () => setIsFormOpen(false);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    search(searchTerm);
  };
  const handleSave = async (formData) => {
    const result = await saveSpecialty(formData, editingSpecialty?.id);
    if (result.ok) {
      closeForm();
    } else {
      setFormError(result.message);
    }
  };
  const handleDelete = async (specialty) => {
    const confirmed = window.confirm(
      `¿Está seguro que desea eliminar la especialidad "${specialty.name}"?`
    );
    if (!confirmed) return;
    const result = await removeSpecialty(specialty.id);
    if (!result.ok) alert(result.message);
  };
  if (isFormOpen) {
    return (
      <SpecialtyForm
        specialty={editingSpecialty}
        error={formError}
        onSubmit={handleSave}
        onCancel={closeForm}
      />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="relative min-w-[240px] flex-1 sm:flex-initial"
          >
            <Input
              type="text"
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </form>
          <Button
            onClick={() => openForm()}
            className="flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Nueva Especialidad</span>
          </Button>
        </div>
      </div>
      {errorMessage && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {errorMessage}
        </div>
      )}
      <SpecialtiesTable
        specialties={specialties}
        isLoading={isLoading}
        pageIndex={pageIndex}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onEdit={openForm}
        onDelete={handleDelete}
      />
    </div>
  );
}
export default SpecialtiesPage;