import { create } from 'zustand';
import type { Task, Goal, VoiceSession, VoiceErrorKind, Celebration, ReviewItem, Provenance } from '../types/domain';
import { taskRepository } from '../data/repositories/taskRepository';
import { goalRepository, isGoalComplete, goalStep } from '../data/repositories/goalRepository';
import { fullTranscript, voiceTiming, buildDemoReview, buildReviewFromText } from '../data/mocks/voiceService';
import { createId } from '../lib/id';
import { todayISO } from '../lib/date';
import { copy } from '../data/copy';

interface ToastState {
  id: string;
  text: string;
  onUndo?: () => void;
}

const idleVoice: VoiceSession = {
  id: createId('vs'),
  stage: 'idle',
  transcript: '',
  elapsedSec: 0,
  review: [],
};

const demoWords = fullTranscript.split(' ');

interface AppState {
  ready: boolean;
  tasks: Task[];
  goals: Goal[];
  toast: ToastState | null;
  celebration: Celebration | null;
  voice: VoiceSession;
  quickAddOpen: boolean;

  init: () => Promise<void>;
  devRestoreMockData: () => Promise<void>;

  setQuickAddOpen: (open: boolean) => void;
  addQuickTask: (title: string) => Promise<void>;
  toggleTaskDone: (id: string) => Promise<void>;
  postponeTask: (id: string) => Promise<void>;
  rescheduleTask: (id: string, date: string, minutes: number | null) => Promise<void>;
  clearIsNew: (id: string) => Promise<void>;
  dismissToast: () => void;

  changeGoalProgress: (id: string, delta: number) => Promise<void>;

  startVoiceSession: () => void;
  startTextSession: (title: string) => void;
  stopRecording: () => void;
  cancelVoiceSession: () => void;
  devSimulateError: (kind: VoiceErrorKind) => void;
  retryProcessing: () => void;
  restartRecording: () => void;
  editReviewTaskDate: (id: string, date: string) => void;
  editReviewTaskMinutes: (id: string, minutes: number | null) => void;
  editReviewTaskDuration: (id: string, durationMin: number) => void;
  editReviewGoalTarget: (id: string, target: number) => void;
  editUnclearFix: (id: string, fix: string) => void;
  removeReviewItem: (id: string) => void;
  convertUnclearToTask: (id: string) => void;
  canConfirmReview: () => boolean;
  confirmReview: () => Promise<void>;
  acknowledgeVoiceDone: () => void;
}

// Los timers del flujo de voz viven fuera del store (no tiene sentido observarlos),
// pero las acciones que los crean/cancelan sí viven acá para sobrevivir a que
// las pantallas (voz)/* se monten y desmonten al navegar entre escuchando → procesando → revisión.
let revealTimer: ReturnType<typeof setInterval> | null = null;
let elapsedTimer: ReturnType<typeof setInterval> | null = null;
let processingTimer: ReturnType<typeof setTimeout> | null = null;

function clearVoiceTimers() {
  if (revealTimer) clearInterval(revealTimer);
  if (elapsedTimer) clearInterval(elapsedTimer);
  if (processingTimer) clearTimeout(processingTimer);
  revealTimer = null;
  elapsedTimer = null;
  processingTimer = null;
}

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  tasks: [],
  goals: [],
  toast: null,
  celebration: null,
  voice: idleVoice,
  quickAddOpen: false,

  init: async () => {
    const [tasks, goals] = await Promise.all([taskRepository.list(), goalRepository.list()]);
    set({ tasks, goals, ready: true });
  },

  devRestoreMockData: async () => {
    const [tasks, goals] = await Promise.all([taskRepository.resetToSeed(), goalRepository.resetToSeed()]);
    set({ tasks, goals, toast: null, celebration: null });
  },

  dismissToast: () => set({ toast: null }),

  setQuickAddOpen: (open) => set({ quickAddOpen: open }),

  addQuickTask: async (title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const created = await taskRepository.create({
      title: trimmed,
      date: todayISO(),
      minutes: null,
      durationMin: 15,
      source: 'manual',
    });
    set({
      tasks: [...get().tasks, created],
      toast: { id: createId('toast'), text: `"${trimmed}" se agregó a hoy` },
    });
  },

  toggleTaskDone: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const nextDone = task.status !== 'done';
    const updated = await taskRepository.complete(id, nextDone);
    const tasks = get().tasks.map((t) => (t.id === id ? updated : t));
    set({ tasks });

    if (nextDone && task.date === todayISO()) {
      const todaysTasks = tasks.filter((t) => t.date === task.date);
      const stillPending = todaysTasks.some((t) => t.status === 'pending');
      if (!stillPending && todaysTasks.length > 0) {
        set({ celebration: { title: copy.celebration.day.title, body: copy.celebration.day.body } });
      }
    }
  },

  postponeTask: async (id) => {
    const before = get().tasks.find((t) => t.id === id);
    if (!before) return;
    const updated = await taskRepository.postpone(id);
    set({
      tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
      toast: {
        id: createId('toast'),
        text: `"${before.title}" pasó a mañana`,
        onUndo: async () => {
          const reverted = await taskRepository.reschedule(id, { date: before.date, minutes: before.minutes });
          set({ tasks: get().tasks.map((t) => (t.id === id ? reverted : t)), toast: null });
        },
      },
    });
  },

  rescheduleTask: async (id, date, minutes) => {
    const before = get().tasks.find((t) => t.id === id);
    if (!before) return;
    const updated = await taskRepository.reschedule(id, { date, minutes });
    set({
      tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
      toast: {
        id: createId('toast'),
        text: `"${before.title}" se movió`,
        onUndo: async () => {
          const reverted = await taskRepository.reschedule(id, { date: before.date, minutes: before.minutes });
          set({ tasks: get().tasks.map((t) => (t.id === id ? reverted : t)), toast: null });
        },
      },
    });
  },

  clearIsNew: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task || !task.isNew) return;
    const updated = await taskRepository.update(id, { isNew: false });
    set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) });
  },

  changeGoalProgress: async (id, delta) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) return;
    const wasComplete = isGoalComplete(goal);
    const updated = await goalRepository.updateProgress(id, delta);
    set({ goals: get().goals.map((g) => (g.id === id ? updated : g)) });
    if (!wasComplete && isGoalComplete(updated)) {
      set({ celebration: { title: copy.celebration.goal.title, body: updated.title } });
    }
  },

  startVoiceSession: () => {
    clearVoiceTimers();
    set({
      voice: { id: createId('vs'), stage: 'recording', transcript: '', elapsedSec: 0, review: [] },
    });

    let wordIndex = 0;
    revealTimer = setInterval(() => {
      wordIndex += 1;
      if (wordIndex >= demoWords.length) {
        if (revealTimer) clearInterval(revealTimer);
        revealTimer = null;
      }
      set((state) => ({
        voice: { ...state.voice, transcript: demoWords.slice(0, wordIndex).join(' ') },
      }));
    }, voiceTiming.revealIntervalMs);

    elapsedTimer = setInterval(() => {
      set((state) => ({ voice: { ...state.voice, elapsedSec: state.voice.elapsedSec + 1 } }));
    }, 1000);
  },

  startTextSession: (title) => {
    clearVoiceTimers();
    set({
      voice: { id: createId('vs'), stage: 'processing', transcript: title, elapsedSec: 0, review: [] },
    });
    processingTimer = setTimeout(() => {
      set((state) => ({
        voice: { ...state.voice, stage: 'review', review: buildReviewFromText(title) },
      }));
    }, voiceTiming.processingMs);
  },

  stopRecording: () => {
    const { voice } = get();
    const wordsRevealed = voice.transcript.length > 0 ? voice.transcript.split(' ').length : 0;
    if (revealTimer) clearInterval(revealTimer);
    if (elapsedTimer) clearInterval(elapsedTimer);
    revealTimer = null;
    elapsedTimer = null;

    if (wordsRevealed < voiceTiming.minWordsToProcess || voice.elapsedSec < 1) {
      set({ voice: { ...voice, stage: 'error', error: 'silence' } });
      return;
    }

    set({ voice: { ...voice, stage: 'processing' } });
    processingTimer = setTimeout(() => {
      set((state) => ({
        voice: { ...state.voice, stage: 'review', review: buildDemoReview() },
      }));
    }, voiceTiming.processingMs);
  },

  cancelVoiceSession: () => {
    clearVoiceTimers();
    set({ voice: idleVoice });
  },

  // Fase 1 no tiene audio real: estos botones (solo visibles en __DEV__) permiten
  // forzar cada rama de error del diagrama de estados para poder probarla a pedido,
  // en vez de depender del azar.
  devSimulateError: (kind) => {
    clearVoiceTimers();
    set((state) => ({ voice: { ...state.voice, stage: 'error', error: kind } }));
  },

  retryProcessing: () => {
    const { voice } = get();
    set({ voice: { ...voice, stage: 'processing', error: undefined } });
    processingTimer = setTimeout(() => {
      set((state) => ({
        voice: { ...state.voice, stage: 'review', review: buildDemoReview() },
      }));
    }, voiceTiming.processingMs);
  },

  restartRecording: () => {
    get().startVoiceSession();
  },

  editReviewTaskDate: (id, date) => {
    set((state) => ({
      voice: {
        ...state.voice,
        review: state.voice.review.map((item) =>
          item.id === id && item.type === 'task'
            ? { ...item, date, provenance: { ...item.provenance, date: 'said' as Provenance } }
            : item
        ),
      },
    }));
  },

  editReviewTaskMinutes: (id, minutes) => {
    set((state) => ({
      voice: {
        ...state.voice,
        review: state.voice.review.map((item) =>
          item.id === id && item.type === 'task'
            ? { ...item, minutes, provenance: { ...item.provenance, minutes: 'said' as Provenance } }
            : item
        ),
      },
    }));
  },

  editReviewTaskDuration: (id, durationMin) => {
    set((state) => ({
      voice: {
        ...state.voice,
        review: state.voice.review.map((item) =>
          item.id === id && item.type === 'task'
            ? { ...item, durationMin, provenance: { ...item.provenance, durationMin: 'said' as Provenance } }
            : item
        ),
      },
    }));
  },

  editReviewGoalTarget: (id, target) => {
    set((state) => ({
      voice: {
        ...state.voice,
        review: state.voice.review.map((item) =>
          item.id === id && item.type === 'goal' ? { ...item, target, provenance: { target: 'said' as Provenance } } : item
        ),
      },
    }));
  },

  editUnclearFix: (id, fix) => {
    set((state) => ({
      voice: {
        ...state.voice,
        review: state.voice.review.map((item) => (item.id === id && item.type === 'unclear' ? { ...item, fix } : item)),
      },
    }));
  },

  removeReviewItem: (id) => {
    set((state) => ({ voice: { ...state.voice, review: state.voice.review.filter((i) => i.id !== id) } }));
  },

  convertUnclearToTask: (id) => {
    set((state) => ({
      voice: {
        ...state.voice,
        review: state.voice.review.map((item) => {
          if (item.id !== id || item.type !== 'unclear') return item;
          const converted: ReviewItem = {
            id: item.id,
            type: 'task',
            title: item.fix.trim() || item.quote,
            date: null,
            minutes: null,
            durationMin: 15,
            provenance: { date: 'unresolved', minutes: 'suggested', durationMin: 'suggested' },
            editing: false,
          };
          return converted;
        }),
      },
    }));
  },

  canConfirmReview: () => {
    return get().voice.review.every((item) => {
      if (item.type === 'task') return item.provenance.date !== 'unresolved';
      if (item.type === 'unclear') return item.fix.trim().length > 0;
      return true;
    });
  },

  confirmReview: async () => {
    const { review } = get().voice;
    const createdTasks: Task[] = [];
    const createdGoals: Goal[] = [];

    for (const item of review) {
      if (item.type === 'task' && item.date) {
        createdTasks.push(
          await taskRepository.create({
            title: item.title,
            date: item.date,
            minutes: item.minutes,
            durationMin: item.durationMin,
            source: 'voice',
          })
        );
      } else if (item.type === 'goal') {
        createdGoals.push(
          await goalRepository.create({ kind: 'count', title: item.title, target: item.target, unit: 'veces' })
        );
      }
    }

    set((state) => ({
      tasks: [...state.tasks, ...createdTasks],
      goals: [...state.goals, ...createdGoals],
      voice: { ...state.voice, stage: 'done' },
    }));
  },

  acknowledgeVoiceDone: () => {
    clearVoiceTimers();
    set({ voice: idleVoice });
  },
}));
