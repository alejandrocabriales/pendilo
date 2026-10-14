import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import { Button } from './Button';
import { MicIcon } from './icons';

interface QuickAddSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  onMic: () => void;
}

/** Modal liviano para sumar una tarea por texto desde cualquier pantalla; siempre ofrece la voz como atajo. */
export function QuickAddSheet({ visible, onClose, onSubmit, onMic }: QuickAddSheetProps) {
  const [draft, setDraft] = useState('');

  const close = () => {
    setDraft('');
    onClose();
  };

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    onSubmit(title);
    close();
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} accessibilityRole="button" accessibilityLabel="Cerrar">
        <View style={styles.card}>
          <Text style={styles.title}>Agregar tarea</Text>
          <TextInput
            autoFocus
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submit}
            placeholder="¿Qué tenés que hacer?"
            placeholderTextColor={colors.ink[4]}
            style={styles.input}
            returnKeyType="done"
            accessibilityLabel="Título de la tarea nueva"
          />
          <Button label="Agregar" onPress={submit} disabled={draft.trim().length === 0} />
          <Pressable
            onPress={() => {
              close();
              onMic();
            }}
            style={styles.micRow}
            accessibilityRole="button"
            accessibilityLabel="Agregar con tu voz en su lugar"
          >
            <MicIcon size={16} color={colors.brand[700]} />
            <Text style={styles.micRowLabel}>O contámelo con tu voz</Text>
          </Pressable>
          <Button label="Cancelar" variant="flat" small onPress={close} />
        </View>
      </Pressable>
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
    gap: space[3],
  },
  title: { ...type.section, color: colors.ink[1] },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.chip,
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    ...type.body,
    color: colors.ink[1],
  },
  micRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2], paddingVertical: space[2] },
  micRowLabel: { ...type.caption, color: colors.brand[700] },
});
