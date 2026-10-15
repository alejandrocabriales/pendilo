import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../../../../theme/tokens';
import { PoliMascot } from '../../../../components/PoliMascot';
import type { Mood } from '../../../../types/domain';

interface MascotStageProps {
  height: number;
  mascotSize: number;
  mood: Mood;
  filled?: number;
  label: string;
  children?: ReactNode;
}

/** Panel redondeado con Poli al centro; usado en los 4 pasos que no son la demo de tareas. */
export function MascotStage({ height, mascotSize, mood, filled = 0, label, children }: MascotStageProps) {
  return (
    <View style={[styles.stage, { height }]}>
      <PoliMascot mood={mood} size={mascotSize} filled={filled} accessibilityLabel={label} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: colors.panel,
    borderRadius: radius.panel,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
