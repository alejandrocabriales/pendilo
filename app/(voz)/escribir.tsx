import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { Button } from '../../components/Button';
import { ShortcutChips } from '../../components/ShortcutChips';
import { CloseIcon } from '../../components/icons';

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
      <Pressable
        onPress={() => router.replace('/(tabs)')}
        accessibilityRole="button"
        accessibilityLabel="Cancelar"
        style={styles.close}
        hitSlop={8}
      >
        <CloseIcon size={24} color={colors.ink[2]} />
      </Pressable>

      <View style={styles.inputBox}>
        <TextInput
          autoFocus
          multiline
          value={draft}
          onChangeText={setDraft}
          placeholder="Escribe tu tarea..."
          placeholderTextColor={colors.ink[4]}
          style={styles.input}
          textAlignVertical="top"
          accessibilityLabel="Qué quieres agregar"
        />
      </View>

      <ShortcutChips onSelect={(prefix) => setDraft((d) => (d.length > 0 ? `${d} ${prefix}` : prefix))} />

      <Button
        label="Agregar tarea"
        onPress={submit}
        disabled={draft.trim().length === 0}
        disabledHint="Escribe algo primero"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5], gap: space[5] },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  inputBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.brand[700],
    borderRadius: radius.panel,
    backgroundColor: colors.surface,
    padding: space[5],
  },
  input: { flex: 1, ...type.body, fontSize: 20, lineHeight: 27, color: colors.ink[1] },
});
