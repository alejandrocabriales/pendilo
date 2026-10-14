// Modelo de datos de producción (Fase 1 — mocks + persistencia local).
//
// Ajustes respecto de la propuesta de plan.md y del handoff design/types.ts:
// - Task: `day`(DayKey) + `minutes` se reemplaza por `date` (ISO 'YYYY-MM-DD') + `minutes`
//   (minutos desde las 00:00 locales). Se mantiene `minutes` separado de la fecha porque
//   el diseño necesita "sin hora definida" (minutes: null) de forma independiente de la fecha.
// - Task.status reemplaza al booleano `done` (según plan.md), con 'overdue' calculado
//   (no almacenado) a partir de date + minutes + ahora, nunca persistido.
// - Goal.status de plan.md se mantiene como función derivada `isGoalComplete()` en
//   data/goalRepository.ts en vez de campo persistido, para evitar que quede desincronizado
//   de value/target.
// - ParsedItem (plan.md) se modela como el `ReviewItem` discriminado del handoff: necesita
//   procedencia (`said|suggested|unresolved`) POR CAMPO, no una sola procedencia por ítem.

export type Mood = 'listening' | 'thinking' | 'organizing' | 'celebrating' | 'resting';

export type Provenance = 'said' | 'suggested' | 'unresolved';

export type TaskStatus = 'pending' | 'done';

export interface Task {
  id: string;
  title: string;
  /** Fecha ISO local, 'YYYY-MM-DD'. */
  date: string;
  /** Minutos desde las 00:00 locales (930 = 15:30). `null` = sin hora definida. */
  minutes: number | null;
  durationMin: number;
  status: TaskStatus;
  /** Recién creada por voz; se limpia al tocar o completar. */
  isNew: boolean;
  source: 'voice' | 'manual';
  createdAt: string;
  updatedAt: string;
}

export type GoalKind = 'count' | 'percent' | 'hours';

export interface Goal {
  id: string;
  kind: GoalKind;
  title: string;
  /** count: sesiones; percent: 0–100; hours: horas (pasos de 0,5). */
  value: number;
  target: number;
  unit: string;
  period: 'week';
  createdAt: string;
  updatedAt: string;
}

export type ReviewItem =
  | {
      id: string;
      type: 'task';
      title: string;
      date: string | null;
      minutes: number | null;
      durationMin: number;
      provenance: { date: Provenance; minutes: Provenance; durationMin: Provenance };
      editing: boolean;
    }
  | {
      id: string;
      type: 'goal';
      title: string;
      target: number;
      provenance: { target: Provenance };
      editing: boolean;
    }
  | { id: string; type: 'unclear'; quote: string; fix: string };

export type VoiceStage = 'idle' | 'recording' | 'processing' | 'review' | 'done' | 'error';
export type VoiceErrorKind = 'silence' | 'perm' | 'offline' | 'transcribe';

export interface VoiceSession {
  id: string;
  stage: VoiceStage;
  transcript: string;
  elapsedSec: number;
  error?: VoiceErrorKind;
  review: ReviewItem[];
}

export interface Celebration {
  title: string;
  body: string;
}
