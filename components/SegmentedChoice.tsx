import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, space, size, type } from '../theme/tokens';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  accessibilityLabel?: string;
}

interface SegmentedChoiceProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedChoice<T extends string>({ options, value, onChange }: SegmentedChoiceProps<T>) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={option.accessibilityLabel ?? option.label}
            style={[styles.option, selected ? styles.optionSelected : null]}
          >
            <Text style={[styles.label, selected ? styles.labelSelected : null]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space[2], flexWrap: 'wrap' },
  option: {
    minHeight: size.touch,
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: { backgroundColor: colors.action.bg },
  label: { ...type.bodySm, color: colors.brand[800] },
  labelSelected: { color: colors.action.fg },
});
