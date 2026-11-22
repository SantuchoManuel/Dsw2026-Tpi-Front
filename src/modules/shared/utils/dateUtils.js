export const DAY_LABELS = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SÁB'];
export const DAY_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
export const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

// Lunes de la semana actual + offset semanas
export const getWeekStart = (offset = 0) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);

  monday.setDate(today.getDate() + diff + offset * 7);

  return monday;
};

// Los 5 días Lun-Vie de la semana
export const getWeekDays = (offset = 0) => {
  const monday = getWeekStart(offset);

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);

    d.setDate(monday.getDate() + i);

    return d;
  });
};

export const toDateKey = (date) => date.toISOString().slice(0, 10);
export const isPastDay = (date) =>
  date < new Date(new Date().setHours(0, 0, 0, 0));
export const formatWeekRange = (weekDays) => {
  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];

  return `${DAY_FULL[first.getDay()]} ${first.getDate()} - ${DAY_FULL[last.getDay()]} ${last.getDate()}, ${MONTH_LABELS[last.getMonth()]}`;
};
