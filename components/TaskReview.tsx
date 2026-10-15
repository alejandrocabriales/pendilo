import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { colors, radius, space, type } from '../theme/tokens';
import type { ReviewItem, Provenance } from '../types/domain';
import { Chip, ChipKind } from './Chip';
import { SegmentedChoice } from './SegmentedChoice';
import { Stepper } from './Stepper';
import { Button } from './Button';
import { CloseIcon } from './icons';
import { addDays, minutesToLabel, relativeDayLabel } from '../lib/date';
import { copy } from '../data/copy';

function provenanceToChipKind(p: Provenance): ChipKind {
  if (p === 'said') return 'said';
  if (p === 'suggested') return 'suggested';
  return 'missing';
}

interface TaskReviewProps {
  items: ReviewItem[];
  nowDate: string;
  onEditDate: (id: string, date: string) => void;
  onEditMinutes: (id: string, minutes: number | null) => void;
  onEditGoalTarget: (id: string, target: number) => void;
  onEditUnclearFix: (id: string, fix: string) => void;
  onConvertUnclear: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TaskReview({
  items,
  nowDate,
  onEditDate,
  onEditMinutes,
  onEditGoalTarget,
  onEditUnclearFix,
  onConvertUnclear,
  onRemove,
}: TaskReviewProps) {
  const dayOptions = [0, 1, 2, 3].map((offset) => {
    const date = addDays(nowDate, offset);
    return { value: date, label: relativeDayLabel(date, nowDate) };
  });

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Pressable
            onPress={() => onRemove(item.id)}
            accessibilityRole="button"
            accessibilityLabel="Quitar"
            hitSlop={8}
            style={styles.remove}
          >
            <CloseIcon size={18} color={colors.ink[3]} />
          </Pressable>

          {item.type === 'task' ? (
            <>
              <Text style={styles.kicker}>Tarea</Text>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.chipsRow}>
                <Chip
                  kind={provenanceToChipKind(item.provenance.date)}
                  label={item.date ? relativeDayLabel(item.date, nowDate) : 'Día sin definir'}
                />
                <Chip
                  kind={provenanceToChipKind(item.provenance.minutes)}
                  label={item.minutes != null ? minutesToLabel(item.minutes) : 'Sin hora'}
                />
              </View>
              <SegmentedChoice options={dayOptions} value={item.date ?? ''} onChange={(date) => onEditDate(item.id, date)} />
              <Stepper
                label="Hora"
                valueLabel={item.minutes != null ? minutesToLabel(item.minutes) : 'Sin hora'}
                stepAccessibilityLabel="30 minutos"
                onMinus={() => onEditMinutes(item.id, Math.max((item.minutes ?? 540) - 30, 0))}
                onPlus={() => onEditMinutes(item.id, Math.min((item.minutes ?? 540) + 30, 23 * 60 + 30))}
              />
            </>
          ) : null}

          {item.type === 'goal' ? (
            <>
              <Text style={styles.kicker}>Objetivo semanal</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Chip kind={provenanceToChipKind(item.provenance.target)} label={`Meta: ${item.target}`} />
              <Stepper
                label="Meta"
                valueLabel={`${item.target}`}
                onMinus={() => onEditGoalTarget(item.id, Math.max(item.target - 1, 1))}
                onPlus={() => onEditGoalTarget(item.id, item.target + 1)}
              />
            </>
          ) : null}

          {item.type === 'unclear' ? (
            <>
              <Text style={styles.kicker}>Frase poco clara</Text>
              <Text style={styles.quote}>&quot;{item.quote}&quot;</Text>
              <Text style={styles.prompt}>{copy.errors.unclear.prompt}</Text>
              <TextInput
                value={item.fix}
                onChangeText={(text) => onEditUnclearFix(item.id, text)}
                placeholder="¿Qué era?"
                placeholderTextColor={colors.ink[4]}
                style={styles.input}
                accessibilityLabel="Aclaración de la frase poco clara"
              />
              <Button
                label={copy.errors.unclear.cta}
                small
                variant="secondary"
                disabled={item.fix.trim().length === 0}
                disabledHint="Escribí la aclaración primero"
                onPress={() => onConvertUnclear(item.id)}
              />
            </>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space[3] },
  card: { backgroundColor: colors.surface, borderRadius: radius.card, padding: space[4], gap: space[3] },
  remove: { position: 'absolute', top: space[3], right: space[3], zIndex: 1 },
  kicker: { ...type.overline, color: colors.ink[4] },
  title: { ...type.card, color: colors.ink[1], paddingRight: space[6] },
  chipsRow: { flexDirection: 'row', gap: space[2], flexWrap: 'wrap' },
  quote: { ...type.body, color: colors.ink[2], fontStyle: 'italic' },
  prompt: { ...type.bodySm, color: colors.ink[3] },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.chip,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    ...type.body,
    color: colors.ink[1],
  },
});
