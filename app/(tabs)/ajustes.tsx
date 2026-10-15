import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, size, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { PoliMascot } from '../../components/PoliMascot';
import { Button } from '../../components/Button';
import { CheckIcon, ChevronRightIcon } from '../../components/icons';
import { fromISODate, monthShort } from '../../lib/date';

function renewalLabel(iso: string): string {
  const d = fromISODate(iso);
  return `Se renueva el ${d.getDate()} ${monthShort(iso).toLowerCase()} ${d.getFullYear()}`;
}

export default function AjustesScreen() {
  const insets = useSafeAreaInsets();
  const settings = useAppStore((s) => s.settings);
  const setName = useAppStore((s) => s.setName);
  const setSaludoOn = useAppStore((s) => s.setSaludoOn);
  const setSaludoHora = useAppStore((s) => s.setSaludoHora);
  const restorePurchases = useAppStore((s) => s.restorePurchases);
  const resetAllData = useAppStore((s) => s.resetAllData);
  const toast = (text: string) => useAppStore.setState({ toast: { id: `t${Date.now()}`, text } });

  const [confirmDelete, setConfirmDelete] = useState(false);
  const isPro = settings.plan === 'pro';

  async function confirmDeleteAll() {
    await resetAllData();
    router.replace('/(onboarding)/bienvenida');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4] }]}>
      <Text style={styles.header}>Ajustes</Text>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={isPro ? styles.proCard : styles.card}>
          {isPro ? (
            <>
              <View style={styles.planRow}>
                <PoliMascot mood="celebrating" size={56} />
                <View style={styles.planInfo}>
                  <View style={styles.proChip}>
                    <Text style={styles.proChipLabel}>Poli Pro activo 🐚</Text>
                  </View>
                  {settings.renewsAt ? <Text style={styles.renewLabel}>{renewalLabel(settings.renewsAt)}</Text> : null}
                </View>
              </View>
              <Pressable
                onPress={() => toast('Próximamente')}
                accessibilityRole="button"
                accessibilityLabel="Gestionar suscripción"
                style={styles.linkButton}
                hitSlop={8}
              >
                <Text style={styles.link}>Gestionar suscripción</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.planRow}>
                <PoliMascot mood="resting" size={56} filled={0} />
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>Plan actual: Poli Básico</Text>
                  <Text style={styles.planDetail}>Hasta 3 tareas al día</Text>
                </View>
              </View>
              <Button label="Pasar a Poli Pro ✨" onPress={() => router.push('/paywall')} />
              <Pressable
                onPress={restorePurchases}
                accessibilityRole="button"
                accessibilityLabel="Restaurar compras"
                style={styles.linkButtonCenter}
                hitSlop={8}
              >
                <Text style={styles.link}>Restaurar compras</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Poli y rutina</Text>
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Tu nombre</Text>
              <TextInput
                value={settings.name}
                onChangeText={setName}
                maxLength={24}
                placeholder="¿Cómo te llamo?"
                placeholderTextColor={colors.ink[4]}
                style={styles.nameInput}
                accessibilityLabel="Tu nombre"
              />
            </View>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text id="saludo-label" style={styles.rowTitle}>
                  Saludo matutino
                </Text>
                <Text style={styles.rowHint}>Poli te pide las tareas del día</Text>
              </View>
              <TextInput
                value={settings.saludoHora}
                onChangeText={setSaludoHora}
                editable={settings.saludoOn}
                maxLength={5}
                style={[styles.timeInput, !settings.saludoOn ? styles.timeInputDisabled : null]}
                accessibilityLabel="Hora del saludo"
              />
              <Switch
                value={settings.saludoOn}
                onValueChange={setSaludoOn}
                trackColor={{ false: colors.track, true: colors.action.bg }}
                accessibilityLabelledBy="saludo-label"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Privacidad y sistema</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={[styles.rowTitle, styles.flex1]}>Micrófono</Text>
              <View style={styles.micChip}>
                <CheckIcon size={16} color={colors.brand[800]} />
                <Text style={styles.micChipLabel}>Activo</Text>
              </View>
            </View>
            {isPro ? (
              <Pressable onPress={restorePurchases} accessibilityRole="button" style={styles.row}>
                <Text style={[styles.rowTitle, styles.flex1]}>Restaurar compras</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={() => toast('Próximamente')} accessibilityRole="button" style={styles.row}>
              <Text style={[styles.rowTitle, styles.flex1]}>Política de privacidad</Text>
              <ChevronRightIcon size={20} color={colors.ink[3]} />
            </Pressable>
            <Pressable onPress={() => toast('Próximamente')} accessibilityRole="button" style={styles.row}>
              <Text style={[styles.rowTitle, styles.flex1]}>Términos de uso</Text>
              <ChevronRightIcon size={20} color={colors.ink[3]} />
            </Pressable>
          </View>
          <Text style={styles.privacyCaption}>Tu voz se procesa de forma privada y no se almacena para publicidad.</Text>
        </View>

        <View style={styles.section}>
          {!confirmDelete ? (
            <Pressable onPress={() => setConfirmDelete(true)} accessibilityRole="button" style={styles.dangerLink}>
              <Text style={styles.dangerLinkLabel}>Borrar mis datos y reiniciar a Poli</Text>
            </Pressable>
          ) : (
            <View style={styles.dangerCard}>
              <Text style={styles.dangerTitle}>¿Borrar todo y empezar de cero?</Text>
              <Text style={styles.dangerBody}>Se eliminan tus tareas y tu nombre. Esto no se puede deshacer.</Text>
              <View style={styles.dangerActions}>
                <View style={styles.dangerActionFlex}>
                  <Button label="Cancelar" variant="secondary" onPress={() => setConfirmDelete(false)} />
                </View>
                <View style={styles.dangerActionFlex}>
                  <Button label="Sí, borrar" onPress={confirmDeleteAll} />
                </View>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.version}>Pendilo v1.0.0 · Hecho con calma</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  header: { ...type.section, color: colors.ink[1], marginBottom: space[4] },
  scroll: { gap: space[5], paddingBottom: space[12] },
  card: { backgroundColor: colors.surface, borderRadius: radius.panel, padding: space[4], gap: space[3] },
  proCard: { backgroundColor: colors.panel, borderRadius: radius.panel, padding: space[4], gap: space[3] },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  planInfo: { flex: 1, gap: 2 },
  planName: { ...type.card, color: colors.ink[1] },
  planDetail: { ...type.meta, color: colors.ink[2] },
  proChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.action.bg,
    borderRadius: radius.chip,
    paddingHorizontal: space[3],
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proChipLabel: { ...type.caption, color: colors.action.fg },
  renewLabel: { ...type.meta, color: colors.ink[2] },
  linkButton: { alignSelf: 'flex-start' },
  linkButtonCenter: { alignSelf: 'center' },
  link: { ...type.card, color: colors.brand[800] },
  section: { gap: space[2] },
  sectionLabel: { ...type.overline, color: colors.ink[2], marginLeft: space[1] },
  field: { gap: space[1], paddingBottom: space[2], borderBottomWidth: 1, borderBottomColor: colors.line },
  fieldLabel: { ...type.meta, color: colors.ink[2] },
  nameInput: { ...type.card, color: colors.ink[1], minHeight: size.touch },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    minHeight: size.touch + 12,
    paddingVertical: space[1],
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { ...type.card, color: colors.ink[1] },
  rowHint: { ...type.meta, color: colors.ink[2] },
  flex1: { flex: 1 },
  timeInput: {
    height: 44,
    minWidth: 68,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.chip,
    paddingHorizontal: space[2],
    ...type.card,
    color: colors.ink[1],
    textAlign: 'center',
  },
  timeInputDisabled: { color: colors.ink[4], backgroundColor: colors.paper },
  micChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    height: 32,
    paddingHorizontal: space[3],
    borderRadius: radius.chip,
    backgroundColor: colors.panel,
  },
  micChipLabel: { ...type.caption, color: colors.brand[800] },
  privacyCaption: { ...type.meta, color: colors.ink[2], marginHorizontal: space[1] },
  dangerLink: { minHeight: size.touch, alignItems: 'center', justifyContent: 'center' },
  dangerLinkLabel: { ...type.card, color: colors.danger.fg },
  dangerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.panel,
    borderWidth: 1.5,
    borderColor: colors.danger.fg,
    padding: space[4],
    gap: space[3],
  },
  dangerTitle: { ...type.card, color: colors.ink[1] },
  dangerBody: { ...type.bodySm, color: colors.ink[2] },
  dangerActions: { flexDirection: 'row', gap: space[2] },
  dangerActionFlex: { flex: 1 },
  version: { ...type.caption, color: colors.ink[4], textAlign: 'center' },
});
