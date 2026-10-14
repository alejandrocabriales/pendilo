import mockData from './mock-data.json';
import type { Task, Goal } from '../../types/domain';
import { addDays, startOfWeek, todayISO } from '../../lib/date';

type SeedDayKey = 'Hoy' | 'Mañana' | 'Lun' | 'Mar' | 'Vie';

/**
 * El handoff de diseño etiqueta los días como 'Hoy' | 'Lun' | 'Mar' | 'Vie' (prototipo fijo
 * en miércoles 14/10). En producción usamos fechas ISO reales: 'Hoy'/'Mañana' siguen al reloj
 * del dispositivo; 'Lun'/'Mar'/'Vie' se anclan al lunes de la semana ISO actual, para que los
 * datos de ejemplo tengan sentido sin importar qué día se abra la app por primera vez.
 */
function dayKeyToISO(key: SeedDayKey, today: string): string {
  const monday = startOfWeek(today);
  switch (key) {
    case 'Hoy':
      return today;
    case 'Mañana':
      return addDays(today, 1);
    case 'Lun':
      return monday;
    case 'Mar':
      return addDays(monday, 1);
    case 'Vie':
      return addDays(monday, 4);
  }
}

/** Genera las tareas y objetivos semilla, anclados a la fecha real de hoy. */
export function buildSeedData(now: Date = new Date()): { tasks: Task[]; goals: Goal[] } {
  const today = todayISO(now);
  const nowIso = now.toISOString();

  const tasks: Task[] = mockData.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    date: dayKeyToISO(t.day as SeedDayKey, today),
    minutes: t.minutes,
    durationMin: t.durationMin,
    status: t.done ? 'done' : 'pending',
    isNew: t.isNew,
    source: t.source as Task['source'],
    createdAt: nowIso,
    updatedAt: nowIso,
  }));

  const goals: Goal[] = mockData.goals.map((g) => ({
    id: g.id,
    kind: g.kind as Goal['kind'],
    title: g.title,
    value: g.value,
    target: g.target,
    unit: g.unit,
    period: 'week',
    createdAt: nowIso,
    updatedAt: nowIso,
  }));

  return { tasks, goals };
}

export const seedUserName: string = mockData.context.user.name;
