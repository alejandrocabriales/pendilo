import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withDelay, Easing } from 'react-native-reanimated';
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
  }, [reducedMotion]);

  const style = useAnimatedStyle(() => ({ transform: [{ scaleY: scaleY.value }] }));

  return <Animated.View style={[styles.bar, style]} />;
}

/** 28 barras; estáticas con posiciones fijas si "reducir movimiento" está activo. */
export function VoiceWaveform() {
  const reducedMotion = useReducedMotion();
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <Bar key={i} index={i} reducedMotion={reducedMotion} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 40 },
  bar: { width: 5, height: 40, borderRadius: 3, backgroundColor: colors.brand[500] },
});
