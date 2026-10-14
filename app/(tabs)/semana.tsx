import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, size, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { TaskCard } from '../../components/TaskCard';
import { StreakCard } from '../../components/StreakCard';
import { Banner } from '../../components/Banner';
import { EmptyState } from '../../components/EmptyState';
import { addDays, todayISO, isBefore, relativeDayLabel } from '../../lib/date';
import { computeDailyStreak, buildWeekCircles } from '../../lib/streak';
import { copy, overdueBanner } from '../../data/copy';

export default function SemanaScreen() {
  const insets = useSafeAreaInsets();
  const tasks = useAppStore((s) => s.tasks);
  const toggleTaskDone = useAppStore((s) => s.toggleTaskDone);
  const postponeTask = useAppStore((s) => s.postponeTask);
  const rescheduleTask = useAppStore((s) => s.rescheduleTask);

  const today = todayISO();

  const [selected, setSelected] = useState(today);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());

  const { current: currentStreak, record: recordStreak } = computeDailyStreak(tasks, today);
  const circles = buildWeekCircles(tasks, today);
  const todayPending = tasks.filter((t) => t.date === today && t.status === 'pending').length;

  const selectedTasks = tasks
    .filter((t) => t.date === selected)
    .sort((a, b) => (a.minutes ?? 0) - (b.minutes ?? 0));
  const pendingOnSelected = selectedTasks.filter((t) => t.status === 'pending');
  const isPastSelected = isBefore(selected, today);
  const showBanner = isPastSelected && pendingOnSelected.length > 0 && !dismissedBanners.has(selected);

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4] }]}>
      <Text style={styles.title}>Mi semana</Text>

      <StreakCard
        currentStreak={currentStreak}
        recordStreak={recordStreak}
        todayPending={todayPending}
        circles={circles}
        selected={selected}
        onSelectDay={setSelected}
      />

      <Text style={styles.selectedLabel}>{relativeDayLabel(selected, today)}</Text>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={selectedTasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          showBanner ? (
            <View style={styles.banner}>
              <Banner
                text={overdueBanner(pendingOnSelected.length)}
                actions={[
                  {
                    label: 'Pasar a mañana',
                    variant: 'primary',
                    onPress: () => {
                      pendingOnSelected.forEach((t) => rescheduleTask(t.id, addDays(today, 1), t.minutes));
                    },
                  },
                  {
                    label: 'Ahora no',
                    onPress: () => setDismissedBanners((prev) => new Set(prev).add(selected)),
                  },
                ]}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={<EmptyState mood="resting" title="Día libre" body={copy.empty.freeDay} />}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <TaskCard
              task={item}
              expanded={expandedId === item.id}
              isOverdue={isBefore(item.date, today) && item.status === 'pending'}
              nowDate={selected}
              onToggleExpand={() => setExpandedId((id) => (id === item.id ? null : item.id))}
              onToggleDone={() => toggleTaskDone(item.id)}
              onPostpone={() => postponeTask(item.id)}
              onChangeDate={(date) => rescheduleTask(item.id, date, item.minutes)}
              onChangeMinutes={(minutes) => rescheduleTask(item.id, item.date, minutes)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  title: { ...type.title, color: colors.ink[1], marginBottom: space[4] },
  selectedLabel: { ...type.section, color: colors.ink[1], marginTop: space[5], marginBottom: space[2] },
  list: { flex: 1, marginTop: 0 },
  listContent: { paddingBottom: space[12] + size.mic },
  banner: { marginBottom: space[3] },
  cardWrap: { marginBottom: space[3] },
});
