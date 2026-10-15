import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, poli, radius, space, type } from '../../../../theme/tokens';
import { Button } from '../../../../components/Button';
import { PoliMascot } from '../../../../components/PoliMascot';
import { OnboardingProgress } from '../components/OnboardingProgress';
import { DemoTaskRow } from '../components/DemoTaskRow';
import { useOnboarding } from '../useOnboarding';
import { bandsForProgress, demoDoneCount, demoMessage, demoMood } from '../../domain/useCases';

const TOTAL_STEPS = 5;
const TOTAL_DEMO_TASKS = 3;

export default function HowItWorksScreen() {
  const insets = useSafeAreaInsets();
  const demoTasks = useOnboarding((s) => s.demoTasks);
  const toggleDemoTask = useOnboarding((s) => s.toggleDemoTask);

  const doneCount = demoDoneCount(demoTasks);
  const mood = demoMood(doneCount, TOTAL_DEMO_TASKS);
  const message = demoMessage(doneCount, TOTAL_DEMO_TASKS);

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <OnboardingProgress
        step={2}
        totalSteps={TOTAL_STEPS}
        onBack={() => router.replace('/(onboarding)/bienvenida')}
        onSkip={() => router.replace('/(onboarding)/primera-tarea')}
      />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={styles.title}>Cada tarea pinta mi caracola</Text>
          <Text style={styles.body}>Toca una tarea de ejemplo y mírame.</Text>
        </View>

        <View style={styles.demoCard}>
          <PoliMascot
            mood={mood}
            size={148}
            filled={bandsForProgress(doneCount, TOTAL_DEMO_TASKS)}
            accessibilityLabel={`Poli, ${doneCount} de ${TOTAL_DEMO_TASKS} tareas de ejemplo hechas. ${message}`}
          />
          <View style={styles.demoBody}>
            <View style={styles.demoCount}>
              <Text style={styles.demoNumber}>{doneCount}</Text>
              <Text style={styles.demoOf}>de {TOTAL_DEMO_TASKS}</Text>
            </View>
            <View style={styles.segments}>
              {demoTasks.map((t, i) => (
                <View
                  key={t.id}
                  style={[
                    styles.segment,
                    { backgroundColor: t.done ? poli.stripes[bandsForProgress(i + 1, TOTAL_DEMO_TASKS) - 1].fill : colors.surface },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.demoMessage}>{message}</Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listLabel}>Tareas de ejemplo</Text>
          {demoTasks.map((t) => (
            <DemoTaskRow key={t.id} title={t.title} done={t.done} onToggle={() => toggleDemoTask(t.id)} />
          ))}
        </View>

        <View style={styles.cta}>
          <Button label="Siguiente" onPress={() => router.replace('/(onboarding)/nombre')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  content: { flex: 1, minHeight: 0, gap: space[4], paddingTop: space[3] },
  copy: { gap: space[1] },
  title: { ...type.titleLg, fontSize: 28, lineHeight: 31, color: colors.ink[1] },
  body: { ...type.body, color: colors.ink[2] },
  demoCard: {
    backgroundColor: colors.panel,
    borderRadius: radius.panel,
    padding: space[3],
    paddingLeft: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  demoBody: { flex: 1, minWidth: 0, gap: space[2] },
  demoCount: { flexDirection: 'row', alignItems: 'baseline', gap: space[2] },
  demoNumber: { fontFamily: fonts.display[700], fontSize: 44, lineHeight: 44, letterSpacing: -0.88, color: colors.ink[1] },
  demoOf: { fontFamily: fonts.body[600], fontSize: 20, color: colors.ink[2] },
  segments: { flexDirection: 'row', gap: space[1] },
  segment: { flex: 1, height: 8, borderRadius: 4 },
  demoMessage: { ...type.bodySm, color: colors.ink[2] },
  list: { gap: space[2] },
  listLabel: { fontFamily: fonts.body[600], fontSize: 14, color: colors.ink[2] },
  cta: { marginTop: 'auto' },
});
