import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, size, space, type } from '../theme/tokens';
import { copy } from '../data/copy';

interface IdeaPromptCardProps {
  onAddIdea: (title: string) => void;
  /** Tareas ya agendadas para mañana; si hay, reemplaza el aviso de "mañana libre". */
  tomorrowCount?: number;
}

/** Invita a sumar algo nuevo por voz o con una idea rápida, una vez que no queda nada pendiente hoy. */
export function IdeaPromptCard({ onAddIdea, tomorrowCount = 0 }: IdeaPromptCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.prompt}>{copy.celebration.dayCard.prompt}</Text>

      <View style={styles.ideasList}>
        {copy.celebration.dayCard.ideas.map((idea) => (
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

      <Text style={styles.hint}>
        {tomorrowCount > 0
          ? `Mañana ya ${tomorrowCount === 1 ? 'tenés 1 tarea' : `tenés ${tomorrowCount} tareas`}.`
          : copy.celebration.dayCard.tomorrowFree}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.panel, padding: space[5], gap: space[4] },
  prompt: { ...type.body, color: colors.ink[1] },
  ideasList: { gap: space[2] },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
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
  hint: { ...type.caption, color: colors.ink[3] },
});
