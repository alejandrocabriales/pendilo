import type { Settings } from '../../types/domain';
import { readJSON, writeJSON, StorageKeys } from '../storage';
import { seedUserName } from '../mocks/seed';

function defaults(): Settings {
  return { plan: 'free', name: seedUserName, saludoOn: true, saludoHora: '08:30', renewsAt: null };
}

export const settingsRepository = {
  async load(): Promise<Settings> {
    const stored = await readJSON<Settings>(StorageKeys.settings);
    return stored ?? defaults();
  },

  async save(settings: Settings): Promise<void> {
    await writeJSON(StorageKeys.settings, settings);
  },

  async reset(): Promise<void> {
    await writeJSON(StorageKeys.settings, defaults());
  },
};
