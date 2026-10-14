import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { usePendiloFonts } from '../theme/fonts';
import { colors } from '../theme/tokens';
import { useAppStore } from '../state/useAppStore';
import { Toast } from '../components/Toast';
import { CompletionCelebration } from '../components/CompletionCelebration';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const fontsLoaded = usePendiloFonts();
  const ready = useAppStore((s) => s.ready);
  const init = useAppStore((s) => s.init);
  const celebration = useAppStore((s) => s.celebration);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (fontsLoaded && ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, ready]);

  if (!fontsLoaded || !ready) return null;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(voz)" options={{ presentation: 'fullScreenModal' }} />
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
