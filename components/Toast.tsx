import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { colors, radius, space, type, motion } from '../theme/tokens';
import { useAppStore } from '../state/useAppStore';

/** Toast global: se renderiza una sola vez (ver app/_layout.tsx) y lee su estado del store. */
export function Toast() {
  const toast = useAppStore((s) => s.toast);
  const dismissToast = useAppStore((s) => s.dismissToast);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    if (!toast) return;
    opacity.value = withTiming(1, { duration: motion.toast.enter, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(0, { duration: motion.toast.enter, easing: Easing.out(Easing.ease) });
    const timer = setTimeout(() => dismissToast(), motion.toast.visible);
    return () => clearTimeout(timer);
  }, [toast?.id]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!toast) return null;

  return (
    <Animated.View style={[styles.container, style]} accessibilityLiveRegion="polite" pointerEvents="box-none">
      <View style={styles.pill}>
        <Text style={styles.text} numberOfLines={2}>
          {toast.text}
        </Text>
        {toast.onUndo ? (
          <Pressable
            onPress={() => {
              toast.onUndo?.();
            }}
            accessibilityRole="button"
            accessibilityLabel="Deshacer"
            hitSlop={8}
          >
            <Text style={styles.undo}>Deshacer</Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: space[5], right: space[5], bottom: space[8] },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    backgroundColor: colors.toast.bg,
    borderRadius: radius.pill,
    paddingVertical: space[3],
    paddingHorizontal: space[5],
  },
  text: { ...type.bodySm, color: colors.toast.fg, flexShrink: 1 },
  undo: { ...type.caption, color: colors.toast.action },
});
