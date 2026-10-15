import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { usePendiloFonts } from '../theme/fonts';
import { colors } from '../theme/tokens';
import { useAppStore } from '../state/useAppStore';
import { onboardingRepository } from '../features/onboarding';
import { Toast } from '../components/Toast';
import { CompletionCelebration } from '../components/CompletionCelebration';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const fontsLoaded = usePendiloFonts();
  const ready = useAppStore((s) => s.ready);
  const init = useAppStore((s) => s.init);
  const celebration = useAppStore((s) => s.celebration);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    onboardingRepository.isCompleted().then((completed) => {
      if (cancelled) return;
      if (!completed) router.replace('/(onboarding)/bienvenida');
      setOnboardingChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  useEffect(() => {
    if (fontsLoaded && ready && onboardingChecked) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, ready, onboardingChecked]);

  if (!fontsLoaded || !ready || !onboardingChecked) return null;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(voz)" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="paywall" options={{ presentation: 'modal', gestureEnabled: false }} />
        </Stack>
        <Toast />
        {celebration ? (
          <CompletionCelebration
            title={celebration.title}
            body={celebration.body}
            onClose={() => useAppStore.setState({ celebration: null })}
          />
        ) : null}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
