import AsyncStorage from '@react-native-async-storage/async-storage';

/** Namespacing simple para poder versionar/limpiar sin tocar otras claves de Expo. */
const PREFIX = '@pendilo/';

export const StorageKeys = {
  tasks: `${PREFIX}tasks`,
  goals: `${PREFIX}goals`,
  seeded: `${PREFIX}seeded`,
} as const;

export async function readJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw == null) return null;
  return JSON.parse(raw) as T;
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeKeys(keys: string[]): Promise<void> {
  await AsyncStorage.multiRemove(keys);
}
