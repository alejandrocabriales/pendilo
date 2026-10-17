import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, size, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { useLingeringCompletion } from '../../hooks/useLingeringCompletion';
import { TaskCard, TASK_CARD_EXIT } from '../../components/TaskCard';
import { RitmoCircle } from '../../components/RitmoCircle';
import { ShortcutChips } from '../../components/ShortcutChips';
import { EmptyState } from '../../components/EmptyState';
import { goalStep } from '../../data/repositories/goalRepository';
import { todayISO } from '../../lib/date';
import { weekNumber, daysUntilCycleClose, buildDayCycleStates, weekLoad, weekLoadLabel } from '../../lib/cycle';

const CYCLE_SEGMENTS = [
  { label: 'Plan listo', fromWeekday: 1 },
  { label: 'Mitad de semana', fromWeekday: 3 },
  { label: 'Recta final', fromWeekday: 5 },
  { label: 'Cierre', fromWeekday: 7 },
];

export default function SemanaScreen() {
  const insets = useSafeAreaInsets();
  const tasks = useAppStore((s) => s.tasks);
  const goals = useAppStore((s) => s.goals);
  const changeGoalProgress = useAppStore((s) => s.changeGoalProgress);
  const toggleTaskDone = useAppStore((s) => s.toggleTaskDone);
  const postponeTask = useAppStore((s) => s.postponeTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const rescheduleTask = useAppStore((s) => s.rescheduleTask);

  const today = todayISO();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllDone, setShowAllDone] = useState(false);
  const lingering = useLingeringCompletion();

  const dayStates = useMemo(() => buildDayCycleStates(tasks, today), [tasks, today]);
  const weekDates = useMemo(() => new Set(dayStates.map((d) => d.date)), [dayStates]);
  const weekTasks = useMemo(() => tasks.filter((t) => weekDates.has(t.date)), [tasks, weekDates]);
  const scoped = selectedDay ? weekTasks.filter((t) => t.date === selectedDay) : weekTasks;

  const pendingAll = useMemo(
    () =>
      scoped
        .filter((t) => t.status === 'pending' || lingering.heldIds.has(t.id))
        .sort((a, b) => a.date.localeCompare(b.date) || (a.minutes ?? Infinity) - (b.minutes ?? Infinity)),
    [scoped, lingering.heldIds]
  );
  const doneAll = useMemo(() => scoped.filter((t) => t.status === 'done'), [scoped]);

  const pendingShown = showAllPending ? pendingAll : pendingAll.slice(0, 4);
  const doneShown = showAllDone ? doneAll : doneAll.slice(0, 2);
  const hasMorePending = !showAllPending && pendingAll.length > 4;
  const hasMoreDone = !showAllDone && doneAll.length > 2;

  const weekDone = weekTasks.filter((t) => t.status === 'done').length;
  const weekPending = weekTasks.length - weekDone;
  const load = weekLoad(weekPending);

  const todayWeekday = new Date(today + 'T00:00:00').getDay() || 7; // lunes=1 .. domingo=7

  function goToEscribir(prefix?: string) {
    router.push(prefix ? { pathname: '/(voz)/escribir', params: { prefix } } : '/(voz)/escribir');
  }

  const renderTask = (item: (typeof tasks)[number]) => (
    <Animated.View key={item.id} style={styles.cardWrap} exiting={TASK_CARD_EXIT}>
      <TaskCard
        task={item}
        expanded={expandedId === item.id}
        isOverdue={item.date < today && item.status === 'pending'}
        nowDate={today}
        onToggleExpand={() => setExpandedId((id) => (id === item.id ? null : item.id))}
        onToggleDone={() => {
          if (item.status === 'pending') lingering.hold(item.id);
          else lingering.release(item.id);
          toggleTaskDone(item.id);
        }}
        onPostpone={() => postponeTask(item.id)}
        onDelete={() => deleteTask(item.id)}
        onChangeDate={(date) => rescheduleTask(item.id, date, item.minutes)}
        onChangeMinutes={(minutes) => rescheduleTask(item.id, item.date, minutes)}
      />
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4] }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: space[12] + size.mic }}>
        <Text style={styles.title}>
          Semana {weekNumber(today)} · Cierra en {daysUntilCycleClose(today)} días
        </Text>

        <View style={styles.daysRow}>
          {dayStates.map((day) => {
            const selected = selectedDay === day.date;
            return (
              <Pressable
                key={day.date}
                onPress={() => setSelectedDay((d) => (d === day.date ? null : day.date))}
                accessibilityRole="button"
                accessibilityLabel={`${day.letter}, ${day.status}`}
                accessibilityState={{ selected }}
                style={styles.dayWrap}
              >
                <View
                  style={[
                    styles.dayNode,
                    day.status === 'ok' ? styles.dayOk : null,
                    day.status === 'parcial' ? styles.dayParcial : null,
                    day.status === 'futuro' ? styles.dayFuturo : null,
                    day.status === 'hoy' ? styles.dayHoy : null,
                    selected ? styles.daySelected : null,
                  ]}
                >
                  <Text style={[styles.dayLetter, day.status === 'futuro' ? styles.dayLetterMuted : null]}>{day.letter}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.segmentsRow}>
          {CYCLE_SEGMENTS.map((seg) => (
            <View
              key={seg.label}
              style={[styles.segment, todayWeekday >= seg.fromWeekday ? styles.segmentOn : styles.segmentOff]}
            />
          ))}
        </View>
        <Text style={styles.segmentsLabel}>{CYCLE_SEGMENTS.find((s) => todayWeekday < s.fromWeekday)?.label ?? 'Cierre'}</Text>

        {goals.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ritmosRow} contentContainerStyle={styles.ritmosContent}>
            {goals.map((goal) => (
              <RitmoCircle
                key={goal.id}
                goal={goal}
                step={goalStep(goal.kind)}
                onChange={(delta) => changeGoalProgress(goal.id, delta)}
              />
            ))}
          </ScrollView>
        ) : null}

        <ShortcutChips onSelect={goToEscribir} />

        {weekTasks.length > 0 ? (
          <Text style={styles.loadText}>
            {weekDone} de {weekTasks.length} listas · {weekLoadLabel(load)}
          </Text>
        ) : null}

        {scoped.length === 0 ? (
          <EmptyState
            mood="resting"
            title={selectedDay ? 'Día libre' : 'Semana libre'}
            body={selectedDay ? 'No hay nada agendado este día.' : 'Todavía no hay nada agendado esta semana.'}
          />
        ) : (
          <>
            {pendingShown.map(renderTask)}
            {hasMorePending ? (
              <Pressable onPress={() => setShowAllPending(true)} accessibilityRole="button" style={styles.moreLink}>
                <Text style={styles.moreLinkLabel}>Ver más pendientes</Text>
              </Pressable>
            ) : null}

            {doneShown.length > 0 ? <Text style={styles.doneHeader}>Completadas</Text> : null}
            {doneShown.map(renderTask)}
            {hasMoreDone ? (
              <Pressable onPress={() => setShowAllDone(true)} accessibilityRole="button" style={styles.moreLink}>
                <Text style={styles.moreLinkLabel}>Ver más completadas</Text>
              </Pressable>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  title: { ...type.section, color: colors.ink[1], marginBottom: space[5] },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space[4] },
  dayWrap: { alignItems: 'center', minWidth: size.touch, minHeight: size.touch, justifyContent: 'center' },
  dayNode: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.track,
  },
  dayOk: { backgroundColor: colors.brand[700] },
  dayParcial: { backgroundColor: colors.brand[200] },
  dayFuturo: { backgroundColor: colors.track },
  dayHoy: { backgroundColor: colors.action.bg, borderWidth: 2, borderColor: colors.ink[1] },
  daySelected: { borderWidth: 2, borderColor: colors.ink[1] },
  dayLetter: { ...type.caption, color: colors.surface },
  dayLetterMuted: { color: colors.ink[4] },
  segmentsRow: { flexDirection: 'row', gap: space[1], marginBottom: space[1] },
  segment: { flex: 1, height: 6, borderRadius: radius.chip },
  segmentOn: { backgroundColor: colors.brand[700] },
  segmentOff: { backgroundColor: colors.track },
  segmentsLabel: { ...type.caption, color: colors.ink[3], marginBottom: space[5] },
  ritmosRow: { marginBottom: space[4] },
  ritmosContent: { gap: space[4], paddingVertical: space[1] },
  loadText: { ...type.bodySm, color: colors.ink[3], marginTop: space[4], marginBottom: space[3] },
  cardWrap: { marginBottom: space[3] },
  moreLink: { alignSelf: 'center', paddingVertical: space[2] },
  moreLinkLabel: { ...type.card, color: colors.brand[700] },
  doneHeader: { ...type.caption, color: colors.ink[4], marginTop: space[2], marginBottom: space[2] },
});
