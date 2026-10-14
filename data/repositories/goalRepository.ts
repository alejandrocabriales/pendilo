import type { Goal } from '../../types/domain';
import { buildSeedData } from '../mocks/seed';
import { readJSON, writeJSON, StorageKeys } from '../storage';
import { createId } from '../../lib/id';

async function loadAll(): Promise<Goal[]> {
  const stored = await readJSON<Goal[]>(StorageKeys.goals);
  if (stored) return stored;
  const { goals } = buildSeedData();
  await writeJSON(StorageKeys.goals, goals);
  return goals;
}

async function saveAll(goals: Goal[]): Promise<void> {
  await writeJSON(StorageKeys.goals, goals);
}

export function isGoalComplete(goal: Goal): boolean {
  return goal.value >= goal.target;
}

export const goalRepository = {
  async list(): Promise<Goal[]> {
    return loadAll();
  },

  async create(input: { kind: Goal['kind']; title: string; target: number; unit: string }): Promise<Goal> {
    const goals = await loadAll();
    const now = new Date().toISOString();
    const goal: Goal = {
      id: createId('g'),
      kind: input.kind,
      title: input.title,
      value: 0,
      target: input.target,
      unit: input.unit,
      period: 'week',
      createdAt: now,
      updatedAt: now,
    };
    await saveAll([...goals, goal]);
    return goal;
  },

  /** Paso: 1 sesión / 5 % / 30 min, según `kind` (ver sección 4 del handoff). Clampa a [0, target]. */
  async updateProgress(id: string, delta: number): Promise<Goal> {
    const goals = await loadAll();
    let updated: Goal | undefined;
    const next = goals.map((g) => {
      if (g.id !== id) return g;
      const value = Math.min(Math.max(g.value + delta, 0), g.target);
      updated = { ...g, value, updatedAt: new Date().toISOString() };
      return updated;
    });
    if (!updated) throw new Error(`Goal ${id} not found`);
    await saveAll(next);
    return updated;
  },

  async resetToSeed(): Promise<Goal[]> {
    const { goals } = buildSeedData();
    await saveAll(goals);
    return goals;
  },
};

export function goalStep(kind: Goal['kind']): number {
  if (kind === 'count') return 1;
  if (kind === 'percent') return 5;
  return 0.5; // hours
}
