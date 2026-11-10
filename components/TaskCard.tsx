import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  cancelAnimation,
  LinearTransition,
  FadeIn,
  FadeOut,
  type SharedValue,
} from 'react-native-reanimated';
import SwipeableRow, { SwipeDirection, type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { colors, radius, space, size, type, spring, easing, border } from '../theme/tokens';
import { Button } from './Button';
import { SegmentedChoice } from './SegmentedChoice';
import { Stepper } from './Stepper';
import { CheckIcon, TrashIcon } from './icons';
import type { Task } from '../types/domain';
import { addDays, minutesToLabel, relativeDayLabel, todayISO } from '../lib/date';

interface TaskCardProps {
  task: Task;
  expanded: boolean;
  nowDate?: string;
  isOverdue: boolean;
  /** La próxima tarea pendiente del día: se resalta con borde y la etiqueta "Siguiente". */
  isNext?: boolean;
  onToggleExpand: () => void;
  onToggleDone: () => void;
  onPostpone: () => void;
  onChangeDate: (date: string) => void;
  onChangeMinutes: (minutes: number | null) => void;
  /** Si no se pasa, el swipe para borrar queda deshabilitado (no aparece el panel rojo). */
  onDelete?: () => void;
}

const DAY_OFFSETS = [0, 1, 2, 3];
const CHECKBOX_HIT_SLOP = (size.touch - size.checkbox) / 2;
const SWIPE_ACTION_WIDTH = 88;

// Horarios: paso de 30 min, día entre 00:00 y 23:30, 9:00 como default al abrir el stepper sin hora.
const MINUTES_STEP = 30;
const MIN_MINUTES = 0;
const MAX_MINUTES = 23 * 60 + 30;
const DEFAULT_MINUTES = 9 * 60;

// Builders fuera del componente: reconstruirlos en cada render pierde animaciones en vuelo.
const CARD_LAYOUT = LinearTransition.duration(200).easing(easing.easeInOut);
const EXPANDED_ENTER = FadeIn.duration(160).easing(easing.easeOut);
const EXPANDED_EXIT = FadeOut.duration(140).easing(easing.easeOut);
// Salida al replegarse a "completadas": opacity sola (el reflow de los vecinos lo hace `layout`/`itemLayoutAnimation`).
export const TASK_CARD_EXIT = FadeOut.duration(220).easing(easing.easeInOut);

function CheckMark() {
  const scale = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withSpring(1, spring.snappy);
    return () => cancelAnimation(scale);
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.Text style={[styles.checkMark, style]}>✓</Animated.Text>;
}

function SwipeAction({
  progress,
  color,
  icon,
  label,
  onPress,
}: {
  progress: SharedValue<number>;
  color: string;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  const style = useAnimatedStyle(() => ({ opacity: Math.min(progress.get(), 1) }));
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.swipeAction, { backgroundColor: color }]}
    >
      <Animated.View style={[styles.swipeActionContent, style]}>
        {icon}
        <Text style={styles.swipeActionLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function TaskCard({
  task,
  expanded,
  nowDate = todayISO(),
  isOverdue,
  isNext = false,
  onToggleExpand,
  onToggleDone,
  onPostpone,
  onChangeDate,
  onChangeMinutes,
  onDelete,
}: TaskCardProps) {
  const done = task.status === 'done';
  const highlightNext = isNext && !done;
  const timeLabel = task.minutes != null ? minutesToLabel(task.minutes) : 'Sin hora';
  const swipeRef = useRef<SwipeableMethods>(null);

  const dayOptions = useMemo(
    () =>
      DAY_OFFSETS.map((offset) => {
        const date = addDays(nowDate, offset);
        return { value: date, label: relativeDayLabel(date, nowDate) };
      }),
    [nowDate]
  );

  function handleSwipeableOpen(direction: SwipeDirection) {
    swipeRef.current?.close();
    if (direction === SwipeDirection.RIGHT) {
      if (!done) onToggleDone();
    } else if (onDelete) {
      onDelete();
    }
  }

  return (
    <Animated.View layout={CARD_LAYOUT}>
      <SwipeableRow
        ref={swipeRef}
        containerStyle={styles.swipeContainer}
        friction={1.6}
        leftThreshold={SWIPE_ACTION_WIDTH}
        rightThreshold={SWIPE_ACTION_WIDTH}
        onSwipeableOpen={handleSwipeableOpen}
        renderLeftActions={
          done
            ? undefined
            : (progress) => (
                <SwipeAction
                  progress={progress}
                  color={colors.brand[700]}
                  icon={<CheckIcon size={20} color={colors.surface} />}
                  label="Completar"
                  onPress={() => handleSwipeableOpen(SwipeDirection.RIGHT)}
                />
              )
        }
        renderRightActions={
          onDelete
            ? (progress) => (
                <SwipeAction
                  progress={progress}
                  color={colors.danger.fg}
                  icon={<TrashIcon size={18} color={colors.surface} />}
                  label="Eliminar"
                  onPress={() => handleSwipeableOpen(SwipeDirection.LEFT)}
                />
              )
            : undefined
        }
      >
        <View style={[styles.card, done ? styles.cardDone : null, highlightNext ? styles.cardNext : null]}>
          <Pressable
            onPress={onToggleExpand}
            accessibilityRole="button"
            accessibilityLabel={`${task.title}, ${timeLabel}${task.isNew ? ', nueva' : ''}${isOverdue ? ', vencida' : ''}${highlightNext ? ', siguiente' : ''}`}
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
              hitSlop={CHECKBOX_HIT_SLOP}
              style={[styles.checkbox, done ? styles.checkboxDone : null]}
            >
              {done ? <CheckMark /> : null}
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
              {highlightNext ? (
                <View style={styles.nextBadge}>
                  <Text style={styles.nextBadgeLabel}>Siguiente</Text>
                </View>
              ) : null}
            </View>
          </Pressable>

          {expanded ? (
            <Animated.View entering={EXPANDED_ENTER} exiting={EXPANDED_EXIT} style={styles.expanded}>
              <View style={styles.expandedRow}>
                <Text style={styles.expandedLabel}>Día</Text>
                <SegmentedChoice options={dayOptions} value={task.date} onChange={onChangeDate} />
              </View>
              <Stepper
                label="Hora"
                valueLabel={timeLabel}
                stepAccessibilityLabel="30 minutos"
                onMinus={() => onChangeMinutes(Math.max((task.minutes ?? DEFAULT_MINUTES) - MINUTES_STEP, MIN_MINUTES))}
                onPlus={() => onChangeMinutes(Math.min((task.minutes ?? DEFAULT_MINUTES) + MINUTES_STEP, MAX_MINUTES))}
              />
              <View style={styles.actions}>
                <Button label="Posponer a mañana" variant="secondary" small onPress={onPostpone} />
                <Button label={done ? 'Marcar pendiente' : 'Completar'} small onPress={onToggleDone} />
              </View>
            </Animated.View>
          ) : null}
        </View>
      </SwipeableRow>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  swipeContainer: { borderRadius: radius.card, overflow: 'hidden' },
  swipeAction: { width: SWIPE_ACTION_WIDTH, alignItems: 'center', justifyContent: 'center' },
  swipeActionContent: { alignItems: 'center', gap: space[1] },
  swipeActionLabel: { ...type.caption, color: colors.surface },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: border.default,
    borderColor: colors.line,
    padding: space[4],
    gap: space[3],
  },
  cardDone: { backgroundColor: colors.paper },
  // Mismo borderWidth que `card`: el énfasis es solo de color, para no mover el layout al volverse "next".
  cardNext: { borderColor: colors.brand[700] },
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
  nextBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.panel,
    borderRadius: radius.chip,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
  },
  nextBadgeLabel: { ...type.caption, color: colors.brand[700] },
  expanded: { gap: space[4], paddingTop: space[2], borderTopWidth: 1, borderTopColor: colors.line },
  expandedRow: { gap: space[2] },
  expandedLabel: { ...type.caption, color: colors.ink[3] },
  // Columna, no fila: dos botones lado a lado se achicaban hasta cortar el texto de "Completar".
  // Apilados, ambos toman el ancho completo y el primario queda último (más cerca del pulgar, más prominente).
  actions: { flexDirection: 'column', gap: space[2] },
});
