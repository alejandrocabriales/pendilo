import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import { PoliMascot } from './PoliMascot';
import { Button } from './Button';
import type { Mood } from '../types/domain';

interface ActionSpec {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  mood?: Mood;
  title: string;
  body?: string;
  actions?: ActionSpec[];
  size?: number;
}

export function EmptyState({ mood = 'resting', title, body, actions, size = 72 }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <PoliMascot mood={mood} size={size} />
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {actions?.map((action) => (
        <View key={action.label} style={styles.action}>
          <Button label={action.label} variant="secondary" onPress={action.onPress} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: space[8],
    paddingHorizontal: space[6],
    gap: space[3],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.panel,
  },
  title: { ...type.section, color: colors.ink[1], textAlign: 'center' },
  body: { ...type.body, color: colors.ink[2], textAlign: 'center' },
  action: { marginTop: space[3] },
});
