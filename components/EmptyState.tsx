import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, space, type } from '../theme/tokens';
import { PendiloMascot } from './PendiloMascot';
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
}

export function EmptyState({ mood = 'resting', title, body, actions }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <PendiloMascot mood={mood} size={72} />
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
  container: { alignItems: 'center', paddingVertical: space[8], paddingHorizontal: space[6], gap: space[3] },
  title: { ...type.section, color: colors.ink[1], textAlign: 'center' },
  body: { ...type.body, color: colors.ink[2], textAlign: 'center' },
  action: { marginTop: space[3] },
});
