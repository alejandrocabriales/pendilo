import React, { useMemo, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, space, type } from '../theme/tokens';
import { addDays, monthShort, startOfWeek, weekDates, accessibleDayLabel } from '../lib/date';

export interface ContributionDay {
  date: string;
  count: number;
  hasOverdue: boolean;
}

interface ContributionGraphProps {
  /** Un valor por día, ya calculado por quien llama (sin depender de cómo se cuenta). */
  days: ContributionDay[];
  weeksShown: number;
  todayIso: string;
  selected: string;
  onSelect: (date: string) => void;
}

const CELL = 13;
const GAP = 4;
const ROW_LABELS = ['Lun', '', 'Mié', '', 'Vie', '', '']; // semana lunes→domingo

function levelColor(count: number): string {
  if (count <= 0) return colors.track;
  if (count === 1) return colors.brand[100];
  if (count === 2) return colors.brand[200];
  if (count === 3) return colors.brand[500];
  return colors.brand[700];
}

/**
 * Heatmap estilo "contribuciones" de GitHub: columnas = semanas (lunes→domingo),
 * filas = día de la semana. El color indica cuántas tareas se completaron ese día;
 * el cuadrado seleccionado lleva un borde para no depender solo del color (sección 8).
 */
export function ContributionGraph({ days, weeksShown, todayIso, selected, onSelect }: ContributionGraphProps) {
  const byDate = useMemo(() => {
    const map = new Map<string, ContributionDay>();
    days.forEach((d) => map.set(d.date, d));
    return map;
  }, [days]);

  const columns = useMemo(() => {
    const currentMonday = startOfWeek(todayIso);
    const firstMonday = addDays(currentMonday, -7 * (weeksShown - 1));
    return Array.from({ length: weeksShown }, (_, i) => weekDates(addDays(firstMonday, 7 * i)));
  }, [todayIso, weeksShown]);

  let lastMonth = '';
  const scrollRef = useRef<ScrollView>(null);
  const gridWidth = columns.length * (CELL + GAP);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <View>
        <View style={[styles.monthRow, { width: 28 + gridWidth }]}>
          {columns.map((week, i) => {
            const month = monthShort(week[0]);
            const show = month !== lastMonth;
            lastMonth = month;
            if (!show) return null;
            return (
              <Text key={i} numberOfLines={1} style={[styles.monthLabel, { left: 28 + i * (CELL + GAP) }]}>
                {month}
              </Text>
            );
          })}
        </View>

        <View style={styles.body}>
          <View style={styles.rowLabels}>
            {ROW_LABELS.map((label, i) => (
              <Text key={i} style={[styles.rowLabel, { height: CELL + GAP, lineHeight: CELL + GAP }]}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {columns.map((week, colIndex) => (
              <View key={colIndex} style={styles.column}>
                {week.map((date) => {
                  const info = byDate.get(date);
                  const count = info?.count ?? 0;
                  const isSelected = date === selected;
                  const isFuture = date > todayIso;
                  return (
                    <Pressable
                      key={date}
                      onPress={() => onSelect(date)}
                      accessibilityRole="button"
                      accessibilityLabel={`${accessibleDayLabel(date, count, info?.hasOverdue ?? false)}${date === todayIso ? ', hoy' : ''}`}
                      accessibilityState={{ selected: isSelected }}
                      style={[
                        styles.cell,
                        { backgroundColor: isFuture ? colors.paper : levelColor(count) },
                        isSelected ? styles.cellSelected : null,
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
        </View>
      </ScrollView>

      <View style={styles.legendRow}>
        <Text style={styles.legendLabel}>Menos</Text>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <View key={lvl} style={[styles.legendSwatch, { backgroundColor: levelColor(lvl) }]} />
        ))}
        <Text style={styles.legendLabel}>Más</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthRow: { height: 16, position: 'relative' },
  monthLabel: { ...type.caption, color: colors.ink[3], position: 'absolute', top: 0 },
  body: { flexDirection: 'row' },
  rowLabels: { width: 28, justifyContent: 'flex-start' },
  rowLabel: { ...type.caption, fontSize: 10, color: colors.ink[3] },
  grid: { flexDirection: 'row' },
  column: { gap: GAP },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 3,
    marginRight: GAP,
  },
  cellSelected: { borderWidth: 2, borderColor: colors.ink[1] },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: space[3] },
  legendLabel: { ...type.caption, color: colors.ink[3], marginHorizontal: 4 },
  legendSwatch: { width: CELL - 2, height: CELL - 2, borderRadius: 3 },
});
