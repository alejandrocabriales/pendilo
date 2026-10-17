import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from '../theme/tokens';

/**
 * Mantiene una tarea recién marcada como hecha en su lista de origen un momento antes de que
 * se repliegue a "completadas" — para que se vea el check antes del colapso, no un salto
 * instantáneo (fase 5, docs/research/mobile-experience-benchmark.md, "Quiet task completion").
 */
export function useLingeringCompletion(durationMs: number = motion.completeHold.duration) {
  const [heldIds, setHeldIds] = useState<ReadonlySet<string>>(() => new Set());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach(clearTimeout);
      map.clear();
    };
  }, []);

  const release = useCallback((id: string) => {
    const existing = timers.current.get(id);
    if (existing) {
      clearTimeout(existing);
      timers.current.delete(id);
    }
    setHeldIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const hold = useCallback(
    (id: string) => {
      setHeldIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
      const existing = timers.current.get(id);
      if (existing) clearTimeout(existing);
      timers.current.set(
        id,
        setTimeout(() => {
          timers.current.delete(id);
          setHeldIds((prev) => {
            if (!prev.has(id)) return prev;
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, durationMs)
      );
    },
    [durationMs]
  );

  return { heldIds, hold, release };
}
