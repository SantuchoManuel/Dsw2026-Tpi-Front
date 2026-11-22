import { toDateKey } from '../../shared/utils/dateUtils';

export const getSlotId = (slot) => slot.availabilitySlotId || slot.id;

export const isSlotAvailable = (slot) =>
  slot.status === 'AVAILABLE' ||
  slot.status === 0 ||
  slot.status === '0' ||
  !slot.status;

export const parseSlotDate = (slot) =>
  slot?.date ? new Date(slot.date) : null;

export const getSlotTime = (slot) => {
  if (slot.startTime) return slot.startTime;

  const date = parseSlotDate(slot);

  return date
    ? date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    : '';
};

export const groupSlotsByDay = (slots) =>
  slots.reduce((acc, slot) => {
    const date = parseSlotDate(slot);
    const key = slot.date || (date ? toDateKey(date) : null);

    if (!key) return acc;

    (acc[key] ||= []).push(slot);

    return acc;
  }, {});

export const formatSlotSummary = (slot) => {
  const date = parseSlotDate(slot);

  if (!date) return '';

  const day = date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return `${day} - ${getSlotTime(slot)} hs`;
};
