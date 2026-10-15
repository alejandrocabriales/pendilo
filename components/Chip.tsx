import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';

export type ChipKind = 'said' | 'suggested' | 'missing';

interface ChipProps {
  kind: ChipKind;
  label: string;
}

const KIND_META: Record<ChipKind, { bg: string; fg: string; border: string; borderStyle?: 'dashed'; symbol: string; a11y: string }> = {
  said: { bg: colors.surface, fg: colors.brand[800], border: colors.brand[700], symbol: '✓', a11y: 'Dicho' },
  suggested: {
    bg: colors.suggest.bg,
    fg: colors.suggest.fg,
    border: colors.suggest.fg,
    borderStyle: 'dashed',
    symbol: '✦',
    a11y: 'Sugerido',
  },
  missing: { bg: colors.danger.bg, fg: colors.danger.fg, border: colors.danger.fg, symbol: '!', a11y: 'Falta' },
};

// El legend de la pantalla de revisión enseña "sólido = lo dijiste, punteado = sugerencia":
// said y missing llevan borde sólido, suggested punteado — ninguno se distingue solo por el relleno.
export function Chip({ kind, label }: ChipProps) {
  const meta = KIND_META[kind];
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: meta.bg, borderWidth: 1.5, borderColor: meta.border, borderStyle: meta.borderStyle ?? 'solid' },
      ]}
      accessibilityLabel={`${meta.a11y}: ${label}`}
    >
      <Text style={[styles.symbol, { color: meta.fg }]}>{meta.symbol}</Text>
      <Text style={[styles.label, { color: meta.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    borderRadius: radius.chip,
    alignSelf: 'flex-start',
  },
  symbol: { ...type.caption, fontSize: 12 },
  label: { ...type.caption },
});
