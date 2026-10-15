import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { ErrorState } from '../../components/ErrorState';
import { copy } from '../../data/copy';
import type { VoiceErrorKind } from '../../types/domain';

function goToEscuchando() {
  router.replace('/(voz)/escuchando');
}
function goToProcesando() {
  router.replace('/(voz)/procesando');
}
function goHome() {
  router.replace('/(tabs)');
}

export default function ErrorScreen() {
  const insets = useSafeAreaInsets();
  const voice = useAppStore((s) => s.voice);
  const cancelVoiceSession = useAppStore((s) => s.cancelVoiceSession);
  const restartRecording = useAppStore((s) => s.restartRecording);
  const retryProcessing = useAppStore((s) => s.retryProcessing);

  const kind: VoiceErrorKind = voice.error ?? 'silence';
  const texts = copy.errors[kind];

  function handlePrimary() {
    if (kind === 'silence') {
      restartRecording();
      goToEscuchando();
    } else if (kind === 'perm') {
      Linking.openSettings().catch(() => {});
      restartRecording();
      goToEscuchando();
    } else {
      // offline | transcribe: conserva la transcripción y reintenta el "procesamiento".
      retryProcessing();
      goToProcesando();
    }
  }

  function handleSecondary() {
    if (kind === 'transcribe') {
      restartRecording();
      goToEscuchando();
      return;
    }
    cancelVoiceSession();
    goHome();
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <ErrorState
        title={texts.title}
        body={texts.body}
        primaryLabel={texts.primary}
        onPrimary={handlePrimary}
        secondaryLabel={texts.secondary}
        onSecondary={handleSecondary}
        preservedTranscript={(kind === 'offline' || kind === 'transcribe') && voice.transcript ? voice.transcript : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5], justifyContent: 'center' },
});
