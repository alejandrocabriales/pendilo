import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, size, type } from '../theme/tokens';

interface ProgressIndicatorProps {
  segments: number;
  done: number;
  variant?: 'day' | 'goal';
  /** Texto numérico, siempre visible (sección 8 del handoff: nunca comunicar solo con color). */
  label: string;
}

export function ProgressIndicator({ segments, done, variant = 'day', label }: ProgressIndicatorProps) {
  const barHeight = variant === 'goal' ? size.progressBig : size.progress;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: segments, now: done }}
      accessibilityLabel={label}
    >
      <View style={[styles.track, { height: barHeight }]}>
        {Array.from({ length: segments }, (_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { height: barHeight },
              i < done ? styles.segmentDone : styles.segmentPending,
              i === 0 ? styles.first : null,
              i === segments - 1 ? styles.last : null,
            ]}
          />
        ))}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', gap: 3, width: '100%' },
  segment: { flex: 1, borderRadius: radius.chip },
  segmentDone: { backgroundColor: colors.action.bg },
  segmentPending: { backgroundColor: colors.track },
  first: {},
  last: {},
  label: { ...type.meta, color: colors.ink[2], marginTop: space[2] },
});
