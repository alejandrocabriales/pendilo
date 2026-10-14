import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../theme/tokens';

/** Stack sin header y sin gesto de volver: la única salida es "Cancelar" (X). */
export default function VozLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    />
  );
}
