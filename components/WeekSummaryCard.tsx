import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, radius, space, type } from '../theme/tokens';
import { buildWeekRingDays, type WeekRingDay, type WeekRingState } from '../lib/cycle';
import type { Task } from '../types/domain';

interface WeekSummaryCardProps {
  tasks: Task[];
  todayIso: string;
}

const RING_SIZE = 36;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const STATE_LABEL: Record<WeekRingState, string> = {
  done: 'Completo',
  partial: 'Parcial',
  pending: 'Pendiente',
  empty: 'Sin tareas',
};

/** "N de M hechas" esta semana, con acceso directo a Esta semana (04). */
export function WeekSummaryCard({ tasks, todayIso }: WeekSummaryCardProps) {
  const days = buildWeekRingDays(tasks, todayIso);
  const total = days.length;
  const done = days.filter((d) => d.state === 'done').length;

  return (
    <Pressable
      onPress={() => router.push('/(tabs)/semana')}
      accessibilityRole="button"
      accessibilityLabel={`${done} de ${total} días completos esta semana. Ver mi semana`}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>
          Esta semana: {done} de {total} hechas
        </Text>
        <Text style={styles.link}>Ver mi semana</Text>
      </View>

      <View style={styles.daysRow}>
        {days.map((day) => (
          <DayRing key={day.date} day={day} />
        ))}
      </View>

      <View style={styles.legendRow}>
        <LegendItem state="done" label={STATE_LABEL.done} />
        <LegendItem state="partial" label={STATE_LABEL.partial} />
        <LegendItem state="pending" label={STATE_LABEL.pending} />
        <LegendItem state="empty" label={STATE_LABEL.empty} />
        <LegendItem state="today" label="Hoy" />
      </View>
    </Pressable>
  );
}

function DayRing({ day }: { day: WeekRingDay }) {
  const frac = day.total === 0 ? '–' : `${day.done}/${day.total}`;
  return (
    <View style={styles.dayColumn}>
      <Text style={[styles.dayLetter, day.isToday ? styles.dayLetterToday : null]}>{day.isToday ? 'Hoy' : day.letter}</Text>
      <View style={[styles.daySlot, day.isToday ? styles.daySlotToday : null]}>
        <RingBadge state={day.state} pct={day.pct} done={day.done} />
      </View>
      <Text style={styles.dayFrac}>{frac}</Text>
    </View>
  );
}

function RingBadge({ state, pct, done }: { state: WeekRingState; pct: number; done: number }) {
  if (state === 'done') {
    return (
      <View style={[styles.ringBase, styles.ringDone]}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={colors.surface} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    );
  }
  if (state === 'empty') {
    return (
      <View style={styles.ringBase}>
        <DashedCircle size={RING_SIZE} stroke={1.5} />
        <Text style={styles.ringEmptyDash}>–</Text>
      </View>
    );
  }
  if (state === 'pending') {
    return (
      <View style={[styles.ringBase, styles.ringPending]}>
        <Text style={styles.ringNumberMuted}>{done}</Text>
      </View>
    );
  }
  // partial: anillo relleno proporcional + número de tareas hechas en el centro.
  const dashOffset = RING_CIRCUMFERENCE * (1 - pct / 100);
  return (
    <View style={styles.ringBase}>
      <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} style={StyleSheet.absoluteFill}>
        <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} stroke={colors.track} strokeWidth={RING_STROKE} fill="none" />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={colors.brand[500]}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          rotation={-90}
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>
      <Text style={styles.ringNumber}>{done}</Text>
    </View>
  );
}

function LegendItem({ state, label }: { state: WeekRingState | 'today'; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendSwatch,
          state === 'done' ? styles.legendDone : null,
          state === 'partial' ? styles.legendPartial : null,
          state === 'pending' ? styles.legendPending : null,
          state === 'today' ? styles.legendToday : null,
        ]}
      >
        {state === 'empty' ? <DashedCircle size={14} stroke={1.5} /> : null}
      </View>
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

/** Círculo punteado dibujado en SVG: el borderStyle 'dashed' de RN se ve roto en
 * círculos chicos (iOS), así que el estado "sin tareas" usa un trazo real. */
function DashedCircle({ size, stroke }: { size: number; stroke: number }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = Math.max(2, circumference / 12);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={StyleSheet.absoluteFill}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.track} strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${dash}`} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.panel, padding: space[5], gap: space[4] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...type.card, color: colors.ink[1], flex: 1 },
  link: { ...type.caption, color: colors.brand[700] },

  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayColumn: { alignItems: 'center', gap: space[1], flex: 1, minWidth: 0 },
  dayLetter: { ...type.caption, color: colors.ink[3] },
  dayLetterToday: { color: colors.brand[800], fontWeight: '700' },
  dayFrac: { ...type.overline, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: colors.ink[4] },

  daySlot: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  daySlotToday: { borderColor: colors.brand[700] },

  ringBase: { width: RING_SIZE, height: RING_SIZE, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  ringDone: { backgroundColor: colors.brand[700] },
  ringPending: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.track },
  ringEmptyDash: { ...type.caption, color: colors.ink[4], position: 'absolute' },
  ringNumber: { ...type.caption, color: colors.ink[1], position: 'absolute' },
  ringNumberMuted: { ...type.caption, color: colors.ink[4] },

  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3], borderTopWidth: 1, borderTopColor: colors.line, paddingTop: space[3] },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
  legendSwatch: { width: 14, height: 14, borderRadius: 7 },
  legendDone: { backgroundColor: colors.brand[700] },
  legendPartial: { backgroundColor: colors.brand[500] },
  legendPending: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.track },
  legendToday: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.brand[700] },
  legendLabel: { ...type.meta, fontSize: 12, color: colors.ink[2] },
});
