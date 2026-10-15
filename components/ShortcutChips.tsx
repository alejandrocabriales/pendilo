import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, size, space, type } from '../theme/tokens';

/** Atajos de captura reusados en Hoy sin tareas (02), Esta semana (04) y Escribir (05). */
export const SHORTCUT_PREFIXES = ['Llamar a…', 'Comprar…', 'Enviar…', 'Pagar…'];

interface ShortcutChipsProps {
  onSelect: (prefix: string) => void;
}

export function ShortcutChips({ onSelect }: ShortcutChipsProps) {
  return (
    <View style={styles.row}>
      {SHORTCUT_PREFIXES.map((prefix) => (
        <Pressable
          key={prefix}
          onPress={() => onSelect(prefix)}
          accessibilityRole="button"
          accessibilityLabel={`Empezar tarea: ${prefix}`}
          style={({ pressed }) => [styles.chip, pressed ? styles.chipPressed : null]}
        >
          <Text style={styles.label}>{prefix}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: {
    minHeight: size.touch,
    paddingHorizontal: space[4],
    borderRadius: radius.chip,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipPressed: { opacity: 0.8 },
  label: { ...type.caption, color: colors.brand[800] },
});
