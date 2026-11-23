import { Info, Timer, Save } from 'lucide-react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function AvailabilityForm({
  doctors,
  selectedDoctorId,
  onSelectDoctor,
  selectedDoctor,
  weeklySchedule,
  onToggleDay,
  onTimeChange,
  error,
  success,
  onSave,
  onCancel,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-med-text-muted">
        <button
          type="button"
          onClick={onCancel}
          className="hover:text-med-primary-900 transition cursor-pointer"
        >
          Doctores
        </button>
        <span>›</span>
        <span className="font-semibold text-med-primary-900">
          Disponibilidad Horaria
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-med-text-main">
          Gestionar Disponibilidad Horaria
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Defina los días y rangos horarios de atención para el profesional
          seleccionado.
        </p>
      </div>
      {/* Mensajes de Alerta */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
          {success}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Seleccion de Profesional y Previsualización */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-med-text-main mb-2">
                Seleccionar Profesional
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => onSelectDoctor(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
              >
                <option value="">Seleccione un doctor...</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.speciality?.name || 'S/E'}
                  </option>
                ))}
              </select>
            </div>
            {/* Tarjeta de previsualización del doctor */}
            {selectedDoctor && (
              <div className="p-4 bg-med-primary-50/70 border border-med-primary-100 rounded-xl flex items-center gap-4">
                <img
                  src="/doctor-avatar.jpg"
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-xl object-cover border border-med-primary-200 shadow-xs"
                />
                <div>
                  <h4 className="font-bold text-med-primary-900 text-sm">
                    {selectedDoctor.name}
                  </h4>
                  <p className="text-[11px] text-med-text-muted mt-0.5">
                    ID: {selectedDoctor.licenseNumber || 'S/D'}
                  </p>
                  <p className="text-[11px] font-semibold text-med-primary-700">
                    {selectedDoctor.speciality?.name || 'General'}
                  </p>
                </div>
              </div>
            )}
          </Card>
          <Card className="p-4 flex items-start gap-3">
            <span className="text-med-primary-700 text-base mt-0.5">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            </span>
            <p className="text-xs text-med-text-sub leading-relaxed">
              Los cambios realizados se aplicarán a partir de la próxima semana
              calendario. Las citas ya programadas no se verán afectadas
              automáticamente.
            </p>
          </Card>
        </div>
        {/* Columna Derecha: Configuración de Horarios por Día */}
        <div className="lg:col-span-8">
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-med-border flex items-center justify-between">
              <h3 className="font-bold text-med-primary-900 text-sm">
                Configuración de Horarios
              </h3>
              <span className="text-[11px] text-med-text-muted flex items-center gap-1">
                <Timer className="w-4 h-4 text-med-text-muted" /> Intervalos
                automáticos de 30 minutos
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
                  <tr>
                    <th className="px-6 py-3.5">Día</th>
                    <th className="px-6 py-3.5 text-center">Estado</th>
                    <th className="px-6 py-3.5">Entrada</th>
                    <th className="px-6 py-3.5">Salida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {weeklySchedule.map((item, index) => (
                    <tr
                      key={item.day}
                      className={
                        item.active
                          ? 'hover:bg-gray-50/70'
                          : 'bg-gray-50/40 text-med-text-muted'
                      }
                    >
                      {/* Nombre del Día */}
                      <td className="px-6 py-4 font-semibold text-med-primary-900">
                        {item.day}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleDay(index)}
                          className="inline-flex items-center gap-2 cursor-pointer"
                        >
                          <span
                            className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                              item.active ? 'bg-med-primary-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                                item.active ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </span>
                          <span className="text-xs font-medium">
                            {item.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {item.active ? (
                          <input
                            type="time"
                            value={item.startTime}
                            onChange={(e) =>
                              onTimeChange(index, 'startTime', e.target.value)
                            }
                            className="px-2.5 py-1.5 border border-med-border rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                          />
                        ) : (
                          <span className="text-med-text-muted font-mono">
                            --:--
                          </span>
                        )}
                      </td>
                      {/* Hora Salida */}
                      <td className="px-6 py-4">
                        {item.active ? (
                          <input
                            type="time"
                            value={item.endTime}
                            onChange={(e) =>
                              onTimeChange(index, 'endTime', e.target.value)
                            }
                            className="px-2.5 py-1.5 border border-med-border rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-med-primary-600"
                          />
                        ) : (
                          <span className="text-med-text-muted font-mono">
                            --:--
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Botones Cancelar y Guardar */}
            <div className="p-5 border-t border-med-border flex items-center justify-end gap-3 bg-white">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-5 py-2 text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={onSave}
                className="px-5 py-2 text-xs bg-med-primary-900 hover:bg-med-primary-800 text-white flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Disponibilidad</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityForm;
