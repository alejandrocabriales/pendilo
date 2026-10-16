import * as Haptics from 'expo-haptics';
import { AccessibilityInfo } from 'react-native';

// Quien pide "reducir movimiento" suele venir de sensibilidad vestibular/sensorial;
// la háptica es otra forma de estímulo físico, así que se respeta el mismo ajuste.
let reducedMotionEnabled = false;
AccessibilityInfo.isReduceMotionEnabled().then((value) => {
  reducedMotionEnabled = value;
});
AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
  reducedMotionEnabled = value;
});

async function fire(trigger: () => Promise<void>) {
  if (reducedMotionEnabled) return;
  try {
    await trigger();
  } catch {
    // Sin soporte (web, simulador, hardware en silencio): no hacer nada.
  }
}

export const haptics = {
  light: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  // Impacto más marcado: solo para acciones destructivas (borrar), nunca para confirmaciones comunes.
  medium: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  success: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  selection: () => fire(() => Haptics.selectionAsync()),
};
