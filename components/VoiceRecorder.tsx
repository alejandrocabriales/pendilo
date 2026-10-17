import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, space, type } from '../theme/tokens';
import { BreathingRing } from './BreathingRing';
import { PoliMascot } from './PoliMascot';

const RING_SIZE = 220;

interface VoiceRecorderProps {
  transcript: string;
}

export function VoiceRecorder({ transcript }: VoiceRecorderProps) {
  const wordCount = transcript ? transcript.split(' ').length : 0;
  return (
    <View style={styles.container}>
      <View style={styles.mascotWrap}>
        <BreathingRing wordCount={wordCount} size={RING_SIZE} />
        <PoliMascot mood="listening" size={RING_SIZE} />
      </View>
      <Text style={styles.transcript}>{transcript || '…'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: space[5], width: '100%' },
  mascotWrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  transcript: { ...type.voice, color: colors.ink[1], textAlign: 'center' },
});
