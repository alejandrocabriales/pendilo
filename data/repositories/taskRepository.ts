import type { Task } from '../../types/domain';
import { buildSeedData } from '../mocks/seed';
import { readJSON, writeJSON, StorageKeys } from '../storage';
import { createId } from '../../lib/id';
import { addDays } from '../../lib/date';

// Contrato estable: en Fase 2 se reemplaza esta implementación por un adaptador HTTP
// a FastAPI con la misma forma (list/create/update/complete/reschedule), sin tocar la UI.

async function loadAll(): Promise<Task[]> {
  const stored = await readJSON<Task[]>(StorageKeys.tasks);
  if (stored) return stored;
  // Primer arranque: sembrar con el mock y persistir, para no reiniciar las tareas
  // cada vez que se abre la app (sección 7 del plan).
  const { tasks } = buildSeedData();
  await writeJSON(StorageKeys.tasks, tasks);
  return tasks;
}

async function saveAll(tasks: Task[]): Promise<void> {
  await writeJSON(StorageKeys.tasks, tasks);
}

export const taskRepository = {
  async list(): Promise<Task[]> {
    return loadAll();
  },

  async create(input: {
    title: string;
    date: string;
    minutes: number | null;
    durationMin: number;
    source: Task['source'];
    isNew?: boolean;
  }): Promise<Task> {
    const tasks = await loadAll();
    const now = new Date().toISOString();
    const task: Task = {
      id: createId('t'),
      title: input.title,
      date: input.date,
      minutes: input.minutes,
      durationMin: input.durationMin,
      status: 'pending',
      isNew: input.isNew ?? true,
      source: input.source,
      createdAt: now,
      updatedAt: now,
    };
    await saveAll([...tasks, task]);
    return task;
  },

  async update(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const tasks = await loadAll();
    let updated: Task | undefined;
    const next = tasks.map((t) => {
      if (t.id !== id) return t;
      updated = { ...t, ...patch, updatedAt: new Date().toISOString() };
      return updated;
    });
    if (!updated) throw new Error(`Task ${id} not found`);
    await saveAll(next);
    return updated;
  },

  async complete(id: string, done: boolean): Promise<Task> {
    return this.update(id, { status: done ? 'done' : 'pending', isNew: false });
  },

  async reschedule(id: string, next: { date: string; minutes: number | null }): Promise<Task> {
    return this.update(id, { date: next.date, minutes: next.minutes, isNew: false });
  },

  async postpone(id: string): Promise<Task> {
    const tasks = await loadAll();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task ${id} not found`);
    return this.reschedule(id, { date: addDays(task.date, 1), minutes: task.minutes });
  },

  async resetToSeed(): Promise<Task[]> {
    const { tasks } = buildSeedData();
    await saveAll(tasks);
    return tasks;
  },
};
