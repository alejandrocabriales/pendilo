import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { PoliMascot } from '../../components/PoliMascot';
import { Button } from '../../components/Button';
import { copy } from '../../data/copy';
import { todayISO, addDays } from '../../lib/date';

export default function ListoScreen() {
  const insets = useSafeAreaInsets();
  const review = useAppStore((s) => s.voice.review);
  const acknowledgeVoiceDone = useAppStore((s) => s.acknowledgeVoiceDone);

  const rows = useMemo(() => {
    const today = todayISO();
    const tomorrow = addDays(today, 1);
    const tasks = review.filter((i) => i.type === 'task');
    const todayCount = tasks.filter((t) => t.date === today).length;
    const tomorrowCount = tasks.filter((t) => t.date === tomorrow).length;
    const laterCount = tasks.filter((t) => t.date && t.date !== today && t.date !== tomorrow).length;
    const goalCount = review.filter((i) => i.type === 'goal').length;

    const list: string[] = [];
    if (todayCount > 0) list.push(`${todayCount} ${todayCount === 1 ? 'tarea' : 'tareas'} para hoy`);
    if (tomorrowCount > 0) list.push(`${tomorrowCount} ${tomorrowCount === 1 ? 'tarea' : 'tareas'} para mañana`);
    if (laterCount > 0) list.push(`${laterCount} ${laterCount === 1 ? 'tarea' : 'tareas'} más adelante`);
    if (goalCount > 0) list.push(`${goalCount} ${goalCount === 1 ? 'objetivo semanal' : 'objetivos semanales'}`);
    return list;
  }, [review]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <View style={styles.content}>
        <PoliMascot mood="celebrating" size={190} />
        <Text style={styles.title}>{copy.voice.done}</Text>

        {rows.length > 0 ? (
          <View style={styles.card}>
            {rows.map((row) => (
              <View key={row} style={styles.row}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.rowLabel}>{row}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
      <Button
        label="Ver mi día"
        onPress={() => {
          acknowledgeVoiceDone();
          router.replace('/(tabs)');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[6] },
  title: { ...type.voice, color: colors.ink[1], textAlign: 'center' },
  card: { alignSelf: 'stretch', backgroundColor: colors.surface, borderRadius: radius.panel, padding: space[5], gap: space[3] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  check: { ...type.card, color: colors.brand[700] },
  rowLabel: { ...type.body, color: colors.ink[1] },
});
