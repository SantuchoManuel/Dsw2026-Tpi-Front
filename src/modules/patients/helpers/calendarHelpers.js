export const DAY_LABELS = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SÁB'];

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

export const MONTH_SHORT = [
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

  export const formatTime12h = (time) => {
    if (!time) return '';
  
    const [h, m] = time.split(':');
    const hora = Number(h);
  
    if (isNaN(hora) || !m) return time;
  
    const ampm = hora >= 12 ? 'PM' : 'AM';
    const hora12 = hora % 12 || 12;
  
    return `${hora12}:${m} ${ampm}`;
  };

export const parseSlotDate = (slot) => {
  if (!slot) return null;

  if (slot.date) return new Date(slot.date);

  const dateStr = slot.date;
  const timeStr = slot.startTime || slot.horaDeInicio || '00:00';

  if (!dateStr) return null;

  return new Date(
    `${dateStr}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`
  );
};

export const getWeekStart = (offset) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); 
  const diff = day === 0 ? -6 : 1 - day; 
  const monday = new Date(today);

  monday.setDate(today.getDate() + diff + offset * 7);

  return monday;
};

export const getWeekDays = (offset) => {
  const monday = getWeekStart(offset);

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);

    d.setDate(monday.getDate() + i);

    return d;
  });
};

export const groupSlotsByDay = (slots) => {
  return slots.reduce((acc, slot) => {
    const fecha = parseSlotDate(slot);
    const key = slot.date || (fecha ? fecha.toISOString().slice(0, 10) : null);

    if (!key) return acc;

    if (!acc[key]) acc[key] = [];

    acc[key].push(slot);

    return acc;
  }, {});
};