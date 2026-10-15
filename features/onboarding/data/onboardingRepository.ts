import { readJSON, writeJSON, StorageKeys } from '../../../data/storage';

interface StoredOnboarding {
  completed: boolean;
  name: string;
}

async function load(): Promise<StoredOnboarding> {
  const stored = await readJSON<StoredOnboarding>(StorageKeys.onboarding);
  return stored ?? { completed: false, name: '' };
}

export const onboardingRepository = {
  async isCompleted(): Promise<boolean> {
    const { completed } = await load();
    return completed;
  },

  async complete(name: string): Promise<void> {
    await writeJSON<StoredOnboarding>(StorageKeys.onboarding, { completed: true, name });
  },
};
