import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, space } from '../../../../theme/tokens';
import { BackIcon } from '../../../../components/icons';

interface OnboardingProgressProps {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  onSkip?: () => void;
}

/** Cabecera común de los 5 pasos: volver (opcional), puntos de avance y saltar (opcional). */
export function OnboardingProgress({ step, totalSteps, onBack, onSkip }: OnboardingProgressProps) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Volver" style={styles.iconBtn} hitSlop={8}>
            <BackIcon size={24} color={colors.brand[800]} />
          </Pressable>
        ) : null}
      </View>

      <View accessibilityRole="image" accessibilityLabel={`Paso ${step} de ${totalSteps}`} style={styles.dots}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === step ? 24 : 8,
                backgroundColor: i === step ? colors.brand[700] : i < step ? colors.brand[500] : colors.track,
              },
            ]}
          />
        ))}
      </View>

      <View style={[styles.side, styles.sideEnd]}>
        {onSkip ? (
          <Pressable onPress={onSkip} accessibilityRole="button" style={styles.skipBtn} hitSlop={8}>
            <Text style={styles.skipLabel}>Saltar</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44 },
  side: { width: 76, alignItems: 'flex-start' },
  sideEnd: { alignItems: 'flex-end' },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
  dot: { height: 8, borderRadius: 4 },
  skipBtn: { height: 44, paddingHorizontal: space[2], alignItems: 'center', justifyContent: 'center' },
  skipLabel: { fontFamily: fonts.body[600], fontSize: 16, color: colors.brand[800] },
});
