import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { PoliMascot } from '../../components/PoliMascot';
import { Button } from '../../components/Button';
import { copy } from '../../data/copy';
import { fullDateLabel, todayISO } from '../../lib/date';

export default function EscribirScreen() {
  const insets = useSafeAreaInsets();
  const startTextSession = useAppStore((s) => s.startTextSession);
  const { prefix } = useLocalSearchParams<{ prefix?: string }>();
  const [draft, setDraft] = useState(prefix ?? '');

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    startTextSession(title);
    router.push('/(voz)/procesando');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <Text style={styles.dateCaption}>{fullDateLabel(todayISO())}</Text>

      <View style={styles.inputBox}>
        <TextInput
          autoFocus
          multiline
          value={draft}
          onChangeText={setDraft}
          placeholder="Escribe tu tarea…"
          placeholderTextColor={colors.ink[4]}
          style={styles.input}
          textAlignVertical="top"
          accessibilityLabel="Qué quieres agregar"
        />
      </View>

      <View style={styles.hintRow}>
        <PoliMascot mood="organizing" size={48} filled={0} />
        <Text style={styles.hintText}>{copy.write.hint}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="Agregar tarea"
          onPress={submit}
          disabled={draft.trim().length === 0}
          disabledHint="Escribe algo primero"
        />
        <Button label="Cancelar" variant="outline" onPress={() => router.replace('/(tabs)')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5], gap: space[4] },
  dateCaption: { ...type.bodySm, color: colors.ink[2], textAlign: 'center', fontFamily: type.card.fontFamily },
  inputBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.brand[700],
    borderRadius: radius.panel,
    backgroundColor: colors.surface,
    padding: space[4],
  },
  input: { flex: 1, ...type.body, fontSize: 20, lineHeight: 29, color: colors.ink[1] },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  hintText: { flex: 1, ...type.bodySm, color: colors.ink[2] },
  actions: { gap: space[3] },
});
