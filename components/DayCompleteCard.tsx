import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import { PoliMascot } from './PoliMascot';
import { copy, dayCompleteStats } from '../data/copy';

interface DayCompleteCardProps {
  done: number;
  total: number;
}

/** Hero de "no queda nada pendiente hoy": mascota celebrando + resumen del día. */
export function DayCompleteCard({ done, total }: DayCompleteCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.sparkle, styles.sparkleTopLeft]}>✦</Text>
      <Text style={[styles.sparkle, styles.sparkleTopRight]}>✧</Text>
      <Text style={[styles.sparkle, styles.sparkleBottomLeft]}>✧</Text>
      <PoliMascot mood="celebrating" size={180} />
      <Text style={styles.title}>{copy.celebration.dayCard.title}</Text>
      <Text style={styles.stats}>{dayCompleteStats(done, total)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.panel,
    paddingVertical: space[8],
    paddingHorizontal: space[6],
    alignItems: 'center',
    gap: space[2],
    overflow: 'hidden',
  },
  sparkle: { position: 'absolute', fontSize: 18, color: colors.brand[500] },
  sparkleTopLeft: { top: space[5], left: space[6] },
  sparkleTopRight: { top: space[6], right: space[5] },
  sparkleBottomLeft: { bottom: space[8], left: space[5] },
  title: { ...type.title, color: colors.ink[1], marginTop: space[2] },
  stats: { ...type.bodySm, color: colors.ink[2] },
});
