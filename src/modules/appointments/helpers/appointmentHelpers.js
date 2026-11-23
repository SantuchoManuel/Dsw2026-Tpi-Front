const MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export const formatAppointmentDate = (isoString) => {
  if (!isoString) return { date: '—', time: '—' };

  const d = new Date(isoString);

  if (isNaN(d.getTime())) return { date: '—', time: '—' };

  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();

  const hours24 = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = String(hours24 % 12 || 12).padStart(2, '0');

  return {
    date: `${day} ${month}, ${year}`,
    time: `${hours12}:${minutes} ${ampm}`,
  };
};

export const buildSearchChips = (filters, specialties, doctors) => {
  const { dniQuery, specialtyId, doctorId, dateFilter } = filters;
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

  if (dateFilter) {
    chips.push(
      `Filtro Activo: ${new Date(dateFilter + 'T00:00:00').toLocaleDateString('es-AR')}`
    );
  }

  return chips;
};

export const buildAlertDetail = (item) => {
  const rawDate = item.date || item.fecha;
  const { date, time } = formatAppointmentDate(rawDate);
  const fechaStr = rawDate ? `${date} - ${time}` : 'Sin fecha';

  return (
    `Paciente: ${item.patient?.fullName || 'Sin nombre'}\n` +
    `DNI: ${item.patient?.dni}\n` +
    `Doctor: ${item.doctor?.name}\n` +
    `Especialidad: ${item.doctor?.specialty?.name}\n` +
    `Fecha: ${fechaStr}\n` +
    `Estado: ${item.appointmentsStatus}`
  );
};
