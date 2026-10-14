import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, type } from '../theme/tokens';
import { Button } from './Button';
import { MicIcon } from './icons';
import { todayISO, fullDateLabel } from '../lib/date';

interface QuickAddSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  onMic: () => void;
}

/** Pantalla completa para sumar una tarea por texto desde cualquier lugar de la app; siempre se agrega para hoy. */
export function QuickAddSheet({ visible, onClose, onSubmit, onMic }: QuickAddSheetProps) {
  const insets = useSafeAreaInsets();
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
    <Modal animationType="slide" presentationStyle="pageSheet" visible={visible} onRequestClose={close}>
      <View style={[styles.container, { paddingTop: insets.top + space[5], paddingBottom: insets.bottom + space[5] }]}>
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <Text style={styles.date}>{fullDateLabel(todayISO())}</Text>
          <Pressable
            onPress={() => {
              close();
              onMic();
            }}
            style={[styles.headerSide, styles.micButton]}
            accessibilityRole="button"
            accessibilityLabel="Agregar con tu voz en su lugar"
            hitSlop={8}
          >
            <MicIcon size={18} color={colors.brand[700]} />
          </Pressable>
        </View>

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
            accessibilityLabel="Título de la tarea nueva"
          />
        </View>

        <Text style={styles.helper}>Se agrega para hoy. Puedes cambiar la hora después, tocando la tarea.</Text>

        <View style={styles.buttonRow}>
          <View style={styles.cancelWrap}>
            <Button label="Cancelar" variant="outline" onPress={close} />
          </View>
          <View style={styles.submitWrap}>
            <Button label="Agregar tarea" onPress={submit} disabled={draft.trim().length === 0} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5], gap: space[5] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerSide: { width: 32, height: 32 },
  micButton: { alignItems: 'center', justifyContent: 'center' },
  date: { ...type.caption, color: colors.ink[1], textAlign: 'center', flex: 1 },
  inputBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.brand[700],
    borderRadius: radius.panel,
    backgroundColor: colors.surface,
    padding: space[5],
  },
  input: { flex: 1, ...type.body, fontSize: 20, lineHeight: 27, color: colors.ink[1] },
  helper: { ...type.bodySm, color: colors.ink[3], textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: space[3] },
  cancelWrap: { flex: 0.85 },
  submitWrap: { flex: 1.3 },
});
