import { create } from 'zustand';
import type { Task, Goal, VoiceSession, VoiceErrorKind, Celebration, ReviewItem, Provenance, Settings } from '../types/domain';
import { taskRepository } from '../data/repositories/taskRepository';
import { goalRepository, isGoalComplete, goalStep } from '../data/repositories/goalRepository';
import { settingsRepository } from '../data/repositories/settingsRepository';
import { fullTranscript, voiceTiming, buildDemoReview, buildReviewFromText } from '../data/mocks/voiceService';
import { haptics } from '../lib/haptics';
import { createId } from '../lib/id';
import { todayISO, addDays } from '../lib/date';
import { copy } from '../data/copy';
import { seedUserName } from '../data/mocks/seed';
import { removeKeys, StorageKeys } from '../data/storage';

/** Tareas al día que puede crear un plan gratis antes de que aparezca el paywall de uso. */
export const DAILY_FREE_TASK_LIMIT = 3;

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
  settings: Settings;
  toast: ToastState | null;
  celebration: Celebration | null;
  voice: VoiceSession;
  quickAddOpen: boolean;

  init: () => Promise<void>;
  devRestoreMockData: () => Promise<void>;

  canCreateTaskToday: () => boolean;
  setName: (name: string) => Promise<void>;
  setSaludoOn: (on: boolean) => Promise<void>;
  setSaludoHora: (hora: string) => Promise<void>;
  upgradeToPro: () => Promise<void>;
  restorePurchases: () => void;
  resetAllData: () => Promise<void>;

  setQuickAddOpen: (open: boolean) => void;
  addQuickTask: (title: string) => Promise<void>;
  toggleTaskDone: (id: string) => Promise<void>;
  postponeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
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
  settings: { plan: 'free', name: seedUserName, saludoOn: true, saludoHora: '08:30', renewsAt: null },
  toast: null,
  celebration: null,
  voice: idleVoice,
  quickAddOpen: false,

  init: async () => {
    const [tasks, goals, settings] = await Promise.all([
      taskRepository.list(),
      goalRepository.list(),
      settingsRepository.load(),
    ]);
    set({ tasks, goals, settings, ready: true });
  },

  devRestoreMockData: async () => {
    const [tasks, goals] = await Promise.all([taskRepository.resetToSeed(), goalRepository.resetToSeed()]);
    set({ tasks, goals, toast: null, celebration: null });
  },

  // Fase 1 no tiene tareas por hora específica a futuro ni backend: "hoy" alcanza para decidir
  // si el plan gratis llegó a su límite diario (3 tareas, cualquier estado).
  canCreateTaskToday: () => {
    const { tasks, settings } = get();
    if (settings.plan === 'pro') return true;
    const today = todayISO();
    return tasks.filter((t) => t.date === today).length < DAILY_FREE_TASK_LIMIT;
  },

  setName: async (name) => {
    const next = { ...get().settings, name };
    set({ settings: next });
    await settingsRepository.save(next);
  },

  setSaludoOn: async (on) => {
    const next = { ...get().settings, saludoOn: on };
    set({ settings: next });
    await settingsRepository.save(next);
  },

  setSaludoHora: async (hora) => {
    const next = { ...get().settings, saludoHora: hora };
    set({ settings: next });
    await settingsRepository.save(next);
  },

  // Fase 1 no tiene cobro real (sin RevenueCat/IAP todavía): "pasar a Pro" solo activa la
  // bandera local, igual de espíritu que el resto del demo (voz simulada, sin backend).
  upgradeToPro: async () => {
    const next = { ...get().settings, plan: 'pro' as const, renewsAt: addDays(todayISO(), 30) };
    set({ settings: next, toast: { id: createId('toast'), text: 'Poli Pro activado (prueba de 7 días)' } });
    await settingsRepository.save(next);
  },

  restorePurchases: () => {
    set({ toast: { id: createId('toast'), text: 'No hay compras para restaurar' } });
  },

  // "Reiniciar a Poli": vuelve al estado de primer arranque (mock de semilla, sin onboarding
  // marcado), igual que si se reinstalara la app (ver taskRepository.loadAll()).
  resetAllData: async () => {
    await removeKeys([StorageKeys.onboarding]);
    const [tasks, goals] = await Promise.all([taskRepository.resetToSeed(), goalRepository.resetToSeed()]);
    await settingsRepository.reset();
    const settings = await settingsRepository.load();
    set({ tasks, goals, settings, toast: null, celebration: null });
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
    if (nextDone) haptics.success();

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

  deleteTask: async (id) => {
    const before = get().tasks.find((t) => t.id === id);
    if (!before) return;
    await taskRepository.remove(id);
    haptics.medium();
    set({
      tasks: get().tasks.filter((t) => t.id !== id),
      toast: {
        id: createId('toast'),
        text: `"${before.title}" se eliminó`,
        onUndo: async () => {
          const restored = await taskRepository.restore(before);
          set({ tasks: [...get().tasks, restored], toast: null });
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
    haptics.light();

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
      haptics.warning();
      set({ voice: { ...voice, stage: 'error', error: 'silence' } });
      return;
    }

    haptics.light();
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
    haptics.warning();
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
    haptics.success();
  },

  acknowledgeVoiceDone: () => {
    clearVoiceTimers();
    set({ voice: idleVoice });
  },
}));
