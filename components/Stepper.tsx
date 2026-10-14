import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, space, size, type } from '../theme/tokens';

interface StepperProps {
  label: string;
  valueLabel: string;
  onMinus: () => void;
  onPlus: () => void;
  minusDisabled?: boolean;
  plusDisabled?: boolean;
  /** Etiqueta accesible del paso, p. ej. "30 minutos antes". */
  stepAccessibilityLabel?: string;
}

export function Stepper({
  label,
  valueLabel,
  onMinus,
  onPlus,
  minusDisabled,
  plusDisabled,
  stepAccessibilityLabel,
}: StepperProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <Pressable
          onPress={minusDisabled ? undefined : onMinus}
          disabled={minusDisabled}
          accessibilityRole="button"
          accessibilityLabel={stepAccessibilityLabel ? `Restar, ${stepAccessibilityLabel}` : 'Restar'}
          style={[styles.btn, minusDisabled ? styles.btnDisabled : null]}
        >
          <Text style={[styles.btnLabel, minusDisabled ? styles.btnLabelDisabled : null]}>−</Text>
        </Pressable>
        <Text style={styles.value}>{valueLabel}</Text>
        <Pressable
          onPress={plusDisabled ? undefined : onPlus}
          disabled={plusDisabled}
          accessibilityRole="button"
          accessibilityLabel={stepAccessibilityLabel ? `Sumar, ${stepAccessibilityLabel}` : 'Sumar'}
          style={[styles.btn, plusDisabled ? styles.btnDisabled : null]}
        >
          <Text style={[styles.btnLabel, plusDisabled ? styles.btnLabelDisabled : null]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3] },
  label: { ...type.body, color: colors.ink[1], flexShrink: 1 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  btn: {
    width: size.touch,
    height: size.touch,
    borderRadius: radius.pill,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: colors.disabled.bg },
  btnLabel: { ...type.card, color: colors.brand[800] },
  btnLabelDisabled: { color: colors.disabled.fg },
  value: { ...type.card, color: colors.ink[1], minWidth: 48, textAlign: 'center' },
});
