import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space, type } from '../../../../theme/tokens';
import { Button } from '../../../../components/Button';
import { OnboardingProgress } from '../components/OnboardingProgress';
import { MascotStage } from '../components/MascotStage';

const TOTAL_STEPS = 5;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <OnboardingProgress step={1} totalSteps={TOTAL_STEPS} onSkip={() => router.replace('/(onboarding)/primera-tarea')} />

      <View style={styles.content}>
        <MascotStage height={352} mascotSize={300} mood="organizing" label="Poli, una Polymita sonriente, con la caracola vacía" />

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>Hola, soy Poli</Text>
          <Text style={styles.title}>Habla. Pendilo organiza. Tú haces.</Text>
          <Text style={styles.body}>Cada tarea que cumplas pinta un poco más mi caracola.</Text>
        </View>

        <View style={styles.cta}>
          <Button label="Empezar" onPress={() => router.replace('/(onboarding)/asi-funciona')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  content: { flex: 1, minHeight: 0, gap: space[5], paddingTop: space[3] },
  copy: { gap: space[2] },
  eyebrow: { fontFamily: fonts.body[600], fontSize: 18, color: colors.brand[800] },
  title: { ...type.titleLg, fontSize: 34, lineHeight: 37, color: colors.ink[1] },
  body: { ...type.body, color: colors.ink[2] },
  cta: { marginTop: 'auto' },
});
