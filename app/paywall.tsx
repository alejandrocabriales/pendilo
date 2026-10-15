import React, { useState } from 'react';
import { View, Text, Switch, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, size, type } from '../theme/tokens';
import { useAppStore } from '../state/useAppStore';
import { PoliMascot } from '../components/PoliMascot';
import { Button } from '../components/Button';
import { CloseIcon, MicIcon, SpiralIcon, BellIcon } from '../components/icons';

const PRICE_PLACEHOLDER = '[PRECIO]';

const BENEFITS = [
  { Icon: MicIcon, label: 'Voz y organización con IA, sin límite' },
  { Icon: SpiralIcon, label: 'Caracolas y temas exclusivos para Poli' },
  { Icon: BellIcon, label: 'Recordatorios inteligentes según tu día' },
];

/**
 * Paywall de uso: aparece cuando alguien intenta crear más de 3 tareas en un día con el
 * plan gratis, y también desde Ajustes ("Pasar a Poli Pro"). Siempre deja seguir con las
 * 3 gratis de mañana; nunca bloquea del todo. Precio real: pendiente de definir (placeholder).
 */
export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const upgradeToPro = useAppStore((s) => s.upgradeToPro);
  const toast = (text: string) => useAppStore.setState({ toast: { id: `t${Date.now()}`, text } });
  const [remindBeforeTrialEnds, setRemindBeforeTrialEnds] = useState(true);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  const startTrial = async () => {
    await upgradeToPro();
    close();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[3], paddingBottom: insets.bottom + space[5] }]}>
      <Pressable
        onPress={close}
        accessibilityRole="button"
        accessibilityLabel="Cerrar y seguir con la versión gratis"
        style={styles.close}
        hitSlop={8}
      >
        <CloseIcon size={24} color={colors.ink[2]} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.badgeRow}>
          <PoliMascot mood="listening" filled={2} size={88} />
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Límite diario</Text>
          </View>
        </View>

        <Text style={styles.title}>Llegaste a tus 3 tareas de hoy</Text>
        <Text style={styles.subtitle}>Con Poli Pro creas todas las que quieras. Mañana vuelven tus 3 gratis.</Text>

        <View style={styles.benefits}>
          {BENEFITS.map(({ Icon, label }) => (
            <View key={label} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Icon size={22} color={colors.brand[800]} />
              </View>
              <Text style={styles.benefitLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reminderRow}>
          <Text id="paywall-remind" style={styles.reminderLabel}>
            Avísame 2 días antes de que termine la prueba
          </Text>
          <Switch
            value={remindBeforeTrialEnds}
            onValueChange={setRemindBeforeTrialEnds}
            trackColor={{ false: colors.track, true: colors.action.bg }}
            accessibilityLabelledBy="paywall-remind"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Probar 7 días gratis" onPress={startTrial} />
        <Text style={styles.priceLine}>
          Después, {PRICE_PLACEHOLDER} al mes. Cancela cuando quieras desde Ajustes.
        </Text>
        <Button label="Seguir mañana con las 3 gratis" variant="flat" onPress={close} />
        <View style={styles.linkRow}>
          <Pressable
            onPress={() => toast('No hay compras para restaurar')}
            accessibilityRole="button"
            accessibilityLabel="Restaurar compra"
            hitSlop={8}
          >
            <Text style={styles.link}>Restaurar compra</Text>
          </Pressable>
          <Pressable onPress={() => toast('Próximamente')} accessibilityRole="button" accessibilityLabel="Términos" hitSlop={8}>
            <Text style={styles.link}>Términos</Text>
          </Pressable>
          <Pressable onPress={() => toast('Próximamente')} accessibilityRole="button" accessibilityLabel="Privacidad" hitSlop={8}>
            <Text style={styles.link}>Privacidad</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  close: { alignSelf: 'flex-end', width: size.touch, height: size.touch, alignItems: 'center', justifyContent: 'center' },
  scroll: { gap: space[2], paddingBottom: space[4] },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  chip: {
    height: 32,
    paddingHorizontal: space[3],
    borderRadius: radius.chip,
    borderWidth: 1.5,
    borderColor: colors.brand[700],
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { ...type.caption, color: colors.brand[800] },
  title: { ...type.titleLg, fontSize: 28, lineHeight: 31, color: colors.ink[1], marginTop: space[1] },
  subtitle: { ...type.body, color: colors.ink[2] },
  benefits: { gap: space[2], marginTop: space[3] },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 52 },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitLabel: { ...type.card, color: colors.ink[1], flex: 1 },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
    backgroundColor: colors.surface,
    borderRadius: radius.day,
    paddingVertical: space[2],
    paddingLeft: space[4],
    paddingRight: space[2],
    marginTop: space[3],
  },
  reminderLabel: { ...type.caption, color: colors.ink[1], flex: 1 },
  footer: { gap: space[1] },
  priceLine: { ...type.meta, color: colors.ink[2], textAlign: 'center' },
  linkRow: { flexDirection: 'row', justifyContent: 'center', gap: space[4], marginTop: space[1] },
  link: { ...type.caption, color: colors.ink[2], textDecorationLine: 'underline' },
});
