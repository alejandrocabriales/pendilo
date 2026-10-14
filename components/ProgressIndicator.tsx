import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, size, type } from '../theme/tokens';

interface ProgressIndicatorProps {
  segments: number;
  done: number;
  variant?: 'day' | 'goal';
  /** Texto numérico, visible debajo de la barra (sección 8 del handoff: nunca comunicar solo con color). */
  label?: string;
  /** Usar cuando el conteo ya se muestra aparte y la barra no necesita su propio texto. */
  accessibilityLabel?: string;
}

export function ProgressIndicator({ segments, done, variant = 'day', label, accessibilityLabel }: ProgressIndicatorProps) {
  const barHeight = variant === 'goal' ? size.progressBig : size.progress;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: segments, now: done }}
      accessibilityLabel={accessibilityLabel ?? label ?? `${done} de ${segments}`}
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
      {label ? <Text style={styles.label}>{label}</Text> : null}
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
