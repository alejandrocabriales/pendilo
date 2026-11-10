import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors, easing, motion } from '../theme/tokens';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Punto medio del rango ya documentado en motion.ring: el anillo "respira" entre un piso calmo
// y el pico (motion.ring.to) en vez de recorrer todo el rango en cada palabra — eso sería entrecortado.
const SPEAKING_BASELINE = (motion.ring.from + motion.ring.to) / 2;

interface BreathingRingProps {
  /** Cantidad de palabras reveladas: única señal de "energía" que existe en este demo (sin audio real, ver voiceService.ts). */
  wordCount: number;
  size: number;
}

/** Anillo que respira en reposo y reacciona a cada palabra mientras Poli "escucha", en vez de un loop ambiental ajeno a lo dicho. */
export function BreathingRing({ wordCount, size }: BreathingRingProps) {
  const reducedMotion = useReducedMotion();
  const speaking = wordCount > 0;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Un solo efecto para los dos estados: reposo (solo opacity respira, motion.pulse, sin escala)
  // y habla (cada palabra nueva = una muestra de "amplitud", pulso hacia motion.ring.to que se
  // asienta de nuevo en el piso calmo, nunca crudo/entrecortado). Todo en un efecto para no
  // escribir los mismos shared values desde efectos separados.
  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      return;
    }
    if (!speaking) {
      cancelAnimation(opacity);
      scale.value = withTiming(1, { duration: motion.reduced.duration, easing: easing.easeOut });
      opacity.value = withRepeat(
        withSequence(
          withTiming(motion.pulse.min, { duration: motion.pulse.duration / 2, easing: easing.easeInOut }),
          withTiming(1, { duration: motion.pulse.duration / 2, easing: easing.easeInOut })
        ),
        -1
      );
      return () => cancelAnimation(opacity);
    }
    cancelAnimation(opacity);
    opacity.value = withTiming(1, { duration: motion.reduced.duration });
    scale.value = withSequence(
      withTiming(motion.ring.to, { duration: 90, easing: easing.easeOut }),
      withTiming(SPEAKING_BASELINE, { duration: 260, easing: easing.easeInOut })
    );
  }, [wordCount, speaking, reducedMotion, scale, opacity]);

  useEffect(
    () => () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    },
    []
  );

  const style = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0.3 : opacity.value,
    transform: [{ scale: reducedMotion ? 1 : scale.value }],
  }));

  return <Animated.View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }, style]} />;
}

const styles = StyleSheet.create({
  ring: { position: 'absolute', borderWidth: 3, borderColor: colors.brand[500] },
});
