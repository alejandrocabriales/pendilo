import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import { Button } from './Button';

interface BannerAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'flat';
}

interface BannerProps {
  text: string;
  actions: BannerAction[];
}

export function Banner({ text, actions }: BannerProps) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{text}</Text>
      <View style={styles.actions}>
        {actions.map((action) => (
          <Button
            key={action.label}
            label={action.label}
            variant={action.variant ?? 'flat'}
            small
            onPress={action.onPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.suggest.bg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.suggest.fg,
    borderStyle: 'dashed',
    padding: space[4],
    gap: space[3],
  },
  text: { ...type.body, color: colors.suggest.fg },
  actions: { flexDirection: 'row', gap: space[2] },
});
