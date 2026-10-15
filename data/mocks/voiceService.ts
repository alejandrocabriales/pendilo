import mockData from './mock-data.json';
import type { ReviewItem, Provenance } from '../../types/domain';
import { createId } from '../../lib/id';
import { todayISO, addDays } from '../../lib/date';

// Fase 1: no hay audio ni transcripción reales. Esto expone únicamente los datos y tiempos
// de la demo fija de mock-data.json; la orquestación de los timers vive en
// state/useVoiceSession.ts para poder reaccionar a cancelaciones/reintentos.

const demo = mockData.voiceDemo;

export const voiceTiming = {
  revealIntervalMs: demo.revealIntervalMs,
  minWordsToProcess: demo.minWordsToProcess,
  processingMs: demo.processingMs,
};

/** Transcripción completa de la demo, incluida la frase poco clara. */
export const fullTranscript = `${demo.transcript}${demo.unclearVariant.extraTranscript}`;

function resolveDemoDay(day: 'Hoy' | 'Mañana' | null, today: string): string | null {
  if (day === 'Hoy') return today;
  if (day === 'Mañana') return addDays(today, 1);
  return null;
}

/**
 * Construye los ítems de revisión de la demo con fechas resueltas contra "hoy" real
 * y con ids frescos (para poder repetir la simulación sin colisionar con sesiones previas).
 */
export function buildDemoReview(now: Date = new Date()): ReviewItem[] {
  const today = todayISO(now);

  const taskAndGoalItems: ReviewItem[] = demo.review.map((item) => {
    if (item.type === 'task') {
      const provenance = item.provenance as { day: Provenance; minutes: Provenance; durationMin: Provenance };
      return {
        id: createId('r'),
        type: 'task',
        title: item.title,
        date: resolveDemoDay(item.day as 'Hoy' | 'Mañana' | null, today),
        minutes: item.minutes ?? null,
        durationMin: item.durationMin ?? 0,
        provenance: { date: provenance.day, minutes: provenance.minutes, durationMin: provenance.durationMin },
        editing: false,
      };
    }
    return {
      id: createId('r'),
      type: 'goal',
      title: item.title,
      target: item.target!,
      provenance: item.provenance as { target: Provenance },
      editing: false,
    };
  });

  const unclearItem: ReviewItem = {
    id: createId('r'),
    type: 'unclear',
    quote: demo.unclearVariant.item.quote,
    fix: '',
  };

  return [...taskAndGoalItems, unclearItem];
}

/**
 * Fase 1 no tiene NLP real: Escribir (texto) no pasa por el guion fijo de voz,
 * sino que arma un único ítem de revisión a partir del título tal cual se escribió.
 * El día siempre queda "unresolved" porque Escribir no lo pregunta — se resuelve en Revisión.
 */
export function buildReviewFromText(title: string): ReviewItem[] {
  return [
    {
      id: createId('r'),
      type: 'task',
      title,
      date: null,
      minutes: null,
      durationMin: 15,
      provenance: { date: 'unresolved', minutes: 'suggested', durationMin: 'suggested' },
      editing: false,
    },
  ];
}
