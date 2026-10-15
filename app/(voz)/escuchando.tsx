import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { RecordingBadge } from '../../components/RecordingBadge';
import { Button } from '../../components/Button';
import { CloseIcon, StopIcon } from '../../components/icons';
import { copy } from '../../data/copy';

export default function EscuchandoScreen() {
  const insets = useSafeAreaInsets();
  const voice = useAppStore((s) => s.voice);
  const startVoiceSession = useAppStore((s) => s.startVoiceSession);
  const stopRecording = useAppStore((s) => s.stopRecording);
  const cancelVoiceSession = useAppStore((s) => s.cancelVoiceSession);
  const devSimulateError = useAppStore((s) => s.devSimulateError);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      startVoiceSession();
    }
  }, []);

  useEffect(() => {
    if (voice.stage === 'processing') router.replace('/(voz)/procesando');
    if (voice.stage === 'error') router.replace('/(voz)/error');
  }, [voice.stage]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <View style={styles.header}>
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
        <RecordingBadge elapsedSec={voice.elapsedSec} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{copy.voice.listening}</Text>
        <VoiceRecorder transcript={voice.transcript} />
      </View>

      <View style={styles.footer}>
        <Button label="Detener" onPress={stopRecording} icon={<StopIcon size={14} color={colors.action.fg} />} />
        <Text style={styles.demoCaption}>Demo: no se graba audio real</Text>
        {__DEV__ ? (
          <Pressable onPress={() => devSimulateError('perm')} style={styles.devLink}>
            <Text style={styles.devLinkLabel}>Simular sin permiso de micrófono (dev)</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[6] },
  title: { ...type.voice, color: colors.ink[1], textAlign: 'center' },
  footer: { gap: space[3] },
  demoCaption: { ...type.caption, color: colors.ink[4], textAlign: 'center' },
  devLink: { alignItems: 'center', paddingVertical: space[2] },
  devLinkLabel: { ...type.caption, color: colors.ink[4] },
});
