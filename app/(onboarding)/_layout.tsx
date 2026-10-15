import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../theme/tokens';

/** Paso a paso lineal: cada acción reemplaza la pantalla actual (sin pila de "volver"), sin gesto de swipe. */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'fade',
        contentStyle: { backgroundColor: colors.paper },
      }}
    />
  );
}
