import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, size, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { PoliMascot } from '../../components/PoliMascot';
import { TaskCard } from '../../components/TaskCard';
import { DayCompleteCard } from '../../components/DayCompleteCard';
import { WeekSummaryCard } from '../../components/WeekSummaryCard';
import { IdeaPromptCard } from '../../components/IdeaPromptCard';
import { ShortcutChips } from '../../components/ShortcutChips';
import { EmptyState } from '../../components/EmptyState';
import { QuickAddSheet } from '../../components/QuickAddSheet';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { ChevronDownIcon } from '../../components/icons';
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

  const canCreateTaskToday = useAppStore((s) => s.canCreateTaskToday);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedRevealed, setCompletedRevealed] = useState(false);

  const today = todayISO();

  // Plan gratis en su límite diario: cualquier intento de crear una tarea más lleva al
  // paywall de uso en vez de a la voz, el texto o el agregado rápido.
  function withCapacity(action: () => void) {
    if (!canCreateTaskToday()) {
      router.push('/paywall');
      return;
    }
    action();
  }

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

  const mascotFilled = todaysTasks.length === 0 ? 0 : Math.round((done.length / todaysTasks.length) * 5);
  const mascotMood = allDone ? 'celebrating' : mascotFilled === 0 ? 'resting' : 'organizing';

  const showPendingHeader = todaysTasks.length > 0 && !allDone;

  function goToEscribir(prefix?: string) {
    withCapacity(() => {
      router.push(prefix ? { pathname: '/(voz)/escribir', params: { prefix } } : '/(voz)/escribir');
    });
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
        <Text style={styles.greeting}>{copy.greeting.replace('Manu', seedUserName)}</Text>
        <Text style={styles.message} accessibilityLiveRegion="polite">
          {headerMessage}
        </Text>
      </View>

      {showPendingHeader ? (
        <View style={styles.heroCard}>
          <PoliMascot mood={mascotMood} filled={mascotFilled} size={148} />
          <View style={styles.heroText}>
            <View style={styles.heroCountRow}>
              <Text style={styles.heroCount}>{done.length}</Text>
              <Text style={styles.heroCountOf}>{`de ${todaysTasks.length}`}</Text>
            </View>
            <Text style={styles.heroLabel}>tareas hechas</Text>
            <ProgressIndicator
              segments={todaysTasks.length}
              done={done.length}
              accessibilityLabel={`${done.length} de ${todaysTasks.length} tareas completadas`}
            />
          </View>
        </View>
      ) : null}

      {todaysTasks.length === 0 ? (
        <ScrollView style={styles.listFlex} contentContainerStyle={styles.emptyContent}>
          <EmptyState mood="listening" title="Empecemos tu día" body={copy.empty.today} size={170} />
          <View style={styles.ideaCard}>
            <Text style={styles.ideaCardTitle}>O empieza con una idea</Text>
            <ShortcutChips onSelect={goToEscribir} />
          </View>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>{copy.empty.todayExample}</Text>
          </View>
          {devButton}
        </ScrollView>
      ) : allDone ? (
        <ScrollView style={styles.listFlex} contentContainerStyle={styles.doneContent}>
          <DayCompleteCard done={done.length} total={todaysTasks.length} />
          <WeekSummaryCard tasks={tasks} todayIso={today} />
          <IdeaPromptCard onAddIdea={(title) => withCapacity(() => addQuickTask(title))} tomorrowCount={tomorrowCount} />
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
                onPress={() => withCapacity(() => setQuickAddOpen(true))}
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
        onSubmit={(title) => withCapacity(() => addQuickTask(title))}
        onMic={() => withCapacity(() => router.push('/(voz)/escuchando'))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  header: { gap: space[1], marginBottom: space[5] },
  greeting: { ...type.title, color: colors.ink[1] },
  message: { ...type.body, color: colors.ink[2] },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    backgroundColor: colors.panel,
    borderRadius: radius.panel,
    paddingVertical: space[2],
    paddingLeft: space[2],
    paddingRight: space[5],
    marginBottom: space[5],
  },
  heroText: { flex: 1, gap: space[1] },
  heroCountRow: { flexDirection: 'row', alignItems: 'baseline', gap: space[1] },
  heroCount: { ...type.titleLg, color: colors.ink[1] },
  heroCountOf: { ...type.card, color: colors.ink[2] },
  heroLabel: { ...type.caption, color: colors.ink[1] },
  listFlex: { flex: 1 },
  list: { paddingBottom: space[12] + size.mic, gap: space[3] },
  doneContent: { paddingBottom: space[12] + size.mic, paddingTop: space[2], gap: space[3] },
  emptyContent: { paddingBottom: space[12] + size.mic, paddingTop: space[2], gap: space[4] },
  ideaCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    padding: space[4],
    gap: space[3],
  },
  ideaCardTitle: { ...type.caption, color: colors.ink[1] },
  exampleBox: {
    borderWidth: 1.5,
    borderColor: colors.suggest.fg,
    borderStyle: 'dashed',
    backgroundColor: colors.suggest.bg,
    borderRadius: radius.day,
    padding: space[4],
  },
  exampleText: { ...type.body, color: colors.ink[1] },
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
