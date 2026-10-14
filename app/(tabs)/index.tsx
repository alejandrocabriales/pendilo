import React, { useMemo, useState } from 'react';
import { View, Text, SectionList, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, size, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { PendiloMascot } from '../../components/PendiloMascot';
import { TaskCard } from '../../components/TaskCard';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { DayCloseRing } from '../../components/DayCloseRing';
import { DayDoneCard } from '../../components/DayDoneCard';
import { EmptyState } from '../../components/EmptyState';
import { todayISO, nowMinutes } from '../../lib/date';
import { copy, pendingHeader } from '../../data/copy';
import { seedUserName } from '../../data/mocks/seed';
import type { Task } from '../../types/domain';

type Section = { key: string; title: string; data: Task[]; collapsible?: boolean };

export default function HoyScreen() {
  const insets = useSafeAreaInsets();
  const tasks = useAppStore((s) => s.tasks);
  const toggleTaskDone = useAppStore((s) => s.toggleTaskDone);
  const postponeTask = useAppStore((s) => s.postponeTask);
  const rescheduleTask = useAppStore((s) => s.rescheduleTask);
  const clearIsNew = useAppStore((s) => s.clearIsNew);
  const devRestoreMockData = useAppStore((s) => s.devRestoreMockData);
  const addQuickTask = useAppStore((s) => s.addQuickTask);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedOpen, setCompletedOpen] = useState(true);
  const [completedRevealed, setCompletedRevealed] = useState(false);

  const today = todayISO();
  const nowMin = nowMinutes();

  const todaysTasks = useMemo(() => tasks.filter((t) => t.date === today), [tasks, today]);
  const pending = todaysTasks.filter((t) => t.status === 'pending');
  const done = todaysTasks.filter((t) => t.status === 'done');
  const ahora = pending.filter((t) => t.minutes != null && t.minutes >= nowMin && t.minutes < nowMin + 60);
  const masTarde = pending.filter((t) => !ahora.includes(t));
  const allDone = todaysTasks.length > 0 && pending.length === 0;

  const sections: Section[] = [];
  if (ahora.length > 0) sections.push({ key: 'ahora', title: 'Ahora', data: ahora });
  if (masTarde.length > 0) sections.push({ key: 'mas-tarde', title: 'Más tarde', data: masTarde });
  if (done.length > 0) sections.push({ key: 'completadas', title: 'Completadas', data: completedOpen ? done : [], collapsible: true });

  const headerMessage =
    todaysTasks.length === 0
      ? copy.header.empty
      : pending.length === 0
        ? copy.header.allDone
        : pendingHeader(pending.length);

  const mascotMood = allDone ? 'celebrating' : 'resting';

  const renderTaskCard = (item: Task) => (
    <View key={item.id} style={styles.cardWrap}>
      <TaskCard
        task={item}
        expanded={expandedId === item.id}
        isOverdue={false}
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

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4] }]}>
      <View style={styles.header}>
        <PendiloMascot mood={mascotMood} size={64} />
        <View style={styles.headerText}>
          <Text style={styles.greeting}>{copy.greeting.replace('Manu', seedUserName)}</Text>
          <Text style={styles.message} accessibilityLiveRegion="polite">
            {headerMessage}
          </Text>
        </View>
      </View>

      {todaysTasks.length > 0 ? (
        <View style={styles.progressWrap}>
          <ProgressIndicator
            segments={todaysTasks.length}
            done={done.length}
            label={`${done.length} de ${todaysTasks.length} hechas hoy`}
          />
        </View>
      ) : null}

      {todaysTasks.length > 0 ? (
        <View style={styles.ringWrap}>
          <DayCloseRing tasks={tasks} doneToday={done.length} totalToday={todaysTasks.length} />
        </View>
      ) : null}

      {todaysTasks.length === 0 ? (
        <>
          <EmptyState mood="resting" title="Nada por ahora" body={copy.empty.today} />
          {__DEV__ ? (
            <Pressable onPress={devRestoreMockData} style={styles.devButton}>
              <Text style={styles.devButtonLabel}>Restaurar datos de ejemplo (dev)</Text>
            </Pressable>
          ) : null}
        </>
      ) : allDone ? (
        <ScrollView style={styles.listFlex} contentContainerStyle={styles.doneContent}>
          <DayDoneCard onMic={() => router.push('/(voz)/escuchando')} onAddTask={addQuickTask} />

          {done.length > 0 ? (
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
          ) : null}

          {completedRevealed ? done.map(renderTaskCard) : null}

          {__DEV__ ? (
            <Pressable onPress={devRestoreMockData} style={styles.devButton}>
              <Text style={styles.devButtonLabel}>Restaurar datos de ejemplo (dev)</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      ) : (
        <SectionList
          style={styles.listFlex}
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            __DEV__ ? (
              <Pressable onPress={devRestoreMockData} style={styles.devButton}>
                <Text style={styles.devButtonLabel}>Restaurar datos de ejemplo (dev)</Text>
              </Pressable>
            ) : null
          }
          renderSectionHeader={({ section }) => (
            <Pressable
              onPress={section.collapsible ? () => setCompletedOpen((v) => !v) : undefined}
              accessibilityRole={section.collapsible ? 'button' : undefined}
              accessibilityState={section.collapsible ? { expanded: completedOpen } : undefined}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>
                {section.title} {section.collapsible ? `(${done.length})` : ''}
              </Text>
              {section.collapsible ? (
                <Text style={styles.sectionToggle}>{completedOpen ? 'Ocultar' : 'Mostrar'}</Text>
              ) : null}
            </Pressable>
          )}
          renderItem={({ item }) => renderTaskCard(item)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  header: { flexDirection: 'row', alignItems: 'center', gap: space[4], marginBottom: space[4] },
  headerText: { flex: 1, gap: space[1] },
  greeting: { ...type.title, color: colors.ink[1] },
  message: { ...type.body, color: colors.ink[2] },
  progressWrap: { marginBottom: space[5] },
  ringWrap: { marginBottom: space[5] },
  listFlex: { flex: 1 },
  list: { paddingBottom: space[12] + size.mic, gap: space[3] },
  doneContent: { paddingBottom: space[12] + size.mic, paddingTop: space[2], gap: space[3] },
  completedToggle: { alignSelf: 'center', paddingVertical: space[2] },
  completedToggleLabel: { ...type.caption, color: colors.brand[700] },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: space[2],
  },
  sectionTitle: { ...type.section, color: colors.ink[1] },
  sectionToggle: { ...type.caption, color: colors.brand[700] },
  cardWrap: { marginBottom: space[3] },
  devButton: { paddingVertical: space[3], alignItems: 'center', marginBottom: size.mic },
  devButtonLabel: { ...type.caption, color: colors.ink[4] },
});
