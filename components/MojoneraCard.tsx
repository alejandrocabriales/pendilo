import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import type { Task } from '../types/domain';
import { todayISO } from '../lib/date';
import { buildWeekTowers, computeWeeklyActivity } from '../lib/streak';

const WEEKS_SHOWN = 8;
const MAX_TOWER_HEIGHT = 64;
const CAP_HEIGHT = 14;
const CAP_GAP = 4;
const BAR_MAX_HEIGHT = MAX_TOWER_HEIGHT - CAP_HEIGHT - CAP_GAP;

interface MojoneraCardProps {
  tasks: Task[];
}

/** Opción 3 de fallow.png ("Mojonera"): vista de historial, vive en Progreso. */
export function MojoneraCard({ tasks }: MojoneraCardProps) {
  const today = todayISO();
  const { currentStreakWeeks, bestWeekCount, thisWeekCount } = computeWeeklyActivity(tasks, today);
  const towers = buildWeekTowers(tasks, today, WEEKS_SHOWN);
  const scale = Math.max(bestWeekCount, thisWeekCount, 1);
  const level = Math.max(1, Math.floor(currentStreakWeeks / 4) + 1);

  const aheadOfBest = thisWeekCount > bestWeekCount && bestWeekCount > 0;
  const neededToBeatBest = Math.max(bestWeekCount - thisWeekCount + 1, 0);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.levelLabel}>Nivel {level} · Mojón constructor</Text>
        <View style={styles.pill}>
          <Text style={styles.pillLabel}>
            {currentStreakWeeks} {currentStreakWeeks === 1 ? 'semana' : 'semanas'}
          </Text>
        </View>
      </View>

      <View style={styles.towersRow}>
        {towers.map((week) => {
          const height = week.count === 0 ? 4 : Math.max((week.count / scale) * BAR_MAX_HEIGHT, 10);
          return (
            <View key={week.weekStart} style={styles.towerColumn}>
              {week.isCurrent ? <View style={styles.towerCap} /> : null}
              <View
                style={[
                  styles.tower,
                  { height, backgroundColor: week.count > 0 ? colors.brand[500] : colors.track },
                ]}
              />
            </View>
          );
        })}
      </View>
      <Text style={styles.caption}>Cada semana es una torre. La de esta semana espera su próxima piedra.</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Eres alguien que cumple.</Text>
        <Text style={styles.blockBody}>
          {currentStreakWeeks > 0
            ? `${currentStreakWeeks} ${currentStreakWeeks === 1 ? 'semana seguida' : 'semanas seguidas'} con al menos 1 tarea hecha.`
            : 'Completá al menos 1 tarea esta semana para empezar.'}
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>
          {aheadOfBest
            ? '¡Esta semana ya es tu mejor torre!'
            : `Próximo logro: ${neededToBeatBest} ${neededToBeatBest === 1 ? 'tarea más' : 'tareas más'} y tu torre supera a la mejor (${bestWeekCount} piedras).`}
        </Text>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${Math.min((thisWeekCount / Math.max(bestWeekCount, 1)) * 100, 100)}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.panel, padding: space[4], gap: space[3] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelLabel: { ...type.card, color: colors.ink[1] },
  pill: { backgroundColor: colors.panel, borderRadius: radius.pill, paddingHorizontal: space[3], paddingVertical: 4 },
  pillLabel: { ...type.caption, color: colors.brand[800] },
  towersRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space[2], height: MAX_TOWER_HEIGHT, marginTop: space[2] },
  towerColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  tower: { width: '100%', borderRadius: 6 },
  towerCap: {
    width: '70%',
    height: CAP_HEIGHT,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.brand[500],
    borderStyle: 'dashed',
    marginBottom: CAP_GAP,
  },
  caption: { ...type.caption, color: colors.ink[3] },
  block: { gap: space[2], paddingTop: space[3], borderTopWidth: 1, borderTopColor: colors.line },
  blockTitle: { ...type.bodySm, color: colors.ink[1] },
  blockBody: { ...type.caption, color: colors.ink[3] },
  track: { height: 8, borderRadius: radius.chip, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.brand[700], borderRadius: radius.chip },
});
