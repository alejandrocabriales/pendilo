import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, space, size, type } from '../../../../theme/tokens';

interface DemoTaskRowProps {
  title: string;
  done: boolean;
  onToggle: () => void;
}

/** Fila de tarea de ejemplo, tocable, para la demo del paso "Así funciona". */
export function DemoTaskRow({ title, done, onToggle }: DemoTaskRowProps) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={title}
      style={[styles.row, done ? styles.rowDone : null]}
    >
      <View style={[styles.checkbox, done ? styles.checkboxDone : null]}>{done ? <Text style={styles.checkMark}>✓</Text> : null}</View>
      <Text style={[styles.title, done ? styles.titleDone : null]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minHeight: 56,
    paddingHorizontal: space[3],
    borderRadius: radius.day,
    backgroundColor: colors.surface,
  },
  rowDone: { backgroundColor: colors.panel },
  checkbox: {
    width: size.checkbox,
    height: size.checkbox,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: colors.brand[700], borderColor: colors.brand[700] },
  checkMark: { color: colors.surface, fontSize: 14, fontWeight: '700' },
  title: { ...type.card, color: colors.ink[1], flex: 1 },
  titleDone: { textDecorationLine: 'line-through', color: colors.ink[2] },
});
