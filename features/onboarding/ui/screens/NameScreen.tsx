import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, space, type } from '../../../../theme/tokens';
import { Button } from '../../../../components/Button';
import { OnboardingProgress } from '../components/OnboardingProgress';
import { MascotStage } from '../components/MascotStage';
import { useOnboarding } from '../useOnboarding';
import { isNameValid, nameGreeting } from '../../domain/useCases';

const TOTAL_STEPS = 5;

export default function NameScreen() {
  const insets = useSafeAreaInsets();
  const name = useOnboarding((s) => s.name);
  const setName = useOnboarding((s) => s.setName);

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <OnboardingProgress
        step={3}
        totalSteps={TOTAL_STEPS}
        onBack={() => router.replace('/(onboarding)/asi-funciona')}
        onSkip={() => router.replace('/(onboarding)/primera-tarea')}
      />

      <View style={styles.content}>
        <MascotStage height={232} mascotSize={210} mood="organizing" label="Poli, con la caracola vacía" />

        <View style={styles.copy}>
          <Text style={styles.title}>¿Cómo te llamo?</Text>
          <Text style={styles.body}>Así te saludaré cuando abras Pendilo.</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tu nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Por ejemplo, Manu"
            placeholderTextColor={colors.ink[4]}
            autoComplete="given-name"
            style={styles.input}
            accessibilityLabel="Tu nombre"
          />
          <Text style={styles.hint}>{nameGreeting(name)}</Text>
        </View>

        <View style={styles.cta}>
          <Button
            label="Continuar"
            onPress={() => router.replace('/(onboarding)/microfono')}
            disabled={!isNameValid(name)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  content: { flex: 1, minHeight: 0, gap: space[5], paddingTop: space[3] },
  copy: { gap: space[1] },
  title: { ...type.titleLg, fontSize: 30, lineHeight: 33, color: colors.ink[1] },
  body: { ...type.body, color: colors.ink[2] },
  field: { gap: space[2] },
  label: { fontFamily: fonts.body[600], fontSize: 14, color: colors.ink[1] },
  input: {
    height: 56,
    borderRadius: radius.panel,
    borderWidth: 1.5,
    borderColor: colors.brand[700],
    backgroundColor: colors.surface,
    paddingHorizontal: space[4],
    fontFamily: fonts.body[400],
    fontSize: 18,
    color: colors.ink[1],
  },
  hint: { ...type.bodySm, color: colors.ink[2] },
  cta: { marginTop: 'auto' },
});
