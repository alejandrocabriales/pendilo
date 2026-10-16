import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { colors, space, type, motion } from '../theme/tokens';
import { PoliMascot } from './PoliMascot';
import { Button } from './Button';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CompletionCelebrationProps {
  title: string;
  body: string;
  onClose: () => void;
}

function Ring({ delay, reducedMotion }: { delay: number; reducedMotion: boolean }) {
  const scale = useSharedValue<number>(motion.ring.from);
  const opacity = useSharedValue<number>(0.5);

  useEffect(() => {
    if (reducedMotion) return;
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(motion.ring.to, { duration: motion.ring.duration, easing: Easing.out(Easing.ease) }), -1)
    );
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, { duration: motion.ring.duration, easing: Easing.out(Easing.ease) }), -1)
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0 : opacity.value,
    transform: [{ scale: reducedMotion ? 1 : scale.value }],
  }));

  return <Animated.View style={[styles.ring, style]} />;
}

/** Diálogo modal con foco en "Seguir" (sección 8 del handoff). */
export function CompletionCelebration({ title, body, onClose }: CompletionCelebrationProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.backdrop} accessibilityViewIsModal accessibilityRole="alert">
        <View style={styles.card}>
          <View style={styles.mascotWrap}>
            <Ring delay={0} reducedMotion={reducedMotion} />
            <Ring delay={motion.ring.stagger} reducedMotion={reducedMotion} />
            <Ring delay={motion.ring.stagger * 2} reducedMotion={reducedMotion} />
            <PoliMascot mood="celebrating" size={210} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <Button label="Seguir" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(22,22,28,0.45)', alignItems: 'center', justifyContent: 'center', padding: space[6] },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: space[6],
    padding: space[6],
    alignItems: 'center',
    gap: space[3],
  },
  mascotWrap: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: colors.brand[500],
  },
  title: { ...type.title, color: colors.ink[1], textAlign: 'center' },
  body: { ...type.body, color: colors.ink[2], textAlign: 'center' },
});
