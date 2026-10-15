import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import { PendiloMascot } from './PendiloMascot';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  body: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Transcripción conservada (offline/transcribe): se muestra como "Lo que dijiste · guardado". */
  preservedTranscript?: string;
}

export function ErrorState({
  title,
  body,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  preservedTranscript,
}: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <PendiloMascot mood="thinking" size={72} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>

      {preservedTranscript ? (
        <View style={styles.preserved}>
          <Text style={styles.preservedLabel}>Lo que dijiste · guardado</Text>
          <Text style={styles.preservedBody}>{preservedTranscript}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button label={primaryLabel} onPress={onPrimary} />
        {secondaryLabel && onSecondary ? (
          <Button label={secondaryLabel} variant="flat" onPress={onSecondary} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: space[8], paddingHorizontal: space[6], gap: space[3] },
  title: { ...type.section, color: colors.ink[1], textAlign: 'center' },
  body: { ...type.body, color: colors.ink[2], textAlign: 'center' },
  preserved: {
    alignSelf: 'stretch',
    backgroundColor: colors.panel,
    borderRadius: radius.card,
    padding: space[4],
    gap: space[1],
    marginTop: space[2],
  },
  preservedLabel: { ...type.caption, color: colors.brand[800] },
  preservedBody: { ...type.bodySm, color: colors.ink[1] },
  actions: { marginTop: space[4], gap: space[2], width: '100%' },
});
