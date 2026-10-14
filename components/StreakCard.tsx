import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import { PendiloMascot } from './PendiloMascot';
import { ShieldIcon } from './icons';
import type { DayCircle } from '../lib/streak';
import { nextStoneMilestone } from '../lib/streak';
import { weekdayLong } from '../lib/date';

interface StreakCardProps {
  currentStreak: number;
  recordStreak: number;
  todayPending: number;
  circles: DayCircle[];
  selected: string;
  onSelectDay: (date: string) => void;
  /** Escudos de racha disponibles (perdona un día sin romper la racha). Fase 1: siempre 1. */
  shieldsAvailable?: number;
}

/**
 * Opción 1 de fallow.png ("Racha viva"): reemplaza el mapa de calor de Mi semana.
 * Premia lo que sí se hizo en vez de mostrar 140 días vacíos.
 */
export function StreakCard({
  currentStreak,
  recordStreak,
  todayPending,
  circles,
  selected,
  onSelectDay,
  shieldsAvailable = 1,
}: StreakCardProps) {
  const milestone = nextStoneMilestone(currentStreak);

  return (
    <View style={styles.card}>
      <View style={styles.hero}>
        <PendiloMascot mood={currentStreak > 0 ? 'celebrating' : 'resting'} size={48} />
        <View style={styles.heroText}>
          <Text style={styles.heroValue}>{currentStreak === 1 ? '1 día' : `${currentStreak} días`}</Text>
          <Text style={styles.heroCaption}>
            {recordStreak > 0 ? `seguidos. Tu récord es ${recordStreak}.` : 'seguidos. Arrancá hoy tu racha.'}
          </Text>
        </View>
      </View>

      <View style={styles.circlesRow}>
        {circles.map((day) => {
          const isSelected = day.date === selected;
          return (
            <Pressable
              key={day.date}
              onPress={() => onSelectDay(day.date)}
              accessibilityRole="button"
              accessibilityLabel={weekdayLong(day.date)}
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.circle,
                day.status === 'done' ? styles.circleDone : null,
                day.status === 'today-pending' ? styles.circleToday : null,
                day.status === 'future' || day.status === 'empty' ? styles.circleEmpty : null,
                isSelected ? styles.circleSelected : null,
              ]}
            >
              <Text
                style={[
                  styles.circleLabel,
                  day.status === 'done' ? styles.circleLabelOnDark : null,
                  day.status === 'future' || day.status === 'empty' ? styles.circleLabelMuted : null,
                ]}
              >
                {day.letter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {todayPending > 0 ? (
        <Text style={styles.hint}>
          Te falta {todayPending === 1 ? '1 tarea' : `${todayPending} tareas`} hoy para sumar la piedra{' '}
          {currentStreak + 1}.
        </Text>
      ) : null}

      {shieldsAvailable > 0 ? (
        <View style={styles.shieldChip}>
          <ShieldIcon size={14} color={colors.suggest.fg} />
          <Text style={styles.shieldLabel}>
            Escudo de racha: {shieldsAvailable} disponible{shieldsAvailable > 1 ? 's' : ''}
          </Text>
        </View>
      ) : null}

      <View style={styles.milestoneBlock}>
        <Text style={styles.milestoneText}>
          Faltan {milestone.remainingDays} {milestone.remainingDays === 1 ? 'día' : 'días'} para la piedra{' '}
          {milestone.target} y un Mojón nuevo.
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(milestone.progress, 0.03) * 100}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.panel, padding: space[5], gap: space[4] },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    backgroundColor: colors.brand[700],
    borderRadius: radius.card,
    padding: space[4],
  },
  heroText: { gap: 2 },
  heroValue: { ...type.titleLg, color: colors.surface },
  heroCaption: { ...type.bodySm, color: colors.brand[100] },
  circlesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.track,
  },
  circleDone: { backgroundColor: colors.brand[700] },
  circleToday: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.brand[700] },
  circleEmpty: { backgroundColor: colors.panel },
  circleSelected: { borderWidth: 2, borderColor: colors.ink[1] },
  circleLabel: { ...type.caption, color: colors.ink[2] },
  circleLabelOnDark: { color: colors.surface },
  circleLabelMuted: { color: colors.ink[4] },
  hint: { ...type.bodySm, color: colors.ink[1] },
  shieldChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    alignSelf: 'flex-start',
    backgroundColor: colors.suggest.bg,
    borderWidth: 1,
    borderColor: colors.suggest.fg,
    borderStyle: 'dashed',
    borderRadius: radius.chip,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
  },
  shieldLabel: { ...type.caption, color: colors.suggest.fg },
  milestoneBlock: { gap: space[2] },
  milestoneText: { ...type.bodySm, color: colors.ink[1] },
  track: { height: 8, borderRadius: radius.chip, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.brand[700], borderRadius: radius.chip },
});
