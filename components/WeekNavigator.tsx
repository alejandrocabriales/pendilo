import React from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, space, size, type } from '../theme/tokens';
import { AlertIcon } from './icons';
import { dayOfMonth, weekdayShort, accessibleDayLabel } from '../lib/date';

export interface WeekNavigatorDay {
  date: string;
  taskCount: number;
  hasOverdue: boolean;
  isToday: boolean;
}

interface WeekNavigatorProps {
  days: WeekNavigatorDay[];
  selected: string;
  onSelect: (date: string) => void;
}

export function WeekNavigator({ days, selected, onSelect }: WeekNavigatorProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {days.map((day) => {
        const isSelected = day.date === selected;
        return (
          <Pressable
            key={day.date}
            onPress={() => onSelect(day.date)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={accessibleDayLabel(day.date, day.taskCount, day.hasOverdue)}
            style={[styles.day, isSelected ? styles.daySelected : null]}
          >
            <Text style={[styles.weekday, isSelected ? styles.textSelected : null]}>{weekdayShort(day.date)}</Text>
            <Text style={[styles.number, isSelected ? styles.textSelected : null]}>{dayOfMonth(day.date)}</Text>
            <View style={styles.footerRow}>
              {day.hasOverdue ? <AlertIcon size={12} color={isSelected ? colors.surface : colors.danger.fg} /> : null}
              <Text style={[styles.count, isSelected ? styles.textSelected : null]}>{day.taskCount}</Text>
            </View>
            {day.isToday ? <View style={[styles.todayDot, isSelected ? styles.todayDotSelected : null]} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: space[2], paddingHorizontal: space[1] },
  day: {
    width: 52,
    minHeight: size.touch + 16,
    borderRadius: radius.day,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[2],
    gap: 2,
  },
  daySelected: { backgroundColor: colors.action.bg },
  weekday: { ...type.caption, color: colors.ink[3] },
  number: { ...type.card, color: colors.ink[1] },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  count: { ...type.caption, color: colors.ink[3] },
  textSelected: { color: colors.surface },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.brand[700], marginTop: 2 },
  todayDotSelected: { backgroundColor: colors.surface },
});
