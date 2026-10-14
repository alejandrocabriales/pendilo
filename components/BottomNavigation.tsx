import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, size, space, type } from '../theme/tokens';
import { SunIcon, CalendarIcon, RingIcon, MicIcon, PencilIcon } from './icons';

export type TabKey = 'hoy' | 'semana' | 'progreso';

interface BottomNavigationProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  onMic: () => void;
  onAddTask: () => void;
}

type TabSpec = { key: TabKey; label: string; Icon: typeof SunIcon };

const LEFT_TABS: TabSpec[] = [
  { key: 'hoy', label: 'Hoy', Icon: SunIcon },
  { key: 'semana', label: 'Semana', Icon: CalendarIcon },
];

const RIGHT_TABS: TabSpec[] = [{ key: 'progreso', label: 'Progreso', Icon: RingIcon }];

/**
 * Barra inferior propia (no el tab bar nativo). Layout balanceado: 2 tabs a la izquierda,
 * 2 a la derecha (la última es "Escribir", texto), y el micrófono flota centrado arriba
 * de la barra como botón de acción principal — la voz sigue siendo el camino preferido.
 */
export function BottomNavigation({ active, onChange, onMic, onAddTask }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  const renderTab = ({ key, label, Icon }: TabSpec) => {
    const selected = key === active;
    return (
      <Pressable
        key={key}
        onPress={() => onChange(key)}
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        accessibilityLabel={label}
        style={styles.tab}
      >
        <Icon size={22} color={selected ? colors.action.bg : colors.ink[3]} />
        <Text style={[styles.tabLabel, selected ? styles.tabLabelSelected : null]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space[2]) }]}>
        <View style={styles.side}>{LEFT_TABS.map(renderTab)}</View>
        <View style={styles.side}>
          {RIGHT_TABS.map(renderTab)}
          <Pressable
            onPress={onAddTask}
            accessibilityRole="button"
            accessibilityLabel="Escribir una tarea"
            style={styles.tab}
          >
            <PencilIcon size={22} color={colors.ink[3]} />
            <Text style={styles.tabLabel}>Escribir</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={onMic}
        accessibilityRole="button"
        accessibilityLabel="Hablar con Pendilo"
        style={({ pressed }) => [styles.mic, pressed ? styles.micPressed : null]}
      >
        <MicIcon size={28} color={colors.action.fg} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingTop: space[2],
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.panel,
    borderTopRightRadius: radius.panel,
    minHeight: size.nav,
    ...shadow.nav,
  },
  side: { flexDirection: 'row', gap: space[6] },
  tab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: size.touch, minHeight: size.touch },
  tabLabel: { ...type.caption, color: colors.ink[3] },
  tabLabelSelected: { color: colors.action.bg },
  mic: {
    position: 'absolute',
    top: -(size.mic / 2),
    left: '50%',
    marginLeft: -(size.mic / 2),
    width: size.mic,
    height: size.mic,
    borderRadius: radius.pill,
    backgroundColor: colors.action.bg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
  micPressed: { opacity: 0.9 },
});
