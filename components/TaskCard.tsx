import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, space, size, type } from '../theme/tokens';
import { Button } from './Button';
import { SegmentedChoice } from './SegmentedChoice';
import { Stepper } from './Stepper';
import type { Task } from '../types/domain';
import { addDays, minutesToLabel, relativeDayLabel, todayISO } from '../lib/date';

interface TaskCardProps {
  task: Task;
  expanded: boolean;
  nowDate?: string;
  isOverdue: boolean;
  onToggleExpand: () => void;
  onToggleDone: () => void;
  onPostpone: () => void;
  onChangeDate: (date: string) => void;
  onChangeMinutes: (minutes: number | null) => void;
}

const DAY_OFFSETS = [0, 1, 2, 3];

export function TaskCard({
  task,
  expanded,
  nowDate = todayISO(),
  isOverdue,
  onToggleExpand,
  onToggleDone,
  onPostpone,
  onChangeDate,
  onChangeMinutes,
}: TaskCardProps) {
  const done = task.status === 'done';
  const timeLabel = task.minutes != null ? minutesToLabel(task.minutes) : 'Sin hora';

  const dayOptions = DAY_OFFSETS.map((offset) => {
    const date = addDays(nowDate, offset);
    return { value: date, label: relativeDayLabel(date, nowDate) };
  });

  return (
    <View style={[styles.card, done ? styles.cardDone : null]}>
      <Pressable
        onPress={onToggleExpand}
        accessibilityRole="button"
        accessibilityLabel={`${task.title}, ${timeLabel}${task.isNew ? ', nueva' : ''}${isOverdue ? ', vencida' : ''}`}
        style={styles.row}
      >
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onToggleDone();
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={done ? 'Marcar como pendiente' : 'Marcar como hecha'}
          hitSlop={8}
          style={[styles.checkbox, done ? styles.checkboxDone : null]}
        >
          {done ? <Text style={styles.checkMark}>✓</Text> : null}
        </Pressable>

        <View style={styles.body}>
          <Text style={[styles.title, done ? styles.titleDone : null]} numberOfLines={2}>
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              {timeLabel} · {task.durationMin} min
            </Text>
            {task.isNew ? <Text style={styles.badgeNew}>Nueva</Text> : null}
            {isOverdue && !done ? <Text style={styles.badgeOverdue}>⚠ Vencida</Text> : null}
          </View>
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.expanded}>
          <View style={styles.expandedRow}>
            <Text style={styles.expandedLabel}>Día</Text>
            <SegmentedChoice options={dayOptions} value={task.date} onChange={onChangeDate} />
          </View>
          <Stepper
            label="Hora"
            valueLabel={timeLabel}
            stepAccessibilityLabel="30 minutos"
            onMinus={() => onChangeMinutes(Math.max((task.minutes ?? 540) - 30, 0))}
            onPlus={() => onChangeMinutes(Math.min((task.minutes ?? 540) + 30, 23 * 60 + 30))}
          />
          <View style={styles.actions}>
            <Button label="Posponer a mañana" variant="secondary" small onPress={onPostpone} />
            <Button label={done ? 'Marcar pendiente' : 'Completar'} small onPress={onToggleDone} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: space[4],
    gap: space[3],
  },
  cardDone: { backgroundColor: colors.paper },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  checkbox: {
    width: size.checkbox,
    height: size.checkbox,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxDone: { backgroundColor: colors.brand[700], borderColor: colors.brand[700] },
  checkMark: { color: colors.surface, fontSize: 14, fontWeight: '700' },
  body: { flex: 1, gap: space[1] },
  title: { ...type.card, color: colors.ink[1] },
  titleDone: { textDecorationLine: 'line-through', color: colors.ink[3] },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: space[2], flexWrap: 'wrap' },
  meta: { ...type.meta, color: colors.ink[3] },
  badgeNew: { ...type.caption, color: colors.brand[700] },
  badgeOverdue: { ...type.caption, color: colors.danger.fg },
  expanded: { gap: space[4], paddingTop: space[2], borderTopWidth: 1, borderTopColor: colors.line },
  expandedRow: { gap: space[2] },
  expandedLabel: { ...type.caption, color: colors.ink[3] },
  actions: { flexDirection: 'row', gap: space[2] },
});
