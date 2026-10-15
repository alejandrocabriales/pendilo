import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, radius, space, type } from '../theme/tokens';
import { buildWeekDayBars } from '../lib/cycle';
import type { Task } from '../types/domain';

interface WeekSummaryCardProps {
  tasks: Task[];
  todayIso: string;
}

/** "N de M hechas" esta semana, con acceso directo a Esta semana (04). */
export function WeekSummaryCard({ tasks, todayIso }: WeekSummaryCardProps) {
  const bars = buildWeekDayBars(tasks, todayIso);
  const total = bars.length;
  const done = bars.filter((b) => b.status === 'done').length;

  return (
    <Pressable
      onPress={() => router.push('/(tabs)/semana')}
      accessibilityRole="button"
      accessibilityLabel={`${done} de ${total} días con tareas hechas esta semana. Ver mi semana`}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>
          Esta semana: {done} de {total} hechas
        </Text>
        <Text style={styles.link}>Ver mi semana</Text>
      </View>

      <View style={styles.daysRow}>
        {bars.map((day) => {
          const isToday = day.date === todayIso;
          return (
            <View key={day.date} style={styles.dayColumn}>
              <View style={[styles.bar, day.status === 'done' ? styles.barDone : styles.barEmpty, isToday ? styles.barToday : null]} />
              <Text style={styles.dayLetter}>{day.letter}</Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.panel, padding: space[5], gap: space[4] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...type.card, color: colors.ink[1], flex: 1 },
  link: { ...type.caption, color: colors.brand[700] },
  daysRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  dayColumn: { alignItems: 'center', gap: space[1], width: 36 },
  bar: { width: 36, height: 40, borderRadius: radius.chip },
  barDone: { backgroundColor: colors.brand[700] },
  barEmpty: { height: 10, backgroundColor: colors.track },
  barToday: { borderWidth: 2, borderColor: colors.ink[1] },
  dayLetter: { ...type.caption, color: colors.ink[3] },
});
