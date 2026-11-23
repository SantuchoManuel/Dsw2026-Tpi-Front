import Button from '../../shared/components/Button';

function DoctorsTable({ doctors, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">
      <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
        <tr>
          <th className="px-6 py-3.5">Nombre del Doctor</th>
          <th className="px-6 py-3.5">Matrícula</th>
          <th className="px-6 py-3.5">Especialidad</th>
          <th className="px-6 py-3.5 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-med-border-subtle">
        {loading ? (
          <tr>
            <td
              colSpan="4"
              className="px-6 py-8 text-center text-med-text-muted text-xs"
            >
              Cargando doctores...
            </td>
          </tr>
        ) : doctors.length === 0 ? (
          <tr>
            <td
              colSpan="4"
              className="px-6 py-8 text-center text-med-text-muted text-xs"
            >
              No se encontraron doctores registrados.
            </td>
          </tr>
        ) : (
          doctors.map((doc) => (
            <tr
              key={doc.id}
              className="hover:bg-gray-50/70 transition-colors"
            >
              {/* Doctor Info */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-med-primary-100 flex items-center justify-center text-xl">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="font-semibold text-med-primary-900 leading-tight">
                      {doc.name}
                    </p>
                  </div>
                </div>
              </td>

              {/* Matrícula */}
              <td className="px-6 py-4 text-xs text-med-text-main font-mono">
                {doc.licenseNumber || 'S/D'}
              </td>

              {/* Especialidad Badge en Píldora */}
              <td className="px-6 py-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                  {doc.speciality?.name || 'Sin especialidad'}
                </span>
              </td>

              {/* Botones de Acciones (Ojo, Lápiz, Basurero) */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 text-med-primary-600">
                  <Button
                    variant="icon"
                    title="Ver detalle"
                    onClick={() =>
                      alert(
                        `Doctor: ${doc.name}\nMatrícula: ${doc.licenseNumber || 'S/D'}\nEspecialidad: ${doc.speciality?.name || 'Sin especialidad'}`
                      )
                    }
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </Button>

                  <Button
                    variant="icon"
                    title="Editar profesional"
                    onClick={() => onEdit(doc)}
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </Button>

                  <Button
                    variant="iconDanger"
                    title="Eliminar profesional"
                    onClick={() => onDelete(doc)}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  );
}

export default DoctorsTable;