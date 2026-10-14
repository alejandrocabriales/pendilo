import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import { Stepper } from './Stepper';
import type { Goal } from '../types/domain';
import { goalStep, isGoalComplete } from '../data/repositories/goalRepository';

interface GoalCardProps {
  goal: Goal;
  onChange: (delta: number) => void;
}

function goalValueLabel(goal: Goal): string {
  if (goal.kind === 'percent') return `${goal.value}%`;
  if (goal.kind === 'hours') return `${goal.value} h`;
  return `${goal.value}`;
}

function goalTargetLabel(goal: Goal): string {
  if (goal.kind === 'percent') return `${goal.target}%`;
  if (goal.kind === 'hours') return `${goal.target} h`;
  return `${goal.target} ${goal.unit}`.trim();
}

export function GoalCard({ goal, onChange }: GoalCardProps) {
  const complete = isGoalComplete(goal);
  const step = goalStep(goal.kind);
  const progress = Math.min(goal.value / goal.target, 1);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {goal.title}
        </Text>
        {complete ? <Text style={styles.badge}>Cumplido</Text> : null}
      </View>

      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: goal.target, now: goal.value }}
      >
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.meta}>
        {goalValueLabel(goal)} de {goalTargetLabel(goal)}
      </Text>

      <Stepper
        label="Progreso"
        valueLabel={goalValueLabel(goal)}
        stepAccessibilityLabel={`${step} ${goal.kind === 'count' ? goal.unit || 'veces' : goal.kind === 'percent' ? 'por ciento' : 'horas'}`}
        onMinus={() => onChange(-step)}
        onPlus={() => onChange(step)}
        minusDisabled={goal.value <= 0}
        plusDisabled={goal.value >= goal.target}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.card, padding: space[4], gap: space[3] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space[2] },
  title: { ...type.card, color: colors.ink[1], flex: 1 },
  badge: {
    ...type.caption,
    color: colors.brand[800],
    backgroundColor: colors.brand[100],
    borderRadius: radius.chip,
    paddingHorizontal: space[2],
    paddingVertical: 2,
  },
  track: { height: 10, borderRadius: radius.chip, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.action.bg, borderRadius: radius.chip },
  meta: { ...type.meta, color: colors.ink[3] },
});
