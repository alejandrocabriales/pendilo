// Cálculos del ciclo semanal (04 · Esta semana). Reemplaza a lib/streak.ts:
// Pendilo no mide rachas, récords ni niveles — solo "qué llevo esta semana,
// qué sigue y cuándo cierra" (ver SPEC §04 y "Qué cambió").

import type { Task } from '../types/domain';
import { addDays, startOfWeek, weekdayShort } from './date';

function doneCountByDate(tasks: Task[]): Map<string, number> {
  const map = new Map<string, number>();
  tasks.forEach((t) => {
    if (t.status !== 'done') return;
    map.set(t.date, (map.get(t.date) ?? 0) + 1);
  });
  return map;
}

function totalCountByDate(tasks: Task[]): Map<string, number> {
  const map = new Map<string, number>();
  tasks.forEach((t) => {
    map.set(t.date, (map.get(t.date) ?? 0) + 1);
  });
  return map;
}

/** Número de semana ISO-8601 (lunes como primer día). */
export function weekNumber(iso: string): number {
  const d = new Date(iso + 'T00:00:00');
  const dayNum = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - dayNum + 3); // jueves de esa semana
  const firstThursday = new Date(d.getFullYear(), 0, 4);
  const diffWeeks = Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86400000));
  return 1 + diffWeeks;
}

/** Días hasta el cierre del ciclo (domingo inclusive). Lunes -> 6, domingo -> 0. */
export function daysUntilCycleClose(todayIso: string): number {
  const d = new Date(todayIso + 'T00:00:00');
  const mondayIndexed = (d.getDay() + 6) % 7; // lunes = 0 .. domingo = 6
  return 6 - mondayIndexed;
}

export type DayBarStatus = 'done' | 'today-pending' | 'future' | 'empty';

export interface DayBar {
  date: string;
  letter: string;
  status: DayBarStatus;
}

/** Barra simple de 7 días (hecho / hoy pendiente / futuro / vacío), para WeekSummaryCard. */
export function buildWeekDayBars(tasks: Task[], todayIso: string): DayBar[] {
  const counts = doneCountByDate(tasks);
  const monday = startOfWeek(todayIso);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const done = (counts.get(date) ?? 0) > 0;
    let status: DayBarStatus;
    if (done) status = 'done';
    else if (date === todayIso) status = 'today-pending';
    else if (date > todayIso) status = 'future';
    else status = 'empty';
    return { date, letter: weekdayShort(date).charAt(0), status };
  });
}

export type DayCycleStatus = 'ok' | 'parcial' | 'futuro' | 'hoy';

export interface DayCycleState {
  date: string;
  letter: string;
  status: DayCycleStatus;
}

/**
 * Estados de los 7 días del ciclo (04 · Esta semana): hoy siempre pulsa ("hoy"),
 * sin importar si ya se completó algo; los demás días son ok (nada pendiente),
 * parcial (algo quedó sin hacer) o futuro. Umbrales de "parcial" documentados
 * porque son una decisión de producto, no un dato del handoff.
 */
export function buildDayCycleStates(tasks: Task[], todayIso: string): DayCycleState[] {
  const done = doneCountByDate(tasks);
  const total = totalCountByDate(tasks);
  const monday = startOfWeek(todayIso);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const letter = weekdayShort(date).charAt(0);
    if (date === todayIso) return { date, letter, status: 'hoy' as const };
    if (date > todayIso) return { date, letter, status: 'futuro' as const };
    const t = total.get(date) ?? 0;
    const d = done.get(date) ?? 0;
    const status: DayCycleStatus = t === 0 || d >= t ? 'ok' : 'parcial';
    return { date, letter, status };
  });
}

export type WeekLoad = 'ligera' | 'media' | 'alta';

/** Carga de la semana según tareas pendientes. Umbrales ajustables, no vienen del handoff. */
export function weekLoad(pendingCount: number): WeekLoad {
  if (pendingCount <= 3) return 'ligera';
  if (pendingCount <= 7) return 'media';
  return 'alta';
}

export function weekLoadLabel(load: WeekLoad): string {
  return { ligera: 'Carga ligera', media: 'Carga media', alta: 'Carga alta' }[load];
}
