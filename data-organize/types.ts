// Modelo de datos del prototipo de Pendilo. En producción: fechas ISO en vez de DayKey.

export type DayKey = 'Lun' | 'Mar' | 'Hoy' | 'Mañana' | 'Vie' | 'Sáb' | 'Dom';

export type Mood = 'listening' | 'thinking' | 'organizing' | 'celebrating' | 'resting';

/** Procedencia de un campo detectado por voz. */
export type Provenance = 'said' | 'suggested' | 'unresolved';

export interface Task {
  id: string;
  title: string;
  day: DayKey;              // producción: date (ISO)
  minutes: number | null;   // minutos desde 00:00; 930 = 15:30
  durationMin: number;
  done: boolean;
  isNew: boolean;           // recién creada por voz; se limpia al interactuar
  source: 'voice' | 'manual';
}

export type GoalKind = 'count' | 'percent' | 'hours';

export interface Goal {
  id: string;
  kind: GoalKind;
  title: string;
  value: number;            // count: sesiones; percent: 0–100; hours: horas (pasos de 0,5)
  target: number;
  unit: string;             // 'sesiones' | 'veces' | 'horas' | ''
}

export type ReviewItem =
  | {
      id: string;
      type: 'task';
      title: string;
      day: DayKey | null;
      minutes: number | null;
      durationMin: number;
      provenance: { day: Provenance; minutes: Provenance; durationMin: Provenance };
      editing: boolean;
    }
  | { id: string; type: 'goal'; title: string; target: number; provenance: { target: Provenance }; editing: boolean }
  | { id: string; type: 'unclear'; quote: string; fix: string };

export type VoiceStage = 'idle' | 'recording' | 'processing' | 'review' | 'done' | 'error';
export type VoiceErrorKind = 'silence' | 'perm' | 'offline' | 'transcribe';

export interface VoiceSession {
  stage: VoiceStage;
  transcript: string;       // se conserva ante errores de red o de transcripción
  elapsedSec: number;
  error?: VoiceErrorKind;
  review: ReviewItem[];
}

export interface Celebration {
  title: string;
  body: string;
}
