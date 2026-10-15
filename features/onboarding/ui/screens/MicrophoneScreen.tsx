import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../../../theme/tokens';
import { Button } from '../../../../components/Button';
import { OnboardingProgress } from '../components/OnboardingProgress';
import { MascotStage } from '../components/MascotStage';

const TOTAL_STEPS = 5;

// Fase 1 no graba audio real (ver state/useAppStore.ts): este paso no pide permiso de
// micrófono de verdad todavía, solo explica el gesto. Las dos acciones llevan al mismo
// paso siguiente, igual que en el prototipo de diseño.
export default function MicrophoneScreen() {
  const insets = useSafeAreaInsets();
  const goNext = () => router.replace('/(onboarding)/primera-tarea');

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <OnboardingProgress
        step={4}
        totalSteps={TOTAL_STEPS}
        onBack={() => router.replace('/(onboarding)/nombre')}
        onSkip={() => router.replace('/(onboarding)/primera-tarea')}
      />

      <View style={styles.content}>
        <MascotStage height={300} mascotSize={250} mood="listening" label="Poli escuchando, con la caracola vacía" />

        <View style={styles.copy}>
          <Text style={styles.title}>Para escucharte necesito el micrófono</Text>
          <Text style={styles.body}>Solo escucho cuando tú tocas el botón. Si prefieres, también puedes escribir tus tareas.</Text>
        </View>

        <View style={styles.cta}>
          <Button label="Permitir micrófono" onPress={goNext} />
          <Button label="Ahora no, prefiero escribir" variant="flat" small onPress={goNext} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  content: { flex: 1, minHeight: 0, gap: space[5], paddingTop: space[3] },
  copy: { gap: space[2] },
  title: { ...type.titleLg, fontSize: 30, lineHeight: 33, color: colors.ink[1] },
  body: { ...type.body, color: colors.ink[2] },
  cta: { marginTop: 'auto', gap: space[2] },
});
