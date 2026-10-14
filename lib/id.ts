let counter = 0;

/** Id simple y suficiente para datos locales (sin colisión dentro de una sesión de la app). */
export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}
