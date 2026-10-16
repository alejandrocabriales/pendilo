import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type as textType } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { VoiceProcessing } from '../../components/VoiceProcessing';
import { CloseIcon } from '../../components/icons';
import { copy } from '../../data/copy';

export default function ProcesandoScreen() {
  const insets = useSafeAreaInsets();
  const voice = useAppStore((s) => s.voice);
  const cancelVoiceSession = useAppStore((s) => s.cancelVoiceSession);
  const devSimulateError = useAppStore((s) => s.devSimulateError);

  useEffect(() => {
    if (voice.stage === 'review') router.replace('/(voz)/revision');
    if (voice.stage === 'error') router.replace('/(voz)/error');
  }, [voice.stage]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <Pressable
        onPress={() => {
          cancelVoiceSession();
          router.replace('/(tabs)');
        }}
        accessibilityRole="button"
        accessibilityLabel="Cancelar"
        style={styles.close}
        hitSlop={8}
      >
        <CloseIcon size={24} color={colors.ink[2]} />
      </Pressable>

      <View style={styles.content}>
        <VoiceProcessing text={copy.voice.processing} />
      </View>

      {__DEV__ ? (
        <View style={styles.devRow}>
          <Pressable onPress={() => devSimulateError('offline')} accessibilityRole="button" style={styles.devLink}>
            <Text style={styles.devLinkLabel}>Simular sin conexión (dev)</Text>
          </Pressable>
          <Pressable onPress={() => devSimulateError('transcribe')} accessibilityRole="button" style={styles.devLink}>
            <Text style={styles.devLinkLabel}>Simular fallo de transcripción (dev)</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.panel, paddingHorizontal: space[5] },
  close: { alignSelf: 'flex-end', width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center' },
  devRow: { gap: space[1] },
  devLink: { alignItems: 'center', paddingVertical: space[1] },
  devLinkLabel: { ...textType.caption, color: colors.ink[4] },
});
