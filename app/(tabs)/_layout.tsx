import React from 'react';
import { Tabs, router } from 'expo-router';
import { BottomNavigation, TabKey } from '../../components/BottomNavigation';
import { QuickAddSheet } from '../../components/QuickAddSheet';
import { useAppStore } from '../../state/useAppStore';

const ROUTE_TO_TAB: Record<string, TabKey> = { index: 'hoy', semana: 'semana', progreso: 'progreso' };
const TAB_TO_ROUTE: Record<TabKey, string> = { hoy: 'index', semana: 'semana', progreso: 'progreso' };

export default function TabsLayout() {
  const quickAddOpen = useAppStore((s) => s.quickAddOpen);
  const setQuickAddOpen = useAppStore((s) => s.setQuickAddOpen);
  const addQuickTask = useAppStore((s) => s.addQuickTask);

  return (
    <>
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
              onAddTask={() => setQuickAddOpen(true)}
            />
          );
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Hoy' }} />
        <Tabs.Screen name="semana" options={{ title: 'Semana' }} />
        <Tabs.Screen name="progreso" options={{ title: 'Progreso' }} />
      </Tabs>

      <QuickAddSheet
        visible={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={addQuickTask}
        onMic={() => router.push('/(voz)/escuchando')}
      />
    </>
  );
}
