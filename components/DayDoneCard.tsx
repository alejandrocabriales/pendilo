import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, shadow, size, space, type } from '../theme/tokens';
import { PendiloMascot } from './PendiloMascot';
import { Button } from './Button';
import { MicIcon } from './icons';
import { copy } from '../data/copy';

const IDEAS = ['Tomar agua', 'Estirar 5 min', 'Planificar mañana'];

interface DayDoneCardProps {
  onMic: () => void;
  onOpenWrite: () => void;
  onAddIdea: (title: string) => void;
  /** Racha de días seguidos cerrando el día; se muestra solo si ya vale la pena (≥ 2). */
  streakDays?: number;
  /** Tareas ya agendadas para mañana; si hay, se muestra como anticipo breve. */
  tomorrowCount?: number;
}

/** Reemplaza la lista de hoy cuando ya no queda nada pendiente: invita a sumar algo nuevo, de voz o por texto. */
export function DayDoneCard({ onMic, onOpenWrite, onAddIdea, streakDays = 0, tomorrowCount = 0 }: DayDoneCardProps) {
  return (
    <View style={styles.card}>
      <PendiloMascot mood="celebrating" size={72} />
      <Text style={styles.title}>{copy.celebration.day.title}</Text>
      <Text style={styles.body}>{copy.celebration.day.body}</Text>
      {streakDays >= 2 ? <Text style={styles.streak}>Llevás {streakDays} días seguidos cerrando el día.</Text> : null}

      <View style={styles.divider} />

      <View style={styles.promptRow}>
        <PendiloMascot mood="listening" size={48} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{copy.celebration.day.prompt}</Text>
        </View>
      </View>

      <Pressable
        onPress={onMic}
        accessibilityRole="button"
        accessibilityLabel="Agregar algo con tu voz"
        style={({ pressed }) => [styles.mic, pressed ? styles.micPressed : null]}
      >
        <MicIcon size={30} color={colors.action.fg} />
      </Pressable>
      <Text style={styles.micHint}>Hablar</Text>

      <Button label="Escribir una tarea" variant="secondary" onPress={onOpenWrite} />

      <View style={styles.ideasBlock}>
        <Text style={styles.ideasLabel}>O elegí una idea rápida</Text>
        <View style={styles.ideasRow}>
          {IDEAS.map((idea) => (
            <Pressable
              key={idea}
              onPress={() => onAddIdea(idea)}
              accessibilityRole="button"
              accessibilityLabel={`Agregar tarea sugerida: ${idea}`}
              style={({ pressed }) => [styles.chip, pressed ? styles.chipPressed : null]}
            >
              <Text style={styles.chipSymbol}>✦</Text>
              <Text style={styles.chipLabel}>{idea}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {tomorrowCount > 0 ? (
        <Text style={styles.tomorrow}>
          Mañana ya {tomorrowCount === 1 ? 'tenés 1 tarea' : `tenés ${tomorrowCount} tareas`}.
        </Text>
      ) : null}
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
  body: { ...type.body, color: colors.ink[2], textAlign: 'center' },
  streak: { ...type.caption, color: colors.brand[700], marginTop: space[1] },
  divider: { height: 1, backgroundColor: colors.line, alignSelf: 'stretch', marginVertical: space[4] },
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], alignSelf: 'stretch' },
  bubble: { flex: 1, backgroundColor: colors.panel, borderRadius: radius.chip, padding: space[3] },
  bubbleText: { ...type.body, color: colors.ink[1] },
  mic: {
    width: size.mic,
    height: size.mic,
    borderRadius: radius.pill,
    backgroundColor: colors.action.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space[4],
    ...shadow.fab,
  },
  micPressed: { opacity: 0.9 },
  micHint: { ...type.caption, color: colors.ink[3], marginTop: space[1], marginBottom: space[3] },
  ideasBlock: { alignSelf: 'stretch', gap: space[2], marginTop: space[3] },
  ideasLabel: { ...type.caption, color: colors.ink[3] },
  ideasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    minHeight: size.touch,
    paddingHorizontal: space[3],
    borderRadius: radius.chip,
    backgroundColor: colors.suggest.bg,
    borderWidth: 1,
    borderColor: colors.suggest.fg,
    borderStyle: 'dashed',
  },
  chipPressed: { opacity: 0.8 },
  chipSymbol: { ...type.caption, color: colors.suggest.fg },
  chipLabel: { ...type.caption, color: colors.suggest.fg },
  tomorrow: { ...type.caption, color: colors.ink[3], marginTop: space[3] },
});
