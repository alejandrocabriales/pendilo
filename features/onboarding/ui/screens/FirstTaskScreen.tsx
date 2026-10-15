import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { colors, fonts, motion, radius, shadow, size, space, type } from '../../../../theme/tokens';
import { Button } from '../../../../components/Button';
import { MicIcon } from '../../../../components/icons';
import { useReducedMotion } from '../../../../hooks/useReducedMotion';
import { OnboardingProgress } from '../components/OnboardingProgress';
import { MascotStage } from '../components/MascotStage';
import { useOnboarding } from '../useOnboarding';

const TOTAL_STEPS = 5;
const RING_SIZE = size.mic + 16;

function PulseRing() {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue<number>(motion.ring.from);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    if (reducedMotion) return;
    scale.value = withRepeat(withTiming(motion.ring.to, { duration: motion.ring.duration, easing: Easing.out(Easing.ease) }), -1);
    opacity.value = withRepeat(withTiming(0, { duration: motion.ring.duration, easing: Easing.out(Easing.ease) }), -1);
  }, [reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0 : opacity.value,
    transform: [{ scale: reducedMotion ? 1 : scale.value }],
  }));

  return <Animated.View style={[styles.ring, style]} />;
}

export default function FirstTaskScreen() {
  const insets = useSafeAreaInsets();
  const finish = useOnboarding((s) => s.finish);

  const startRecording = async () => {
    await finish();
    router.replace('/(voz)/escuchando');
  };
  const startWriting = async () => {
    await finish();
    router.replace('/(voz)/escribir');
  };
  const doItLater = async () => {
    await finish();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <OnboardingProgress step={5} totalSteps={TOTAL_STEPS} onBack={() => router.replace('/(onboarding)/microfono')} />

      <View style={styles.content}>
        <MascotStage height={236} mascotSize={204} mood="listening" label="Poli escuchando, con la caracola vacía">
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>¡Cuéntame!</Text>
          </View>
        </MascotStage>

        <View style={styles.copy}>
          <Text style={styles.title}>Dime qué tienes para hoy</Text>
          <Text style={styles.body}>Toca el micrófono y habla con naturalidad.</Text>
        </View>

        <View style={styles.suggest}>
          <Text style={styles.suggestLabel}>Prueba decir</Text>
          <Text style={styles.suggestBody}>«Hoy tengo que pagar la luz y llamar al dentista.»</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.recordWrap}>
            <PulseRing />
            <Pressable onPress={startRecording} accessibilityRole="button" accessibilityLabel="Empezar a grabar" style={styles.record}>
              <MicIcon size={32} color={colors.action.fg} />
            </Pressable>
          </View>
          <View style={styles.links}>
            <View style={styles.linkSlot}>
              <Button label="Prefiero escribir" variant="flat" small onPress={startWriting} />
            </View>
            <View style={styles.linkSlot}>
              <Button label="Lo haré después" variant="flat" small onPress={doItLater} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  content: { flex: 1, minHeight: 0, gap: space[4], paddingTop: space[3] },
  bubble: {
    position: 'absolute',
    right: space[3],
    top: space[3],
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    ...shadow.nav,
  },
  bubbleText: { fontFamily: fonts.body[600], fontSize: 14, color: colors.brand[800] },
  copy: { gap: space[1] },
  title: { ...type.titleLg, fontSize: 30, lineHeight: 33, color: colors.ink[1] },
  body: { ...type.body, color: colors.ink[2] },
  suggest: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.suggest.fg,
    backgroundColor: colors.suggest.bg,
    borderRadius: radius.day,
    padding: space[3],
    gap: space[1],
  },
  suggestLabel: { fontFamily: fonts.body[600], fontSize: 14, color: colors.suggest.fg },
  suggestBody: { ...type.body, color: colors.ink[1] },
  footer: { marginTop: 'auto', alignItems: 'center', gap: space[2] },
  recordWrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: size.mic,
    height: size.mic,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.brand[500],
  },
  record: {
    width: size.mic,
    height: size.mic,
    borderRadius: radius.pill,
    backgroundColor: colors.action.bg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
  links: { flexDirection: 'row', gap: space[1], width: '100%' },
  linkSlot: { flex: 1 },
});
