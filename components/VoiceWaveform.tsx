import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { colors, motion } from '../theme/tokens';
import { useReducedMotion } from '../hooks/useReducedMotion';

const BAR_COUNT = 28;

function Bar({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  const scaleY = useSharedValue(reducedMotion ? 0.5 : motion.wave.min);

  useEffect(() => {
    if (reducedMotion) {
      scaleY.value = 0.35 + ((index % 5) / 5) * 0.4;
      return;
    }
    const duration = motion.wave.duration + (index % 7) * 40;
    scaleY.value = withDelay(
      (index % 10) * 60,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(motion.wave.min, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      )
    );
    return () => cancelAnimation(scaleY);
  }, [reducedMotion]);

  const style = useAnimatedStyle(() => ({ transform: [{ scaleY: scaleY.value }] }));

  return <Animated.View style={[styles.bar, style]} />;
}

interface VoiceWaveformProps {
  /** Transcript revelado hasta el momento; cada palabra nueva da un pulso de energía a las barras. */
  transcript: string;
}

/** 28 barras; estáticas con posiciones fijas si "reducir movimiento" está activo. Pulsan al ritmo de cada palabra revelada. */
export function VoiceWaveform({ transcript }: VoiceWaveformProps) {
  const reducedMotion = useReducedMotion();
  const wordCount = transcript ? transcript.split(' ').length : 0;
  const energy = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion || wordCount === 0) return;
    energy.value = withSequence(
      withTiming(1.12, { duration: 90, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 260, easing: Easing.inOut(Easing.ease) })
    );
  }, [wordCount, reducedMotion]);

  useEffect(() => () => cancelAnimation(energy), []);

  const rowStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: reducedMotion ? 1 : energy.value }] }));

  return (
    <Animated.View style={[styles.row, rowStyle]} accessibilityElementsHidden importantForAccessibility="no">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <Bar key={i} index={i} reducedMotion={reducedMotion} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 40 },
  bar: { width: 5, height: 40, borderRadius: 3, backgroundColor: colors.brand[500] },
});
