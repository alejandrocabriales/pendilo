import React from 'react';
import { Tabs, router } from 'expo-router';
import { BottomNavigation, TabKey } from '../../components/BottomNavigation';

const ROUTE_TO_TAB: Record<string, TabKey> = { index: 'hoy', semana: 'semana' };
const TAB_TO_ROUTE: Record<TabKey, string> = { hoy: 'index', semana: 'semana' };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        const activeRouteName = state.routeNames[state.index];
        const active = ROUTE_TO_TAB[activeRouteName] ?? 'hoy';
        return (
          <BottomNavigation
            active={active}
            onChange={(tab) => navigation.navigate(TAB_TO_ROUTE[tab])}
            onMic={() => router.push('/(voz)/escuchando')}
            onWrite={() => router.push('/(voz)/escribir')}
          />
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hoy' }} />
      <Tabs.Screen name="semana" options={{ title: 'Semana' }} />
    </Tabs>
  );
}
