import { create } from 'zustand';
import type { OnboardingDemoTask } from '../domain/types';
import { toggleDemoTask as toggleDemoTaskUseCase } from '../domain/useCases';
import { onboardingRepository } from '../data/onboardingRepository';

const INITIAL_DEMO_TASKS: OnboardingDemoTask[] = [
  { id: 0, title: 'Pagar la luz', done: false },
  { id: 1, title: 'Llamar al dentista', done: false },
  { id: 2, title: 'Sacar la basura', done: false },
];

interface OnboardingUIState {
  name: string;
  demoTasks: OnboardingDemoTask[];
  setName: (name: string) => void;
  toggleDemoTask: (id: number) => void;
  /** Persiste el nombre y marca el onboarding como completado (último paso). */
  finish: () => Promise<void>;
}

export const useOnboarding = create<OnboardingUIState>((set, get) => ({
  name: '',
  demoTasks: INITIAL_DEMO_TASKS,

  setName: (name) => set({ name }),

  toggleDemoTask: (id) => set((s) => ({ demoTasks: toggleDemoTaskUseCase(s.demoTasks, id) })),

  finish: async () => {
    await onboardingRepository.complete(get().name.trim());
  },
}));
