import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { colors, space, type, radius, motion, shadow } from '../theme/tokens';
import { useReducedMotion } from '../hooks/useReducedMotion';

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

interface RecordingBadgeProps {
  elapsedSec: number;
}

/** Píldora flotante "● Grabando · MM:SS" que va junto al botón de cerrar. */
export function RecordingBadge({ elapsedSec }: RecordingBadgeProps) {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 1;
      return;
    }
    opacity.value = withRepeat(
      withSequence(
        withTiming(motion.pulse.min, { duration: motion.pulse.duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: motion.pulse.duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, [reducedMotion]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const mm = Math.floor(elapsedSec / 60);
  const ss = elapsedSec % 60;

  return (
    <View style={styles.badge} accessibilityLiveRegion="polite">
      <Animated.View style={[styles.dot, dotStyle]} />
      <Text style={styles.label}>
        Grabando · {pad2(mm)}:{pad2(ss)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    ...shadow.nav,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger.fg },
  label: { ...type.bodySm, color: colors.ink[1], fontFamily: type.card.fontFamily },
});
