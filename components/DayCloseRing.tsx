import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { colors, radius, space, type } from '../theme/tokens';
import { ChestIcon } from './icons';
import type { Task } from '../types/domain';
import { todayISO, startOfWeek, addDays } from '../lib/date';
import { buildWeekBars, weekTotal, weekdayChestProgress } from '../lib/streak';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 84;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface DayCloseRingProps {
  tasks: Task[];
  doneToday: number;
  totalToday: number;
}

/** Opción 2 de fallow.png ("Casi lo logras"): bloque en Hoy, no una pantalla aparte. */
export function DayCloseRing({ tasks, doneToday, totalToday }: DayCloseRingProps) {
  const today = todayISO();
  const progress = totalToday > 0 ? doneToday / totalToday : 0;
  const remaining = Math.max(totalToday - doneToday, 0);
  const remainingMinutes = tasks
    .filter((t) => t.date === today && t.status === 'pending')
    .reduce((sum, t) => sum + t.durationMin, 0);

  const dash = useSharedValue(CIRCUMFERENCE);
  useEffect(() => {
    dash.value = withTiming(CIRCUMFERENCE * (1 - progress), { duration: 400, easing: Easing.out(Easing.ease) });
  }, [progress]);
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: dash.value }));

  const bars = buildWeekBars(tasks, today);
  const maxCount = Math.max(...bars.map((b) => b.count), 1);
  const thisWeek = weekTotal(tasks, startOfWeek(today));
  const lastWeek = weekTotal(tasks, addDays(startOfWeek(today), -7));
  const diff = thisWeek - lastWeek;
  const chest = weekdayChestProgress(tasks, today);

  if (totalToday === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.ringWrap}>
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colors.track}
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colors.brand[700]}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProps}
              rotation={-90}
              originX={SIZE / 2}
              originY={SIZE / 2}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.ringValue}>
              {doneToday}/{totalToday}
            </Text>
          </View>
        </View>

        <View style={styles.message}>
          <Text style={styles.messageTitle}>
            {remaining === 0
              ? '¡Día completo!'
              : remaining === 1
                ? 'Una más y cierras el día.'
                : `${remaining} más y cierras el día.`}
          </Text>
          {remaining > 0 ? (
            <Text style={styles.messageBody}>
              {remainingMinutes > 0 ? `Dura ${remainingMinutes >= 60 ? `${Math.round(remainingMinutes / 60)} h` : `${remainingMinutes} min`}.` : ''}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.weekBlock}>
        <Text style={styles.weekLabel}>
          Esta semana{' '}
          {diff === 0 ? '· igual que la anterior' : diff > 0 ? `· +${diff} que la anterior` : `· ${diff} que la anterior`}
        </Text>
        <View style={styles.barsRow}>
          {bars.map((bar) => (
            <View key={bar.date} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max((bar.count / maxCount) * 40, 6),
                    backgroundColor: bar.isFuture
                      ? colors.track
                      : bar.isToday
                        ? colors.brand[200]
                        : colors.brand[700],
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.chestRow}>
        <ChestIcon size={22} color={colors.brand[800]} />
        <View>
          <Text style={styles.chestTitle}>Cofre del domingo</Text>
          <Text style={styles.chestBody}>
            {chest.completed} de {chest.target} días cumplidos.{' '}
            {chest.completed >= chest.target ? '¡Completo!' : `Te falta ${chest.target - chest.completed}.`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.panel, padding: space[4], gap: space[4] },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: space[4] },
  ringWrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringValue: { ...type.card, color: colors.ink[1] },
  message: { flex: 1, gap: 2 },
  messageTitle: { ...type.card, color: colors.ink[1] },
  messageBody: { ...type.bodySm, color: colors.ink[3] },
  weekBlock: { gap: space[2] },
  weekLabel: { ...type.caption, color: colors.ink[3] },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space[2], height: 44 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4 },
  chestRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingTop: space[2], borderTopWidth: 1, borderTopColor: colors.line },
  chestTitle: { ...type.caption, color: colors.ink[1] },
  chestBody: { ...type.caption, color: colors.ink[3] },
});
