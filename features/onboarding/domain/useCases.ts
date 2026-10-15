import type { Mood } from '../../../types/domain';
import type { OnboardingDemoTask } from './types';

/** Marca/desmarca una tarea de ejemplo, sin tocar las demás. */
export function toggleDemoTask(tasks: OnboardingDemoTask[], id: number): OnboardingDemoTask[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

export function demoDoneCount(tasks: OnboardingDemoTask[]): number {
  return tasks.filter((t) => t.done).length;
}

/**
 * Cuántas de las 5 franjas de Poli corresponden a `done` de `total` tareas hechas.
 * Misma fórmula para el relleno de la caracola y para el color de cada segmento de progreso
 * (una tarea hecha "pinta" la franja que le toca, igual que en la app real).
 */
export function bandsForProgress(done: number, total: number): number {
  if (done <= 0 || total === 0) return 0;
  if (done >= total) return 5;
  return Math.max(1, Math.min(4, Math.round((done * 5) / total)));
}

export function demoMood(done: number, total: number): Mood {
  return done >= total ? 'celebrating' : 'organizing';
}

export function demoMessage(done: number, total: number): string {
  if (done >= total) return '¡Día completo! Así me verás cada día.';
  if (done > 0) return '¡Mira cómo me pinto!';
  return 'Toca una tarea para empezar.';
}

export function isNameValid(name: string): boolean {
  return name.trim().length > 0;
}

export function nameGreeting(name: string): string {
  const trimmed = name.trim();
  return trimmed ? `Mucho gusto, ${trimmed}.` : 'Puedes cambiarlo después en Ajustes.';
}
