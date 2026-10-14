import React, { useEffect } from 'react';
import Svg, { Rect, Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import type { Mood } from '../types/domain';
import { colors, motion } from '../theme/tokens';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MoodConfig {
  bottom: { x: number; y: number };
  middle: { x: number; y: number };
  top: { x: number; y: number; rotate: number };
  eyesPath: string;
  eyesStrokeWidth: number;
  mouthPath: string;
  mouthStrokeWidth: number;
}

// Geometría extraída 1:1 de design/assets/mojon-*.svg (lienzo 200×200).
// Las tres piedras nunca cambian de forma, solo de posición y cara (sección 9 del handoff).
const MOODS: Record<Mood, MoodConfig> = {
  listening: {
    bottom: { x: -3, y: 0 },
    middle: { x: 4, y: 0 },
    top: { x: 0, y: 0, rotate: -7 },
    eyesPath: 'M83 108h0.01M117 108h0.01',
    eyesStrokeWidth: 14,
    mouthPath: 'M100 125h0.01',
    mouthStrokeWidth: 8,
  },
  thinking: {
    bottom: { x: 0, y: 0 },
    middle: { x: 5, y: 0 },
    top: { x: 8, y: -1, rotate: 10 },
    eyesPath: 'M87 104h0.01M121 104h0.01',
    eyesStrokeWidth: 12,
    mouthPath: 'M97 124h10',
    mouthStrokeWidth: 7,
  },
  organizing: {
    bottom: { x: 0, y: 0 },
    middle: { x: 0, y: 0 },
    top: { x: 0, y: 0, rotate: 0 },
    eyesPath: 'M83 108h0.01M117 108h0.01',
    eyesStrokeWidth: 12,
    mouthPath: 'M91 123Q100 132 109 123',
    mouthStrokeWidth: 7,
  },
  celebrating: {
    bottom: { x: 0, y: 0 },
    middle: { x: 0, y: -5 },
    top: { x: 0, y: -16, rotate: -12 },
    eyesPath: 'M76 111Q83 100 90 111M110 111Q117 100 124 111',
    eyesStrokeWidth: 8,
    mouthPath: 'M88 121Q100 138 112 121',
    mouthStrokeWidth: 7,
  },
  resting: {
    bottom: { x: 0, y: 0 },
    middle: { x: 3, y: 3 },
    top: { x: 10, y: 8, rotate: 16 },
    eyesPath: 'M76 108Q83 114 90 108M110 108Q117 114 124 108',
    eyesStrokeWidth: 7,
    mouthPath: 'M96 124h8',
    mouthStrokeWidth: 6,
  },
};

export interface PendiloMascotProps {
  mood: Mood;
  size?: number;
  /** Etiqueta accesible; por defecto describe el estado. */
  accessibilityLabel?: string;
}

const MOOD_LABEL: Record<Mood, string> = {
  listening: 'Mojón escuchando',
  thinking: 'Mojón pensando',
  organizing: 'Mojón organizando',
  celebrating: 'Mojón celebrando',
  resting: 'Mojón descansando',
};

/**
 * Nota de implementación: el handoff pide una transición de ≈220 ms al cambiar de piedra
 * a piedra entre estados ("mood change"). Animar sub-transforms de <G> de react-native-svg
 * con Reanimated es fràgil entre versiones; se simplificó a un cambio instantáneo de postura
 * y se priorizó animar bien "bob" (reposo) y "hop" (celebrar), que son las animaciones con
 * especificación numérica más visible del sistema.
 */
export function PendiloMascot({ mood, size = 96, accessibilityLabel }: PendiloMascotProps) {
  const reducedMotion = useReducedMotion();
  const translateY = useSharedValue(0);
  const cfg = MOODS[mood];

  useEffect(() => {
    cancelAnimation(translateY);
    if (reducedMotion) {
      translateY.value = 0;
      return;
    }
    if (mood === 'celebrating') {
      translateY.value = withSequence(
        withTiming(-14, { duration: motion.hop.duration * 0.35, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: motion.hop.duration * 0.25, easing: Easing.out(Easing.ease) }),
        withTiming(-5, { duration: motion.hop.duration * 0.25, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: motion.hop.duration * 0.15, easing: Easing.out(Easing.ease) })
      );
    } else {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-motion.bob.distance, { duration: motion.bob.duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: motion.bob.duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
    }
  }, [mood, reducedMotion]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View
      style={[{ width: size, height: size }, style]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? MOOD_LABEL[mood]}
    >
      <Svg viewBox="0 0 200 200" width={size} height={size}>
        <G transform={`translate(${cfg.bottom.x} ${cfg.bottom.y})`}>
          <Rect x={40} y={132} width={120} height={54} rx={27} fill={colors.brand[700]} />
        </G>
        <G transform={`translate(${cfg.middle.x} ${cfg.middle.y})`}>
          <Rect x={54} y={88} width={92} height={52} rx={26} fill={colors.brand[500]} />
          <Path
            d={cfg.eyesPath}
            stroke={colors.brand.face}
            strokeWidth={cfg.eyesStrokeWidth}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={cfg.mouthPath}
            stroke={colors.brand.face}
            strokeWidth={cfg.mouthStrokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </G>
        <G transform={`translate(${cfg.top.x} ${cfg.top.y}) rotate(${cfg.top.rotate} 100 92)`}>
          <Rect x={76} y={52} width={48} height={42} rx={21} fill={colors.brand[200]} />
        </G>
      </Svg>
    </Animated.View>
  );
}
