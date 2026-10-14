// Utilidades de fecha/hora locales. Fase 1 usa siempre la hora del dispositivo
// (no hace falta una librería de zonas horarias: no hay sincronización con servidor todavía).

const WEEKDAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const WEEKDAY_LONG = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Convierte un Date a 'YYYY-MM-DD' usando los componentes locales (no UTC). */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Parsea 'YYYY-MM-DD' a un Date a medianoche local (evita el corrimiento de `new Date(iso)`, que es UTC). */
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(now: Date = new Date()): string {
  return toISODate(now);
}

export function addDays(iso: string, amount: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + amount);
  return toISODate(d);
}

/** Lunes de la semana que contiene `iso` (semana lunes–domingo). */
export function startOfWeek(iso: string): string {
  const d = fromISODate(iso);
  const dow = d.getDay(); // 0 = domingo
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  return addDays(iso, diffToMonday);
}

/** Los 7 días (ISO) de la semana que empieza en `mondayIso`. */
export function weekDates(mondayIso: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(mondayIso, i));
}

export function weekdayShort(iso: string): string {
  return WEEKDAY_SHORT[fromISODate(iso).getDay()];
}

export function weekdayLong(iso: string): string {
  return WEEKDAY_LONG[fromISODate(iso).getDay()];
}

export function dayOfMonth(iso: string): number {
  return fromISODate(iso).getDate();
}

export function monthShort(iso: string): string {
  return MONTH_SHORT[fromISODate(iso).getMonth()];
}

export function isSameDate(a: string, b: string): boolean {
  return a === b;
}

export function isBefore(a: string, b: string): boolean {
  return a < b;
}

/** Minutos desde las 00:00 locales, del momento actual (o de `now`). */
export function nowMinutes(now: Date = new Date()): number {
  return now.getHours() * 60 + now.getMinutes();
}

/** 930 -> '15:30'. */
export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

/** Etiqueta corta para un día relativo a "hoy": 'Hoy' | 'Mañana' | 'Vie 17'. */
export function relativeDayLabel(iso: string, todayIso: string): string {
  if (iso === todayIso) return 'Hoy';
  if (iso === addDays(todayIso, 1)) return 'Mañana';
  return `${weekdayShort(iso)} ${dayOfMonth(iso)}`;
}

/** Etiqueta accesible completa de un día, p. ej. "Lunes 12, 2 tareas, con tareas vencidas". */
export function accessibleDayLabel(iso: string, taskCount: number, hasOverdue: boolean): string {
  const weekday = weekdayLong(iso);
  const day = dayOfMonth(iso);
  const taskWord = taskCount === 1 ? 'tarea' : 'tareas';
  const overdueSuffix = hasOverdue ? ', con tareas vencidas' : '';
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${day}, ${taskCount} ${taskWord}${overdueSuffix}`;
}
