// Cálculos de racha, usados por StreakCard (Hoy/Semana) y MojoneraCard (Progreso).
// Todo sale de `tasks` ya persistidas: no hay datos inventados (ver fallow.png).

import type { Task } from '../types/domain';
import { addDays, startOfWeek } from './date';

function doneCountByDate(tasks: Task[]): Map<string, number> {
  const map = new Map<string, number>();
  tasks.forEach((t) => {
    if (t.status !== 'done') return;
    map.set(t.date, (map.get(t.date) ?? 0) + 1);
  });
  return map;
}

function doneCountByWeek(tasks: Task[]): Map<string, number> {
  const map = new Map<string, number>();
  tasks.forEach((t) => {
    if (t.status !== 'done') return;
    const weekStart = startOfWeek(t.date);
    map.set(weekStart, (map.get(weekStart) ?? 0) + 1);
  });
  return map;
}

export interface DailyStreak {
  current: number;
  record: number;
  todayDone: boolean;
}

/** Racha diaria: días consecutivos (hasta hoy) con al menos 1 tarea completada. */
export function computeDailyStreak(tasks: Task[], todayIso: string): DailyStreak {
  const counts = doneCountByDate(tasks);
  const todayDone = (counts.get(todayIso) ?? 0) > 0;

  let current = 0;
  let cursor = todayDone ? todayIso : addDays(todayIso, -1);
  while ((counts.get(cursor) ?? 0) > 0) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  const activeDates = Array.from(counts.entries())
    .filter(([, c]) => c > 0)
    .map(([d]) => d)
    .sort();
  let record = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of activeDates) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    record = Math.max(record, run);
    prev = d;
  }
  record = Math.max(record, current);

  return { current, record, todayDone };
}

export interface StoneMilestone {
  target: number;
  remainingDays: number;
  progress: number;
}

/** El Mojón suma una piedra nueva cada 7 días de racha. */
export function nextStoneMilestone(streak: number): StoneMilestone {
  const target = streak - (streak % 7) + 7;
  return { target, remainingDays: target - streak, progress: (streak % 7) / 7 };
}

export type DayCircleStatus = 'done' | 'today-pending' | 'future' | 'empty';

export interface DayCircle {
  date: string;
  letter: string;
  status: DayCircleStatus;
}

/** Los 7 círculos L..D de la semana actual, para StreakCard. */
export function buildWeekCircles(tasks: Task[], todayIso: string): DayCircle[] {
  const counts = doneCountByDate(tasks);
  const letters = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const monday = startOfWeek(todayIso);
  return letters.map((letter, i) => {
    const date = addDays(monday, i);
    const done = (counts.get(date) ?? 0) > 0;
    let status: DayCircleStatus;
    if (done) status = 'done';
    else if (date === todayIso) status = 'today-pending';
    else if (date > todayIso) status = 'future';
    else status = 'empty';
    return { date, letter, status };
  });
}

export interface DayBar {
  date: string;
  count: number;
  isToday: boolean;
  isFuture: boolean;
}

/** Barras L..D de la semana actual con la cantidad de tareas completadas por día. */
export function buildWeekBars(tasks: Task[], todayIso: string): DayBar[] {
  const counts = doneCountByDate(tasks);
  const monday = startOfWeek(todayIso);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    return { date, count: counts.get(date) ?? 0, isToday: date === todayIso, isFuture: date > todayIso };
  });
}

/** Total de tareas completadas en la semana que empieza en `weekStartIso`. */
export function weekTotal(tasks: Task[], weekStartIso: string): number {
  const counts = doneCountByWeek(tasks);
  return counts.get(weekStartIso) ?? 0;
}

export interface WeekdayChest {
  completed: number;
  target: number;
}

/** "Cofre del domingo": cuántos días de lunes a viernes ya tienen al menos 1 tarea hecha. */
export function weekdayChestProgress(tasks: Task[], todayIso: string): WeekdayChest {
  const counts = doneCountByDate(tasks);
  const monday = startOfWeek(todayIso);
  let completed = 0;
  for (let i = 0; i < 5; i += 1) {
    const date = addDays(monday, i);
    if (date <= todayIso && (counts.get(date) ?? 0) > 0) completed += 1;
  }
  return { completed, target: 5 };
}

export interface WeeklyActivity {
  /** Racha de semanas consecutivas (incluida la actual si ya tiene algo). */
  currentStreakWeeks: number;
  /** Mayor cantidad de tareas completadas en una sola semana (la "torre" más alta). */
  bestWeekCount: number;
  thisWeekCount: number;
}

export function computeWeeklyActivity(tasks: Task[], todayIso: string): WeeklyActivity {
  const counts = doneCountByWeek(tasks);
  const thisMonday = startOfWeek(todayIso);
  const thisWeekCount = counts.get(thisMonday) ?? 0;

  let bestWeekCount = 0;
  counts.forEach((c) => {
    bestWeekCount = Math.max(bestWeekCount, c);
  });

  let currentStreakWeeks = 0;
  let cursor = thisWeekCount > 0 ? thisMonday : addDays(thisMonday, -7);
  while ((counts.get(cursor) ?? 0) > 0) {
    currentStreakWeeks += 1;
    cursor = addDays(cursor, -7);
  }

  return { currentStreakWeeks, bestWeekCount, thisWeekCount };
}

export interface WeekTower {
  weekStart: string;
  count: number;
  isCurrent: boolean;
}

/** Últimas `weeks` semanas (incluida la actual), para las "torres" de MojoneraCard. */
export function buildWeekTowers(tasks: Task[], todayIso: string, weeks: number): WeekTower[] {
  const counts = doneCountByWeek(tasks);
  const thisMonday = startOfWeek(todayIso);
  const firstMonday = addDays(thisMonday, -7 * (weeks - 1));
  return Array.from({ length: weeks }, (_, i) => {
    const weekStart = addDays(firstMonday, 7 * i);
    return { weekStart, count: counts.get(weekStart) ?? 0, isCurrent: weekStart === thisMonday };
  });
}
