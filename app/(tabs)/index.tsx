import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, radius, size, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { PendiloMascot } from '../../components/PendiloMascot';
import { TaskCard } from '../../components/TaskCard';
import { DayDoneCard } from '../../components/DayDoneCard';
import { EmptyState } from '../../components/EmptyState';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { todayISO, addDays } from '../../lib/date';
import { computeDailyStreak } from '../../lib/streak';
import { copy, pendingHeader } from '../../data/copy';
import { seedUserName } from '../../data/mocks/seed';
import type { Task } from '../../types/domain';

export default function HoyScreen() {
  const insets = useSafeAreaInsets();
  const tasks = useAppStore((s) => s.tasks);
  const toggleTaskDone = useAppStore((s) => s.toggleTaskDone);
  const postponeTask = useAppStore((s) => s.postponeTask);
  const rescheduleTask = useAppStore((s) => s.rescheduleTask);
  const clearIsNew = useAppStore((s) => s.clearIsNew);
  const devRestoreMockData = useAppStore((s) => s.devRestoreMockData);
  const addQuickTask = useAppStore((s) => s.addQuickTask);
  const setQuickAddOpen = useAppStore((s) => s.setQuickAddOpen);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedRevealed, setCompletedRevealed] = useState(false);

  const today = todayISO();

  const todaysTasks = useMemo(() => tasks.filter((t) => t.date === today), [tasks, today]);
  const done = todaysTasks.filter((t) => t.status === 'done');
  const pending = useMemo(
    () =>
      todaysTasks
        .filter((t) => t.status === 'pending')
        .sort((a, b) => (a.minutes ?? Infinity) - (b.minutes ?? Infinity)),
    [todaysTasks]
  );
  const allDone = todaysTasks.length > 0 && pending.length === 0;

  const streakDays = useMemo(() => computeDailyStreak(tasks, today).current, [tasks, today]);
  const tomorrow = useMemo(() => addDays(today, 1), [today]);
  const tomorrowCount = useMemo(
    () => tasks.filter((t) => t.date === tomorrow && t.status === 'pending').length,
    [tasks, tomorrow]
  );

  const headerMessage =
    todaysTasks.length === 0 ? copy.header.empty : allDone ? copy.header.allDone : pendingHeader(pending.length);

  const mascotMood = allDone ? 'celebrating' : 'resting';

  const showPendingHeader = todaysTasks.length > 0 && !allDone;
  const streakMessage =
    streakDays > 0
      ? `Racha de ${streakDays} día${streakDays === 1 ? '' : 's'}: haz una y la mantienes.`
      : 'Completa una tarea hoy para empezar tu racha.';

  const renderTaskCard = (item: Task) => (
    <View key={item.id} style={styles.cardWrap}>
      <TaskCard
        task={item}
        expanded={expandedId === item.id}
        isOverdue={false}
        isNext={pending[0]?.id === item.id}
        nowDate={today}
        onToggleExpand={() => {
          setExpandedId((id) => (id === item.id ? null : item.id));
          if (item.isNew) clearIsNew(item.id);
        }}
        onToggleDone={() => toggleTaskDone(item.id)}
        onPostpone={() => postponeTask(item.id)}
        onChangeDate={(date) => rescheduleTask(item.id, date, item.minutes)}
        onChangeMinutes={(minutes) => rescheduleTask(item.id, item.date, minutes)}
      />
    </View>
  );

  const completedToggle =
    done.length > 0 ? (
      <Pressable
        onPress={() => setCompletedRevealed((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: completedRevealed }}
        style={styles.completedToggle}
      >
        <Text style={styles.completedToggleLabel}>
          {completedRevealed ? 'Ocultar' : 'Ver'} completadas ({done.length})
        </Text>
      </Pressable>
    ) : null;

  const devButton = __DEV__ ? (
    <Pressable onPress={devRestoreMockData} style={styles.devButton}>
      <Text style={styles.devButtonLabel}>Restaurar datos de ejemplo (dev)</Text>
    </Pressable>
  ) : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4] }]}>
      {showPendingHeader ? (
        <View style={styles.headerCentered}>
          <Text style={styles.greetingCentered}>{copy.greeting.replace('Manu', seedUserName)}</Text>
          <Text style={styles.messageCentered} accessibilityLiveRegion="polite">
            {headerMessage}
          </Text>
        </View>
      ) : (
        <View style={styles.header}>
          <PendiloMascot mood={mascotMood} size={64} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{copy.greeting.replace('Manu', seedUserName)}</Text>
            <Text style={styles.message} accessibilityLiveRegion="polite">
              {headerMessage}
            </Text>
          </View>
        </View>
      )}

      {showPendingHeader ? (
        <View style={styles.progressBlock}>
          <ProgressIndicator
            segments={todaysTasks.length}
            done={done.length}
            accessibilityLabel={`${done.length} de ${todaysTasks.length} tareas completadas`}
          />
          <View style={styles.statsRow}>
            <Text style={styles.statsCount}>{`${done.length} de ${todaysTasks.length}\nhechas`}</Text>
            <Text style={styles.statsStreak}>{streakMessage}</Text>
          </View>
        </View>
      ) : null}

      {todaysTasks.length === 0 ? (
        <>
          <EmptyState mood="resting" title="Tu día está libre" body={copy.empty.today} />
          <View style={styles.hintCard}>
            <Text style={styles.hintLabel}>Prueba decir</Text>
            <Text style={styles.hintBody}>{copy.empty.todayExample}</Text>
          </View>
          {devButton}
        </>
      ) : allDone ? (
        <ScrollView style={styles.listFlex} contentContainerStyle={styles.doneContent}>
          <DayDoneCard
            onMic={() => router.push('/(voz)/escuchando')}
            onOpenWrite={() => setQuickAddOpen(true)}
            onAddIdea={addQuickTask}
            streakDays={streakDays}
            tomorrowCount={tomorrowCount}
          />
          {completedToggle}
          {completedRevealed ? done.map(renderTaskCard) : null}
          {devButton}
        </ScrollView>
      ) : (
        <FlatList
          style={styles.listFlex}
          data={pending}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => renderTaskCard(item)}
          ListFooterComponent={
            <>
              <Pressable
                onPress={() => setQuickAddOpen(true)}
                accessibilityRole="button"
                style={styles.addMoreLink}
              >
                <Text style={styles.addMoreLinkLabel}>+ Agregar algo más</Text>
              </Pressable>
              {completedToggle}
              {completedRevealed ? done.map(renderTaskCard) : null}
              {devButton}
            </>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  header: { flexDirection: 'row', alignItems: 'center', gap: space[4], marginBottom: space[5] },
  headerText: { flex: 1, gap: space[1] },
  greeting: { ...type.title, color: colors.ink[1] },
  message: { ...type.body, color: colors.ink[2] },
  headerCentered: { alignItems: 'center', gap: space[1], marginBottom: space[5] },
  greetingCentered: { ...type.titleLg, color: colors.ink[1], textAlign: 'center' },
  messageCentered: { ...type.body, color: colors.ink[2], textAlign: 'center' },
  progressBlock: { gap: space[3], marginBottom: space[5] },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space[4] },
  statsCount: { ...type.section, color: colors.ink[1] },
  statsStreak: { ...type.bodySm, color: colors.ink[3], textAlign: 'right', flexShrink: 1 },
  listFlex: { flex: 1 },
  list: { paddingBottom: space[12] + size.mic, gap: space[3] },
  doneContent: { paddingBottom: space[12] + size.mic, paddingTop: space[2], gap: space[3] },
  completedToggle: { alignSelf: 'center', paddingVertical: space[2] },
  completedToggleLabel: { ...type.caption, color: colors.brand[700] },
  addMoreLink: { alignSelf: 'center', paddingVertical: space[3] },
  addMoreLinkLabel: { ...type.card, color: colors.brand[700] },
  hintCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.suggest.fg,
    backgroundColor: colors.suggest.bg,
    borderRadius: radius.card,
    padding: space[4],
    gap: space[1],
    marginTop: space[4],
  },
  hintLabel: { ...type.caption, color: colors.suggest.fg },
  hintBody: { ...type.body, color: colors.ink[1] },
  cardWrap: { marginBottom: space[3] },
  devButton: { paddingVertical: space[3], alignItems: 'center', marginBottom: size.mic },
  devButtonLabel: { ...type.caption, color: colors.ink[4] },
});
