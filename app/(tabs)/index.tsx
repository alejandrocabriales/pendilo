import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, size, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { PendiloMascot } from '../../components/PendiloMascot';
import { TaskCard } from '../../components/TaskCard';
import { DayCompleteCard } from '../../components/DayCompleteCard';
import { WeekSummaryCard } from '../../components/WeekSummaryCard';
import { IdeaPromptCard } from '../../components/IdeaPromptCard';
import { ShortcutChips } from '../../components/ShortcutChips';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { QuickAddSheet } from '../../components/QuickAddSheet';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { ChevronDownIcon, MicIcon } from '../../components/icons';
import { todayISO, addDays } from '../../lib/date';
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
  const quickAddOpen = useAppStore((s) => s.quickAddOpen);
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

  const tomorrow = useMemo(() => addDays(today, 1), [today]);
  const tomorrowCount = useMemo(
    () => tasks.filter((t) => t.date === tomorrow && t.status === 'pending').length,
    [tasks, tomorrow]
  );

  const headerMessage =
    todaysTasks.length === 0 ? copy.header.empty : allDone ? copy.header.allDone : pendingHeader(pending.length);

  const mascotMood = allDone ? 'celebrating' : 'resting';

  const showPendingHeader = todaysTasks.length > 0 && !allDone;

  function goToEscribir(prefix?: string) {
    router.push(prefix ? { pathname: '/(voz)/escribir', params: { prefix } } : '/(voz)/escribir');
  }

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
        <Text style={styles.completedToggleLabel}>Completadas · {done.length}</Text>
        <View style={completedRevealed ? styles.completedChevronOpen : null}>
          <ChevronDownIcon size={16} color={colors.brand[700]} />
        </View>
      </Pressable>
    ) : null;

  const devButton = __DEV__ ? (
    <Pressable onPress={devRestoreMockData} style={styles.devButton}>
      <Text style={styles.devButtonLabel}>Restaurar datos de ejemplo (dev)</Text>
    </Pressable>
  ) : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4] }]}>
      <View style={styles.header}>
        {allDone ? null : <PendiloMascot mood={mascotMood} size={64} />}
        <View style={styles.headerText}>
          <Text style={styles.greeting}>{copy.greeting.replace('Manu', seedUserName)}</Text>
          <Text style={styles.message} accessibilityLiveRegion="polite">
            {headerMessage}
          </Text>
        </View>
      </View>

      {showPendingHeader ? (
        <View style={styles.progressBlock}>
          <ProgressIndicator
            segments={todaysTasks.length}
            done={done.length}
            accessibilityLabel={`${done.length} de ${todaysTasks.length} tareas completadas`}
          />
          <Text style={styles.statsCount}>{`${done.length} de ${todaysTasks.length} hechas`}</Text>
        </View>
      ) : null}

      {todaysTasks.length === 0 ? (
        <ScrollView style={styles.listFlex} contentContainerStyle={styles.emptyContent}>
          <EmptyState mood="resting" title="Cuéntame qué tienes hoy" body={copy.empty.today} />
          <Button
            label="Hablar con Pendilo"
            onPress={() => router.push('/(voz)/escuchando')}
            icon={<MicIcon size={18} color={colors.action.fg} />}
          />
          <Pressable onPress={() => goToEscribir()} accessibilityRole="button" style={styles.writeLink}>
            <Text style={styles.writeLinkLabel}>o escribir en su lugar</Text>
          </Pressable>
          <ShortcutChips onSelect={goToEscribir} />
          {devButton}
        </ScrollView>
      ) : allDone ? (
        <ScrollView style={styles.listFlex} contentContainerStyle={styles.doneContent}>
          <DayCompleteCard done={done.length} total={todaysTasks.length} />
          <WeekSummaryCard tasks={tasks} todayIso={today} />
          <IdeaPromptCard onAddIdea={addQuickTask} tomorrowCount={tomorrowCount} />
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

      <QuickAddSheet
        visible={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={addQuickTask}
        onMic={() => router.push('/(voz)/escuchando')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  header: { flexDirection: 'row', alignItems: 'center', gap: space[4], marginBottom: space[5] },
  headerText: { flex: 1, gap: space[1] },
  greeting: { ...type.title, color: colors.ink[1] },
  message: { ...type.body, color: colors.ink[2] },
  progressBlock: { gap: space[3], marginBottom: space[5] },
  statsCount: { ...type.section, color: colors.ink[1] },
  listFlex: { flex: 1 },
  list: { paddingBottom: space[12] + size.mic, gap: space[3] },
  doneContent: { paddingBottom: space[12] + size.mic, paddingTop: space[2], gap: space[3] },
  emptyContent: { paddingBottom: space[12] + size.mic, paddingTop: space[2], gap: space[4] },
  writeLink: { alignSelf: 'center', paddingVertical: space[1] },
  writeLinkLabel: { ...type.bodySm, color: colors.brand[700] },
  completedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    alignSelf: 'center',
    paddingVertical: space[2],
  },
  completedToggleLabel: { ...type.card, color: colors.ink[1] },
  completedChevronOpen: { transform: [{ rotate: '180deg' }] },
  addMoreLink: { alignSelf: 'center', paddingVertical: space[3] },
  addMoreLinkLabel: { ...type.card, color: colors.brand[700] },
  cardWrap: { marginBottom: space[3] },
  devButton: { paddingVertical: space[3], alignItems: 'center', marginBottom: size.mic },
  devButtonLabel: { ...type.caption, color: colors.ink[4] },
});
