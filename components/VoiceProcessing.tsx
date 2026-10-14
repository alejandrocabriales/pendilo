import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { colors, radius, space, type, motion } from '../theme/tokens';
import { PendiloMascot } from './PendiloMascot';
import { useReducedMotion } from '../hooks/useReducedMotion';

function SkeletonCard() {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 0.7;
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

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.skeleton, style]} />;
}

export function VoiceProcessing({ text }: { text: string }) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <PendiloMascot mood="thinking" size={96} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.skeletons}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: space[5], paddingTop: space[12] },
  text: { ...type.voice, color: colors.ink[1], textAlign: 'center' },
  skeletons: { width: '100%', gap: space[3] },
  skeleton: { height: 64, borderRadius: radius.card, backgroundColor: colors.panel },
});
