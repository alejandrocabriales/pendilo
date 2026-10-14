import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { colors, space, type, motion } from '../theme/tokens';
import { VoiceWaveform } from './VoiceWaveform';
import { useReducedMotion } from '../hooks/useReducedMotion';

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

interface VoiceRecorderProps {
  elapsedSec: number;
  transcript: string;
}

export function VoiceRecorder({ elapsedSec, transcript }: VoiceRecorderProps) {
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
    <View style={styles.container}>
      <View style={styles.statusRow} accessibilityLiveRegion="polite">
        <Animated.View style={[styles.dot, dotStyle]} />
        <Text style={styles.status}>
          Grabando · {pad2(mm)}:{pad2(ss)}
        </Text>
      </View>
      <VoiceWaveform />
      <Text style={styles.transcript}>{transcript || '…'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: space[5], width: '100%' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger.fg },
  status: { ...type.bodySm, color: colors.ink[2] },
  transcript: { ...type.voice, color: colors.ink[1], textAlign: 'center' },
});
