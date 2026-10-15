import React from 'react';
import { Tabs, router } from 'expo-router';
import { BottomNavigation, TabKey } from '../../components/BottomNavigation';
import { useAppStore } from '../../state/useAppStore';

const ROUTE_TO_TAB: Record<string, TabKey> = { index: 'hoy', semana: 'semana', ajustes: 'ajustes' };
const TAB_TO_ROUTE: Record<TabKey, string> = { hoy: 'index', semana: 'semana', ajustes: 'ajustes' };

export default function TabsLayout() {
  // El mic y escribir son dos de las formas de intentar crear una 4ª tarea del día:
  // con el plan gratis, redirigen al paywall de uso en vez de abrir el flujo de voz/texto.
  function goCreateTask(path: '/(voz)/escuchando' | '/(voz)/escribir') {
    if (!useAppStore.getState().canCreateTaskToday()) {
      router.push('/paywall');
      return;
    }
    router.push(path);
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false, animation: 'fade' }}
      tabBar={({ state, navigation }) => {
        const activeRouteName = state.routeNames[state.index];
        const active = ROUTE_TO_TAB[activeRouteName] ?? 'hoy';
        return (
          <BottomNavigation
            active={active}
            onChange={(tab) => navigation.navigate(TAB_TO_ROUTE[tab])}
            onMic={() => goCreateTask('/(voz)/escuchando')}
            onWrite={() => goCreateTask('/(voz)/escribir')}
          />
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hoy' }} />
      <Tabs.Screen name="semana" options={{ title: 'Semana' }} />
      <Tabs.Screen name="ajustes" options={{ title: 'Ajustes' }} />
    </Tabs>
  );
}
