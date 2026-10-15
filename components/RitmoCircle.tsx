import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, space, type } from '../theme/tokens';
import { isGoalComplete } from '../data/repositories/goalRepository';
import type { Goal } from '../types/domain';

const SIZE = 44;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RitmoCircleProps {
  goal: Goal;
  /** Magnitud de un paso (1 sesión / 5 % / 0.5 h), ver goalStep() en goalRepository. */
  step: number;
  onChange: (delta: number) => void;
}

/** Círculo de 44px de un "Ritmo" (objetivo semanal). Tocar avanza un paso; tocar ya lleno
 * o mantener presionado quita el último paso (handoff §04 "Ritmos"). */
export function RitmoCircle({ goal, step, onChange }: RitmoCircleProps) {
  const complete = isGoalComplete(goal);
  const progress = Math.min(goal.value / goal.target, 1);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Pressable
      onPress={() => onChange(complete ? -step : step)}
      onLongPress={() => onChange(-step)}
      accessibilityRole="button"
      accessibilityLabel={`${goal.title}: ${goal.value} de ${goal.target}`}
      accessibilityHint={complete ? 'Tocar para quitar el último avance' : 'Tocar para avanzar un paso'}
      style={styles.wrap}
    >
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={colors.track} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={complete ? colors.brand[700] : colors.action.bg}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <Text style={styles.title} numberOfLines={2}>
        {goal.title}
      </Text>
      <Text style={styles.value}>
        {goal.kind === 'count' ? `${goal.value}/${goal.target}` : goal.kind === 'percent' ? `${goal.value}%` : `${goal.value}h`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 84, gap: space[1] },
  title: { ...type.caption, color: colors.ink[1], textAlign: 'center' },
  value: { ...type.meta, color: colors.ink[3] },
});
