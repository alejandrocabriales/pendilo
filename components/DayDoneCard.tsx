import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, radius, shadow, size, space, type } from '../theme/tokens';
import { PendiloMascot } from './PendiloMascot';
import { Button } from './Button';
import { MicIcon } from './icons';
import { copy } from '../data/copy';

interface DayDoneCardProps {
  onMic: () => void;
  onAddTask: (title: string) => void;
}

/** Reemplaza la lista de hoy cuando ya no queda nada pendiente: invita a sumar algo nuevo, de voz o por texto. */
export function DayDoneCard({ onMic, onAddTask }: DayDoneCardProps) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    onAddTask(title);
    setDraft('');
  };

  return (
    <View style={styles.card}>
      <PendiloMascot mood="celebrating" size={72} />
      <Text style={styles.title}>{copy.celebration.day.title}</Text>
      <Text style={styles.body}>{copy.celebration.day.body}</Text>

      <Pressable
        onPress={onMic}
        accessibilityRole="button"
        accessibilityLabel="Agregar algo con tu voz"
        style={({ pressed }) => [styles.mic, pressed ? styles.micPressed : null]}
      >
        <MicIcon size={30} color={colors.action.fg} />
      </Pressable>
      <Text style={styles.micHint}>Tocá para sumar algo con tu voz</Text>

      <View style={styles.divider} />

      <View style={styles.inputRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={submit}
          placeholder="O escribí una tarea…"
          placeholderTextColor={colors.ink[4]}
          style={styles.input}
          returnKeyType="done"
          accessibilityLabel="Escribir una tarea nueva"
        />
        <Button label="Agregar" small variant="secondary" disabled={draft.trim().length === 0} onPress={submit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.panel,
    padding: space[6],
    alignItems: 'center',
    gap: space[2],
  },
  title: { ...type.section, color: colors.ink[1], textAlign: 'center' },
  body: { ...type.body, color: colors.ink[2], textAlign: 'center', marginBottom: space[2] },
  mic: {
    width: size.mic,
    height: size.mic,
    borderRadius: radius.pill,
    backgroundColor: colors.action.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space[2],
    ...shadow.fab,
  },
  micPressed: { opacity: 0.9 },
  micHint: { ...type.caption, color: colors.ink[3], marginTop: space[2] },
  divider: { height: 1, backgroundColor: colors.line, alignSelf: 'stretch', marginVertical: space[5] },
  inputRow: { flexDirection: 'row', gap: space[2], alignSelf: 'stretch', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.chip,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    ...type.body,
    color: colors.ink[1],
  },
});
