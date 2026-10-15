import mockData from './mocks/mock-data.json';

/** Textos de interfaz del handoff (design/mock-data.json → copy). */
export const copy = mockData.copy;

export function pendingHeader(n: number): string {
  if (n === 0) return copy.header.empty;
  if (n === 1) return copy.header.pendingOne;
  return copy.header.pending.replace('{n}', String(n));
}

export function overdueBanner(n: number): string {
  return n === 1 ? copy.overdue.one : copy.overdue.many.replace('{n}', String(n));
}

export function foundSummary(taskCount: number, goalCount: number): string {
  const taskWord = taskCount === 1 ? '1 tarea' : `${taskCount} tareas`;
  const goalWord = goalCount === 1 ? '1 objetivo semanal' : `${goalCount} objetivos semanales`;
  return copy.voice.found.replace('{tasks}', taskWord).replace('{goals}', goalWord);
}

export function dayCompleteStats(done: number, total: number): string {
  const taskWord = total === 1 ? 'tarea' : 'tareas';
  return `Hiciste ${done} de ${total} ${taskWord}`;
}
