import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { colors, space, type, motion } from '../theme/tokens';
import { VoiceWaveform } from './VoiceWaveform';
import { PoliMascot } from './PoliMascot';
import { useReducedMotion } from '../hooks/useReducedMotion';

const HALO_SIZE = 220;

function Halo({ delay }: { delay: number }) {
  const scale = useSharedValue<number>(motion.ring.from);
  const opacity = useSharedValue<number>(0.5);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(motion.ring.to, { duration: motion.ring.duration, easing: Easing.out(Easing.ease) }), -1)
    );
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, { duration: motion.ring.duration, easing: Easing.out(Easing.ease) }), -1)
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [delay]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.halo, style]} />;
}

interface VoiceRecorderProps {
  transcript: string;
}

export function VoiceRecorder({ transcript }: VoiceRecorderProps) {
  const reducedMotion = useReducedMotion();
  return (
    <View style={styles.container}>
      <View style={styles.mascotWrap}>
        {reducedMotion ? (
          <View style={styles.haloStatic} />
        ) : (
          <>
            <Halo delay={0} />
            <Halo delay={motion.ring.stagger} />
          </>
        )}
        <PoliMascot mood="listening" size={HALO_SIZE} />
      </View>
      <VoiceWaveform transcript={transcript} />
      <Text style={styles.transcript}>{transcript || '…'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: space[5], width: '100%' },
  mascotWrap: { width: HALO_SIZE, height: HALO_SIZE, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.brand[500],
  },
  haloStatic: {
    position: 'absolute',
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.brand[500],
    opacity: 0.3,
  },
  transcript: { ...type.voice, color: colors.ink[1], textAlign: 'center' },
});
