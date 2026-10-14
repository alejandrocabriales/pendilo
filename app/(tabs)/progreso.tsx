import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, size, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { GoalCard } from '../../components/GoalCard';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { MojoneraCard } from '../../components/MojoneraCard';
import { EmptyState } from '../../components/EmptyState';
import { startOfWeek, weekDates, todayISO } from '../../lib/date';
import { copy } from '../../data/copy';

export default function ProgresoScreen() {
  const insets = useSafeAreaInsets();
  const tasks = useAppStore((s) => s.tasks);
  const goals = useAppStore((s) => s.goals);
  const changeGoalProgress = useAppStore((s) => s.changeGoalProgress);

  const monday = startOfWeek(todayISO());
  const weekDays = useMemo(() => new Set(weekDates(monday)), [monday]);
  const weekTasks = tasks.filter((t) => weekDays.has(t.date));
  const weekDone = weekTasks.filter((t) => t.status === 'done');

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4] }]}>
      <Text style={styles.title}>Progreso</Text>

      {weekTasks.length > 0 ? (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Completaste {weekDone.length} de {weekTasks.length} tareas esta semana
          </Text>
          <ProgressIndicator
            segments={weekTasks.length}
            done={weekDone.length}
            label={`${weekDone.length} de ${weekTasks.length}`}
          />
        </View>
      ) : null}

      <View style={styles.mojoneraWrap}>
        <MojoneraCard tasks={tasks} />
      </View>

      {goals.length === 0 ? (
        <EmptyState mood="resting" title="Todavía no hay objetivos" body={copy.empty.goals} />
      ) : (
        <FlatList
          style={styles.listFlex}
          data={goals}
          keyExtractor={(g) => g.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <GoalCard goal={item} onChange={(delta) => changeGoalProgress(item.id, delta)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  title: { ...type.title, color: colors.ink[1], marginBottom: space[4] },
  summary: { marginBottom: space[5], gap: space[2] },
  mojoneraWrap: { marginBottom: space[5] },
  summaryText: { ...type.body, color: colors.ink[1] },
  listFlex: { flex: 1 },
  list: { paddingBottom: space[12] + size.mic },
  cardWrap: { marginBottom: space[3] },
});
