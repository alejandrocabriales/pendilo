import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, space, type } from '../theme/tokens';
import { VoiceWaveform } from './VoiceWaveform';
import { PendiloMascot } from './PendiloMascot';

interface VoiceRecorderProps {
  transcript: string;
}

export function VoiceRecorder({ transcript }: VoiceRecorderProps) {
  return (
    <View style={styles.container}>
      <PendiloMascot mood="listening" size={110} />
      <VoiceWaveform />
      <Text style={styles.transcript}>{transcript || '…'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: space[5], width: '100%' },
  transcript: { ...type.voice, color: colors.ink[1], textAlign: 'center' },
});
