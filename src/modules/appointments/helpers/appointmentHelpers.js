export const formatAppointmentDate = (isoString) => {
  if (!isoString) return { date: '—', time: '—' };
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString('es-AR'),
    time: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  };
};

export const buildSearchChips = (filters, specialties, doctors) => {
  const { dniQuery, specialtyId, doctorId, dateFilter } = filters;
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

  if (dateFilter) {
    chips.push(
      `Filtro Activo: ${new Date(dateFilter + 'T00:00:00').toLocaleDateString('es-AR')}`
    );
  }

  return chips;
};

export const buildAlertDetail = (item) => {
  const { date, time } = formatAppointmentDate(item.fecha);
  const fechaStr = item.fecha ? `${date} ${time}` : 'Sin fecha';
  return (
    `Paciente: ${item.patient?.fullName || 'Sin nombre'}\n` +
    `DNI: ${item.patient?.dni}\n` +
    `Doctor: ${item.doctor?.name}\n` +
    `Especialidad: ${item.doctor?.specialty?.name}\n` +
    `Fecha: ${fechaStr}\n` +
    `Estado: ${item.appointmentsStatus}`
  );
};
